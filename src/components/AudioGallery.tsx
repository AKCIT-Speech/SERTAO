import { forwardRef } from 'react';
import { FileQuestion } from 'lucide-react';
import type { AudioSample, EmotionLabel, Filters } from '../types';
import { emotionMeta } from '../lib/emotions';
import AudioCard from './AudioCard';
import FilterBar from './FilterBar';
import SectionHeader from './SectionHeader';

interface AudioGalleryProps {
  samples: AudioSample[];
  totalCount: number;
  counts: Record<EmotionLabel, number>;
  filters: Filters;
  onFilterChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="h-[232px] animate-pulse rounded-card border border-line bg-ink-800/40" />
  );
}

const AudioGallery = forwardRef<HTMLElement, AudioGalleryProps>(function AudioGallery(
  { samples, totalCount, counts, filters, onFilterChange, onReset, loading = false },
  ref,
) {
  const active = filters.emotion !== 'all' ? emotionMeta(filters.emotion as EmotionLabel) : null;
  const title = active ? `Samples: ${active.en} / ${active.pt}` : 'Samples: all emotions';

  return (
    <section
      ref={ref}
      id="gallery"
      aria-labelledby="gallery-title"
      className="mx-auto max-w-6xl scroll-mt-4 px-5 py-14 sm:px-8"
    >
      <SectionHeader
        id="gallery-title"
        index="04"
        kicker="Audio sample gallery"
        title={title}
        description="Each card exposes its file name, source, split, duration and language. Playback is on demand — nothing is fetched until you press play, and only one sample plays at a time."
      />

      <FilterBar
        filters={filters}
        onChange={onFilterChange}
        onReset={onReset}
        shownCount={samples.length}
        totalCount={totalCount}
        counts={counts}
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
              Try clearing the file-name search, or widening the source and split filters.
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
