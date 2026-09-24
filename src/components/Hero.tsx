import { BENCHMARK } from '../lib/benchmark';
import { copy, formatCount, formatDecimal, type Language } from '../lib/i18n';
import ThemeToggle from './ThemeToggle';

interface HeroProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Hero({ language, onLanguageChange }: HeroProps) {
  const t = copy[language];

  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="sertao-landscape" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="sertao-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--sertao-sky-top)" />
              <stop offset="100%" stopColor="var(--sertao-sky-bottom)" />
            </linearGradient>
          </defs>
          <rect width="1200" height="420" fill="url(#sertao-sky)" opacity="0.55" />
          <circle cx="944" cy="112" r="42" fill="var(--sertao-sun)" opacity="0.82" />
          <path d="M0 332C126 284 219 302 327 326c125 28 221 18 331-7 118-27 219-39 322-16 91 20 145 29 220 11v106H0Z" fill="var(--sertao-dune-back)" opacity="0.62" />
          <path d="M0 366c122-36 227-15 335 3 119 20 201 8 306-8 146-23 239-5 344 19 88 20 147 18 215-3v43H0Z" fill="var(--sertao-dune-front)" opacity="0.86" />
          <g fill="var(--sertao-cactus-dark)">
            <path transform="matrix(0.35 0 0 0.35 204 249)" d="M274 374v-112c0-9 7-16 16-16s16 7 16 16v42h24v-25c0-9 7-16 16-16s16 7 16 16v38c0 15-12 27-27 27h-29v30Z" />
            <path transform="matrix(0.35 0 0 0.35 524 249)" d="M788 378v-76c0-8 6-14 14-14s14 6 14 14v27h20v-18c0-8 6-14 14-14s14 6 14 14v31c0 12-10 22-22 22h-26v14Z" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-6 sm:px-8 sm:pb-14">
        <div className="flex flex-wrap items-center gap-4 border-b border-line pb-5">
          <span className="font-mono text-xs font-semibold tracking-[0.16em] text-paper">SERTAO</span>
          <span className="label-mono">{t.corpusType}</span>
          <div className="ml-auto flex items-center gap-3">
            <div role="group" aria-label={language === 'pt' ? 'Idioma da interface' : 'Interface language'} className="inline-flex items-center rounded-card border border-line bg-ink-800 p-1">
              {(['pt', 'en'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onLanguageChange(option)}
                  aria-pressed={language === option}
                  aria-label={option === 'pt' ? 'Português' : 'English'}
                  className={`rounded-card px-2 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors focus-visible:ring-2 ${language === option ? 'bg-ink-950 text-paper' : 'text-muted hover:text-paper'}`}
                >
                  {option === 'pt' ? 'PT' : 'EN'}
                </button>
              ))}
            </div>
            <ThemeToggle language={language} />
          </div>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pt-14">
          <div>
            <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-paper sm:text-7xl lg:text-8xl">SERTAO</h1>
            <p className="mt-5 max-w-xl font-display text-lg leading-snug text-paper sm:text-xl">
              Spontaneous Emotion Recognition Through Audio
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{t.abstract}</p>
          </div>

          <aside className="self-start border-t-2 border-paper pt-4 lg:mt-1" aria-label={t.benchmark}>
            <h2 className="label-mono text-paper">{t.benchmark}</h2>
            <dl className="mt-4 divide-y divide-line border-b border-line">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted">{t.utterances}</dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-paper">{formatCount(BENCHMARK.utterances, language)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted">{t.classes}</dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-paper">{BENCHMARK.emotionClasses}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted">{t.language}</dt>
                <dd className="font-mono text-sm font-medium text-paper">{BENCHMARK.language}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted">{t.duration}</dt>
                <dd className="font-mono text-sm font-medium tabular-nums text-paper">{formatDecimal(BENCHMARK.minutes, language, 1)} min</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </header>
  );
}
