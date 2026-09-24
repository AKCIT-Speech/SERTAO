import type { EmotionLabel } from '../types';
import { EMOTIONS, FULL_DATASET_TOTAL, emotionInk, emotionMeta } from '../lib/emotions';
import { formatInteger } from '../lib/format';
import ThemeToggle from './ThemeToggle';

interface HeroProps {
  curatedTotal: number;
  selected: EmotionLabel | 'all';
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
  selected,
}: HeroProps) {
  const focusedEmotion = selected !== 'all' ? selected : null;
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

      <div className="relative mx-auto max-w-6xl px-5 pb-9 pt-7 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-display text-sm font-semibold tracking-[0.16em] text-paper">SERTÃO</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span className="label-mono">speech emotion / pt-BR</span>
          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </div>

        <h1 className="mt-14 font-display text-5xl font-bold leading-none tracking-tight text-paper sm:mt-20 sm:text-7xl">
          SERTÃO
        </h1>

        <p className="mt-4 font-mono text-xs uppercase tracking-label text-muted">
          Brazilian Portuguese / speech emotion dataset
        </p>

        <div className="mt-9 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
          <HeroStat
            value={String(EMOTIONS.length)}
            label="classes"
            accent={focusedEmotion ? emotionInk(focusedEmotion) : undefined}
          />
          <HeroStat value={formatInteger(FULL_DATASET_TOTAL)} label="full corpus" />
          <HeroStat value={formatInteger(curatedTotal)} label="audio samples" />
          <HeroStat value="pt-BR" label="language" />
        </div>

        <p className="sr-only" aria-live="polite">
          {focusedMeta ? `${focusedMeta.en} / ${focusedMeta.pt}` : 'SERTÃO emotion classes'}
        </p>
      </div>
    </header>
  );
}
