import type { AudioSample } from '../types';
import { emotionMeta } from '../lib/emotions';
import { formatDuration } from '../lib/format';
import type { Language } from '../lib/i18n';
import AudioPlayer from './AudioPlayer';

interface AudioCardProps {
  sample: AudioSample;
  language: Language;
}

export default function AudioCard({ sample, language }: AudioCardProps) {
  const meta = emotionMeta(sample.label);
  const primary = language === 'pt' ? meta.pt : meta.en;
  const secondary = language === 'pt' ? meta.en : meta.pt;

  return (
    <article className="grid gap-3 border-b border-line py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:gap-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-label text-paper" title={sample.filename}>{sample.id}</p>
          <p className="mt-1 font-mono text-[11px] text-muted">{formatDuration(sample.duration_seconds, language)}</p>
        </div>
      </div>
      <AudioPlayer
        id={sample.id}
        src={sample.audio_url}
        color={meta.color}
        title={`${primary} / ${secondary}, ${sample.id}`}
        metadataDuration={sample.duration_seconds}
        language={language}
      />
    </article>
  );
}
