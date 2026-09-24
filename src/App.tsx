import { useCallback, useMemo, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { EmotionLabel, Filters } from './types';
import { EMOTION_ORDER, EMOTIONS } from './lib/emotions';
import { useSamples } from './hooks/useSamples';
import { AudioManagerProvider } from './hooks/useAudioManager';
import { useReducedMotion } from './hooks/useReducedMotion';
import Hero from './components/Hero';
import DatasetOverview from './components/DatasetOverview';
import EmotionDistribution from './components/EmotionDistribution';
import EmotionAtlas from './components/EmotionAtlas';
import AudioGallery from './components/AudioGallery';
import EmotionComparison from './components/EmotionComparison';

const INITIAL_FILTERS: Filters = {
  emotion: 'all',
  source: 'all',
  split: 'all',
  query: '',
  sort: 'emotion',
};

const EMPTY_COUNTS = EMOTION_ORDER.reduce(
  (acc, label) => {
    acc[label] = 0;
    return acc;
  },
  {} as Record<EmotionLabel, number>,
);

export default function App() {
  const { status, manifest, error } = useSamples();
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const reducedMotion = useReducedMotion();

  const galleryRef = useRef<HTMLElement | null>(null);
  const overviewRef = useRef<HTMLElement | null>(null);

  const samples = manifest?.samples ?? [];

  /** Curated counts per class, derived from samples.json — never hardcoded. */
  const counts = useMemo(() => {
    const next = { ...EMPTY_COUNTS };
    for (const sample of samples) {
      if (sample.label in next) next[sample.label] += 1;
    }
    return next;
  }, [samples]);

  const visibleSamples = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    const filtered = samples.filter((sample) => {
      if (filters.emotion !== 'all' && sample.label !== filters.emotion) return false;
      if (filters.source !== 'all' && sample.source !== filters.source) return false;
      if (filters.split !== 'all' && sample.split !== filters.split) return false;
      if (query && !sample.filename.toLowerCase().includes(query)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (filters.sort === 'duration') {
      sorted.sort(
        (a, b) =>
          (a.duration_seconds ?? Number.POSITIVE_INFINITY) -
            (b.duration_seconds ?? Number.POSITIVE_INFINITY) ||
          a.filename.localeCompare(b.filename),
      );
    } else if (filters.sort === 'filename') {
      sorted.sort((a, b) => a.filename.localeCompare(b.filename));
    } else {
      sorted.sort(
        (a, b) =>
          EMOTION_ORDER.indexOf(a.label) - EMOTION_ORDER.indexOf(b.label) ||
          a.filename.localeCompare(b.filename),
      );
    }
    return sorted;
  }, [filters, samples]);

  const scrollTo = useCallback(
    (node: HTMLElement | null) => {
      node?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [reducedMotion],
  );

  const handleFilterChange = useCallback((next: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...next }));
  }, []);

  /** Shared by the rail, the atlas and the distribution chart. */
  const selectEmotion = useCallback(
    (label: EmotionLabel) => {
      setFilters((current) => ({
        ...current,
        // Clicking the active class again clears the filter.
        emotion: current.emotion === label ? 'all' : label,
      }));
      window.requestAnimationFrame(() => scrollTo(galleryRef.current));
    },
    [scrollTo],
  );

  const resetFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-md rounded-card border border-emotion-angry/40 bg-emotion-angry/10 p-6">
          <AlertTriangle className="h-6 w-6 text-emotion-angry" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-semibold text-paper">
            Could not load the sample manifest
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-faint">
            Generate it with <span className="text-paper">npm run prepare:data</span>, which writes
            public/data/samples.json from the folders in ./sertao.
          </p>
        </div>
      </div>
    );
  }

  const loading = status === 'loading';

  return (
    <AudioManagerProvider>
      <a href="#gallery" className="skip-link">
        Skip to audio samples
      </a>

      <Hero
        curatedTotal={manifest?.curated_total ?? 0}
        counts={counts}
        selected={filters.emotion}
        onSelectEmotion={selectEmotion}
        onExplore={() => scrollTo(galleryRef.current)}
        onViewOverview={() => scrollTo(overviewRef.current)}
      />

      <main>
        {loading || !manifest ? (
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8" role="status" aria-live="polite">
            <p className="label-mono">Loading</p>
            <p className="mt-3 font-display text-xl text-paper">Reading samples.json…</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EMOTIONS.slice(0, 6).map((emotion) => (
                <div
                  key={emotion.label}
                  className="h-28 animate-pulse rounded-card border border-line bg-ink-800/40"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <DatasetOverview ref={overviewRef} manifest={manifest} />
            <EmotionDistribution onSelectEmotion={selectEmotion} />
            <EmotionAtlas selected={filters.emotion} onSelectEmotion={selectEmotion} />
            <AudioGallery
              ref={galleryRef}
              samples={visibleSamples}
              totalCount={samples.length}
              counts={counts}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
            <EmotionComparison samples={samples} />
          </>
        )}
      </main>
    </AudioManagerProvider>
  );
}
