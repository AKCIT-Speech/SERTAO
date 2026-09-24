import { useState } from 'react';
import { ArrowDown, Boxes } from 'lucide-react';
import type { EmotionLabel } from '../types';
import { EMOTIONS, FULL_DATASET_TOTAL, emotionInk, emotionMeta } from '../lib/emotions';
import { formatInteger } from '../lib/format';
import EmotionSignalRail from './EmotionSignalRail';
import ThemeToggle from './ThemeToggle';

interface HeroProps {
  curatedTotal: number;
  counts: Record<EmotionLabel, number>;
  selected: EmotionLabel | 'all';
  onSelectEmotion: (label: EmotionLabel) => void;
  onExplore: () => void;
  onViewOverview: () => void;
}

function HeroStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="border-l border-line pl-3">
      <p
        className="font-display text-xl font-semibold leading-none tracking-tight sm:text-2xl"
        style={{ color: accent ?? 'var(--solid-text)' }}
      >
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-label text-muted">{label}</p>
    </div>
  );
}

export default function Hero({
  curatedTotal,
  counts,
  selected,
  onSelectEmotion,
  onExplore,
  onViewOverview,
}: HeroProps) {
  const [hovered, setHovered] = useState<EmotionLabel | null>(null);
  const focusedEmotion = hovered ?? (selected !== 'all' ? selected : null);
  const focusedMeta = focusedEmotion ? emotionMeta(focusedEmotion) : null;

  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* Single soft wash tinted by the currently focused class — no gradient stacks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-30 blur-3xl transition-colors duration-500"
        style={{
          background: `radial-gradient(60% 100% at 50% 100%, ${focusedMeta?.color ?? 'var(--solid-line)'} 0%, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label-mono">Speech emotion recognition</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span className="label-mono">Brazilian Portuguese</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span className="label-mono">Interactive research demo</span>
          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-6xl">
          SERTÃO Emotion Dataset
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Interactive audio samples of Brazilian Portuguese speech across seven emotion classes.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          <HeroStat
            value={String(EMOTIONS.length)}
            label="emotions"
            accent={focusedEmotion ? emotionInk(focusedEmotion) : undefined}
          />
          <HeroStat value={formatInteger(FULL_DATASET_TOTAL)} label="total samples" />
          <HeroStat value={formatInteger(curatedTotal)} label="curated examples" />
          <HeroStat value="pt-BR" label="Brazilian Portuguese" />
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 rounded-card bg-paper px-5 py-3 font-display text-sm
              font-semibold text-ink-900 transition-opacity hover:opacity-90 focus-visible:ring-2"
          >
            Explore audio samples
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onViewOverview}
            className="inline-flex items-center gap-2 rounded-card border border-line bg-transparent px-5 py-3
              font-display text-sm font-medium text-paper transition-colors hover:border-paper/60
              focus-visible:ring-2"
          >
            <Boxes className="h-4 w-4" aria-hidden="true" />
            View dataset overview
          </button>
        </div>

        <div className="mt-12">
          <EmotionSignalRail
            counts={counts}
            selected={selected}
            onSelect={onSelectEmotion}
            onHover={setHovered}
          />
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted" aria-live="polite">
            {focusedMeta
              ? `${focusedMeta.en} / ${focusedMeta.pt} — ${focusedMeta.note}`
              : 'Hover or activate a segment to inspect a class; activating filters the sample gallery.'}
          </p>
        </div>
      </div>
    </header>
  );
}
