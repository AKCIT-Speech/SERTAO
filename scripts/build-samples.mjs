/**
 * build-samples.mjs
 *
 * Reads the raw dataset folders (./sertao/<emotion>/audio/*.wav), copies every
 * file into ./public/audio/sertao/<emotion>/ and emits ./public/data/samples.json.
 *
 * Everything the site displays is derived here from the files that actually
 * exist on disk:
 *   - curated counts per emotion  -> number of .wav files in each folder
 *   - duration_seconds            -> parsed from the WAV fmt/data chunks
 *   - source                      -> "CORAA human-review" when the filename
 *                                    carries a coraa- identifier, else "SERTAO"
 *   - split                       -> deterministic, reproducible 70/15/15
 *                                    stratified partition (see NOTE below)
 *   - speaker                     -> always null, the dataset ships no
 *                                    speaker identifiers
 *
 * NOTE ON SPLITS: the source metadata contains no official train/valid/test
 * partition. The split assigned here is a *demo* partition produced by a stable
 * hash of the filename so the UI can exercise its split filter. This is stated
 * explicitly in the site's Methodology section; it must not be read as an
 * official dataset split.
 *
 * Paths are resolved relative to the repository root. No absolute path is ever
 * written into the generated JSON - audio_url is always "/audio/sertao/...".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const SOURCE_ROOT = path.join(ROOT, 'sertao');
const PUBLIC_AUDIO_ROOT = path.join(ROOT, 'public', 'audio', 'sertao');
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data');

/** Canonical emotion order used across the whole site. */
const EMOTIONS = [
  { label: 'angry', label_pt: 'Raiva' },
  { label: 'disgust', label_pt: 'Nojo' },
  { label: 'fear', label_pt: 'Medo' },
  { label: 'happy', label_pt: 'Alegria' },
  { label: 'neutral', label_pt: 'Neutro' },
  { label: 'sad', label_pt: 'Tristeza' },
  { label: 'surprise', label_pt: 'Surpresa' },
];

const SOURCE_SERTAO = 'SERTÃO';
const SOURCE_CORAA = 'CORAA human-review';

/* ------------------------------------------------------------------ helpers */

/** Reads duration (seconds) out of a RIFF/WAVE header. Returns null if unreadable. */
function readWavDuration(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const size = fs.fstatSync(fd).size;
    // 64 KiB is far more than enough to walk past any fmt/LIST chunks.
    const headerLength = Math.min(size, 65536);
    const head = Buffer.alloc(headerLength);
    fs.readSync(fd, head, 0, headerLength, 0);

    if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WAVE') {
      return null;
    }

    let byteRate = 0;
    let sampleRate = 0;
    let channels = 0;
    let bitsPerSample = 0;
    let dataBytes = 0;
    let cursor = 12;

    while (cursor + 8 <= head.length) {
      const chunkId = head.toString('ascii', cursor, cursor + 4);
      const chunkSize = head.readUInt32LE(cursor + 4);

      if (chunkId === 'fmt ' && cursor + 8 + 16 <= head.length) {
        channels = head.readUInt16LE(cursor + 10);
        sampleRate = head.readUInt32LE(cursor + 12);
        byteRate = head.readUInt32LE(cursor + 16);
        bitsPerSample = head.readUInt16LE(cursor + 22);
      }

      if (chunkId === 'data') {
        // A streamed file can declare size 0 / 0xFFFFFFFF; fall back to real size.
        const declared = chunkSize;
        const remaining = size - (cursor + 8);
        dataBytes = declared > 0 && declared <= remaining ? declared : remaining;
        break;
      }

      cursor += 8 + chunkSize + (chunkSize % 2);
    }

    if (!dataBytes) return null;

    const effectiveByteRate =
      byteRate > 0 ? byteRate : (sampleRate * channels * bitsPerSample) / 8;
    if (!effectiveByteRate) return null;

    return Math.round((dataBytes / effectiveByteRate) * 100) / 100;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/** Filenames such as `medo_002_coraa-45274_sp_.wav` come from CORAA human-review. */
function detectSource(filename) {
  return /coraa/i.test(filename) ? SOURCE_CORAA : SOURCE_SERTAO;
}

/** Small, stable string hash (FNV-1a) so splits never change between runs. */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Deterministic stratified split: inside each emotion the files are ordered by
 * hash, then cut 70 / 15 / 15. Same inputs always produce the same output.
 */
