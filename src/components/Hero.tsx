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
      <div className="sertao-landscape" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="sertao-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--sertao-sky-top)" />
              <stop offset="100%" stopColor="var(--sertao-sky-bottom)" />
            </linearGradient>
            <radialGradient id="sertao-sun-glow">
              <stop offset="0%" stopColor="var(--sertao-sun)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--sertao-sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1200" height="420" fill="url(#sertao-sky)" opacity="0.55" />
          <circle cx="944" cy="112" r="118" fill="url(#sertao-sun-glow)" />
          <circle cx="944" cy="112" r="42" fill="var(--sertao-sun)" opacity="0.82" />

          <path
            d="M0 332C126 284 219 302 327 326c125 28 221 18 331-7 118-27 219-39 322-16 91 20 145 29 220 11v106H0Z"
            fill="var(--sertao-dune-back)"
            opacity="0.62"
          />
          <path
            d="M0 366c122-36 227-15 335 3 119 20 201 8 306-8 146-23 239-5 344 19 88 20 147 18 215-3v43H0Z"
            fill="var(--sertao-dune-front)"
            opacity="0.86"
          />

          <g fill="var(--sertao-cactus)" opacity="0.92">
            <path transform="matrix(0.35 0 0 0.35 32 249)" d="M138 364v-76c0-7 5-12 12-12s12 5 12 12v28h13v-17c0-7 5-12 12-12s12 5 12 12v29c0 11-9 20-20 20h-17v16Z" />
            <path transform="matrix(0.35 0 0 0.35 680 249)" d="M1028 367v-94c0-8 6-14 14-14s14 6 14 14v35h17v-22c0-8 6-14 14-14s14 6 14 14v36c0 12-10 22-22 22h-23v23Z" />
          </g>

          <g fill="var(--sertao-cactus-dark)">
            <path transform="matrix(0.35 0 0 0.35 204 249)" d="M274 374v-112c0-9 7-16 16-16s16 7 16 16v42h24v-25c0-9 7-16 16-16s16 7 16 16v38c0 15-12 27-27 27h-29v30Z" />
            <path transform="matrix(0.35 0 0 0.35 524 249)" d="M788 378v-76c0-8 6-14 14-14s14 6 14 14v27h20v-18c0-8 6-14 14-14s14 6 14 14v31c0 12-10 22-22 22h-26v14Z" />
          </g>
        </svg>
      </div>

      {/* Single soft wash tinted by the currently focused class — no gradient stacks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-30 blur-3xl transition-colors duration-500"
        style={{
          background: `radial-gradient(60% 100% at 50% 100%, ${focusedMeta?.color ?? 'var(--solid-line)'} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-9 pt-7 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-display text-sm font-semibold tracking-[0.16em] text-paper">SERTAO</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span className="label-mono">speech emotion / pt-BR</span>
          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </div>

        <h1 className="mt-14 font-display text-5xl font-bold leading-none tracking-tight text-paper sm:mt-20 sm:text-7xl">
          SERTAO
        </h1>

        <div className="mt-5 flex max-w-3xl flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
          <span>
            <strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">S</strong>pontaneous
          </span>
          <span aria-hidden="true" className="text-faint">·</span>
          <span>
            <strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">E</strong>motion
          </span>
          <span aria-hidden="true" className="text-faint">·</span>
          <span>
            <strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">R</strong>ecognition
          </span>
          <span aria-hidden="true" className="text-faint">·</span>
          <span>
            <strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">T</strong>hrough
          </span>
          <span aria-hidden="true" className="text-faint">·</span>
          <span>
            <strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">A</strong>udi<strong className="font-display text-base font-bold leading-none tracking-tight text-paper sm:text-lg">o</strong>
          </span>
        </div>

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
          {focusedMeta ? `${focusedMeta.en} / ${focusedMeta.pt}` : 'SERTAO emotion classes'}
        </p>
      </div>
    </header>
  );
}
