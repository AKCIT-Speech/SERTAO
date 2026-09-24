import type { AudioSample } from '../types';
import { emotionMeta } from '../lib/emotions';
import { formatDuration } from '../lib/format';
import AudioPlayer from './AudioPlayer';

interface AudioCardProps {
  sample: AudioSample;
  /** Position within the current result list, shown as a specimen number. */
  index?: number;
}

export default function AudioCard({ sample, index }: AudioCardProps) {
  const meta = emotionMeta(sample.label);
  const specimen = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;

  return (
    <article
      className="group relative flex flex-col gap-3 rounded-card border border-line bg-ink-800/50 p-4
        transition-colors hover:border-line/80 hover:bg-ink-800/80"
    >
      {/* Emotion colour spine */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: meta.color }}
      />

      <header className="flex items-start justify-between gap-3 pl-2">
        <h3 className="min-w-0 font-display text-sm font-medium leading-tight text-paper">
          {meta.en}
          <span className="text-muted"> / {meta.pt}</span>
        </h3>
        {specimen && (
          <p className="shrink-0 font-mono text-[10px] tracking-label text-faint">№{specimen}</p>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-1.5 pl-2">
        <span className="inline-flex items-center rounded-pill border border-line bg-ink-900 px-1.5 py-[2px] font-mono text-[10px] uppercase tracking-label text-muted">
          {formatDuration(sample.duration_seconds)}
        </span>
      </div>

      <div className="pl-2">
        <AudioPlayer
          id={sample.id}
          src={sample.audio_url}
          color={meta.color}
          title={`${meta.en} sample${specimen ? ` ${specimen}` : ''}`}
          metadataDuration={sample.duration_seconds}
        />
      </div>
    </article>
  );
}
