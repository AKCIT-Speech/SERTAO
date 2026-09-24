import { useMemo } from 'react';

interface WaveformProps {
  /** Any stable string; the same seed always draws the same shape. */
  seed: string;
  color: string;
  /** 0..1 playback position. Bars behind the playhead render at full colour. */
  progress?: number;
  bars?: number;
  className?: string;
  /** Height in px of the drawing area. */
  height?: number;
}

/** Deterministic pseudo-random generator (mulberry32) seeded from a string. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Decorative waveform. It is a stable visual fingerprint of the file's
 * identifier, not an analysis of the signal — the page never claims otherwise,
 * and it is hidden from assistive technology.
 */
export default function Waveform({
  seed,
  color,
  progress = 0,
  bars = 48,
  className = '',
  height = 36,
}: WaveformProps) {
  const amplitudes = useMemo(() => {
    const rand = seededRandom(seed);
    const values: number[] = [];
    for (let i = 0; i < bars; i += 1) {
      // Envelope shaped like a spoken utterance: quiet edges, busy middle.
      const position = i / (bars - 1);
      const envelope = 0.35 + 0.65 * Math.sin(Math.PI * position) ** 0.7;
      const jitter = 0.35 + rand() * 0.65;
      values.push(Math.max(0.08, Math.min(1, envelope * jitter)));
    }
    return values;
  }, [seed, bars]);

  const playedBars = Math.round(Math.min(1, Math.max(0, progress)) * bars);

  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-[2px] ${className}`}
      style={{ height }}
    >
      {amplitudes.map((amplitude, index) => (
        <span
          key={index}
          className="flex-1 rounded-[1px] transition-[opacity,background-color] duration-150"
          style={{
            height: `${Math.round(amplitude * 100)}%`,
            minWidth: 1,
            backgroundColor: color,
            opacity: index < playedBars ? 0.95 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
