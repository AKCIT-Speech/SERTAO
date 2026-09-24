import { forwardRef } from 'react';
import { FileQuestion } from 'lucide-react';
import type { AudioSample, EmotionFilter, Filters } from '../types';
import AudioCard from './AudioCard';
import FilterBar from './FilterBar';

interface AudioGalleryProps {
  samples: AudioSample[];
  totalCount: number;
  filters: Filters;
  onFilterChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  emotionCounts: Record<EmotionFilter, number>;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="h-[232px] animate-pulse rounded-card border border-line bg-ink-800/40" />
  );
}

const AudioGallery = forwardRef<HTMLElement, AudioGalleryProps>(function AudioGallery(
  { samples, totalCount, filters, onFilterChange, onReset, emotionCounts, loading = false },
  ref,
) {
  return (
    <section
      ref={ref}
      id="gallery"
      aria-labelledby="gallery-title"
      className="mx-auto max-w-6xl scroll-mt-4 px-5 py-10 sm:px-8 sm:py-12"
    >
      <div className="mb-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono">SERTAO / samples</p>
          <h2
            id="gallery-title"
            className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl"
          >
            Audio samples
          </h2>
        </div>
        <div className="flex items-baseline gap-2 sm:text-right">
          <p className="font-display text-2xl font-semibold leading-none tabular-nums text-paper">
            {samples.length}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-label text-faint">
            visible / {totalCount} total
          </p>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={onFilterChange}
        onReset={onReset}
        shownCount={samples.length}
        totalCount={totalCount}
        emotionCounts={emotionCounts}
      />

      <div className="mt-6">
        {loading ? (
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading audio samples"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : samples.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-card border border-dashed border-line bg-ink-800/30 p-8">
            <FileQuestion className="h-6 w-6 text-faint" aria-hidden="true" />
            <h3 className="font-display text-lg font-medium text-paper">
              No samples match these filters
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Try selecting All emotions to see the complete sample set again.
            </p>
            <button
              type="button"
              onClick={onReset}
              className="rounded-card border border-line px-3 py-2 font-mono text-[11px] uppercase
                tracking-label text-paper transition-colors hover:border-paper/60 focus-visible:ring-2"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((sample, index) => (
              <li key={sample.id}>
                <AudioCard sample={sample} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
});

export default AudioGallery;