function assignSplits(filenames, label) {
  const ordered = [...filenames].sort(
    (a, b) => hash(`${label}/${a}`) - hash(`${label}/${b}`) || a.localeCompare(b),
  );
  const total = ordered.length;
  const validCount = total >= 7 ? Math.max(1, Math.round(total * 0.15)) : total >= 3 ? 1 : 0;
  const testCount = total >= 7 ? Math.max(1, Math.round(total * 0.15)) : total >= 2 ? 1 : 0;

  const map = new Map();
  ordered.forEach((name, index) => {
    if (index < total - validCount - testCount) map.set(name, 'train');
    else if (index < total - testCount) map.set(name, 'valid');
    else map.set(name, 'test');
  });
  return map;
}

function rmDirContents(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

/* --------------------------------------------------------------------- build */

function build() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error(`[build-samples] Source folder not found: ${path.relative(ROOT, SOURCE_ROOT)}`);
    process.exit(1);
  }

  fs.mkdirSync(PUBLIC_AUDIO_ROOT, { recursive: true });
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

  const samples = [];
  const perEmotion = [];
  const warnings = [];

  for (const { label, label_pt } of EMOTIONS) {
    const sourceDir = path.join(SOURCE_ROOT, label, 'audio');
    const targetDir = path.join(PUBLIC_AUDIO_ROOT, label);

    fs.mkdirSync(targetDir, { recursive: true });
    rmDirContents(targetDir);

    if (!fs.existsSync(sourceDir)) {
      warnings.push(`no audio folder for "${label}"`);
      perEmotion.push({ label, label_pt, curated: 0 });
      continue;
    }

    const files = fs
      .readdirSync(sourceDir)
      .filter((f) => f.toLowerCase().endsWith('.wav'))
      .sort((a, b) => a.localeCompare(b, 'en'));

    const splitByFile = assignSplits(files, label);

    files.forEach((filename, index) => {
      const absolute = path.join(sourceDir, filename);
      fs.copyFileSync(absolute, path.join(targetDir, filename));

      const duration = readWavDuration(absolute);
      if (duration === null) warnings.push(`unreadable WAV header: ${label}/${filename}`);

      samples.push({
        id: `${label}-${String(index + 1).padStart(2, '0')}`,
        filename,
        label,
        label_pt,
        source: detectSource(filename),
        split: splitByFile.get(filename) ?? 'train',
        language: 'Portuguese',
        // Relative, web-style URL only. Never an OS path.
        audio_url: `/audio/sertao/${label}/${filename}`,
        duration_seconds: duration,
        speaker: null,
      });
    });

    perEmotion.push({ label, label_pt, curated: files.length });
  }

  const totalDuration = samples.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0);

  const manifest = {
    dataset: 'SERTÃO Emotion Dataset',
    version: '0.1.0-demo',
    generated_at: new Date().toISOString(),
    language: 'Brazilian Portuguese',
    sources: [SOURCE_SERTAO, SOURCE_CORAA],
    // Counted from the files present on disk - not a hardcoded figure.
    curated_total: samples.length,
    emotion_classes: EMOTIONS.length,
    curated_duration_seconds: Math.round(totalDuration * 100) / 100,
    notes: {
      speaker:
        'Speaker identifiers are not available in the current metadata; every sample reports speaker: null.',
      split:
        'train/valid/test values are a reproducible 70/15/15 demo partition generated by scripts/build-samples.mjs. The source metadata ships no official split.',
      counts:
        'All counts shown in the site are computed from this file, which mirrors the audio files present in public/audio/sertao/.',
    },
    per_emotion: perEmotion,
    samples,
  };

  const outFile = path.join(PUBLIC_DATA_DIR, 'samples.json');
  fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const summary = [
    '[build-samples] done',
    ...perEmotion.map((e) => `  ${e.label.padEnd(9)} ${String(e.curated).padStart(3)} files`),
    `  ${'TOTAL'.padEnd(9)} ${String(samples.length).padStart(3)} files`,
    `  duration: ${Math.round(totalDuration)}s`,
    `  json: ${path.relative(ROOT, outFile).split(path.sep).join('/')}`,
    ...warnings.map((w) => `  warning: ${w}`),
  ].join('\n');

  console.log(summary);
  // Terminal capture is unreliable on some shells; keep a log next to the JSON.
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'build-report.txt'), `${summary}\n`, 'utf8');
}

build();
