import { Search, X } from 'lucide-react';
import type {
  EmotionFilter,
  Filters,
  SortKey,
  SourceFilter,
  SplitFilter,
} from '../types';
import { EMOTIONS, emotionInk } from '../lib/emotions';

interface FilterBarProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  shownCount: number;
  totalCount: number;
  /** Counts per emotion in the curated set, used for the chip badges. */
  counts: Record<string, number>;
}

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'SERTÃO', label: 'SERTÃO' },
  { value: 'CORAA human-review', label: 'CORAA human-review' },
];

const SPLIT_OPTIONS: { value: SplitFilter; label: string }[] = [
  { value: 'all', label: 'All splits' },
  { value: 'train', label: 'train' },
  { value: 'valid', label: 'valid' },
  { value: 'test', label: 'test' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'emotion', label: 'Sort: emotion' },
  { value: 'duration', label: 'Sort: duration' },
  { value: 'filename', label: 'Sort: filename' },
];

const selectClass =
  'w-full appearance-none rounded-card border border-line bg-ink-900 px-3 py-2 pr-8 font-mono ' +
  'text-[11px] text-paper transition-colors hover:border-paper/40 focus-visible:ring-2 sm:w-auto';

export default function FilterBar({
  filters,
  onChange,
  onReset,
  shownCount,
  totalCount,
  counts,
}: FilterBarProps) {
  const chips: { value: EmotionFilter; label: string; sub?: string; color?: string }[] = [
    { value: 'all', label: 'All emotions' },
    ...EMOTIONS.map((e) => ({
      value: e.label as EmotionFilter,
      label: e.en,
      sub: String(counts[e.label] ?? 0),
      color: e.color,
    })),
  ];

  const isFiltered =
    filters.emotion !== 'all' ||
    filters.source !== 'all' ||
    filters.split !== 'all' ||
    filters.query.trim() !== '' ||
    filters.sort !== 'emotion';

  return (
    <div className="sticky top-0 z-40 -mx-5 border-y border-line bg-ink-900/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-3">
        {/* Emotion chips */}
        <div
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar"
          role="group"
          aria-label="Filter by emotion"
        >
          {chips.map((chip) => {
            const active = filters.emotion === chip.value;
            const color = chip.color ?? 'var(--solid-text)';
            const textColor = chip.value === 'all' ? 'var(--solid-text)' : emotionInk(chip.value);
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onChange({ emotion: chip.value })}
                aria-pressed={active}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-card border px-3 py-1.5
                  font-mono text-[11px] transition-colors focus-visible:ring-2"
                style={{
                  ['--focus-ring' as string]: color,
                  borderColor: active ? color : 'var(--solid-line)',
                  backgroundColor: active && chip.color ? `${chip.color}1F` : 'transparent',
                  color: active ? textColor : 'var(--solid-muted)',
                }}
              >
                {chip.color && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-[1px]"
                    style={{ backgroundColor: chip.color }}
                  />
                )}
                {chip.label}
                {chip.sub && <span className="tabular-nums text-faint">{chip.sub}</span>}
              </button>
            );
          })}
        </div>

        {/* Secondary controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="filename-search">
              Search by file name
            </label>
            <input
              id="filename-search"
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ query: event.target.value })}
              placeholder="Search file name…"
              className="w-full rounded-card border border-line bg-ink-900 py-2 pl-9 pr-3 font-mono text-[11px]
                text-paper placeholder:text-faint transition-colors hover:border-paper/40 focus-visible:ring-2"
            />
          </div>

          <label className="sr-only" htmlFor="source-filter">
            Filter by source
          </label>
          <select
            id="source-filter"
            className={selectClass}
            value={filters.source}
            onChange={(event) => onChange({ source: event.target.value as SourceFilter })}
          >
            {SOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="split-filter">
            Filter by split
          </label>
          <select
            id="split-filter"
            className={selectClass}
            value={filters.split}
            onChange={(event) => onChange({ split: event.target.value as SplitFilter })}
          >
            {SPLIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="sort-order">
            Sort order
          </label>
          <select
            id="sort-order"
            className={selectClass}
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortKey })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 sm:ml-auto">
            <p className="font-mono text-[11px] tabular-nums text-muted" aria-live="polite">
              Showing {shownCount} of {totalCount} curated samples
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 rounded-card border border-line px-2 py-1.5
                  font-mono text-[10px] uppercase tracking-label text-muted transition-colors
                  hover:border-paper/50 hover:text-paper focus-visible:ring-2"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
