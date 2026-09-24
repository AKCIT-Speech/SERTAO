import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MinusCircle } from 'lucide-react';
import type { AudioSample, EmotionLabel } from '../types';
import { EMOTIONS } from '../lib/emotions';
import { formatDuration } from '../lib/format';
import AudioPlayer from './AudioPlayer';
import SectionHeader from './SectionHeader';

interface EmotionComparisonProps {
  /** Full curated set, grouped internally by class. */
  samples: AudioSample[];
}

export default function EmotionComparison({ samples }: EmotionComparisonProps) {
  const byEmotion = useMemo(() => {
    const map = new Map<EmotionLabel, AudioSample[]>();
    for (const emotion of EMOTIONS) map.set(emotion.label, []);
    for (const sample of samples) map.get(sample.label)?.push(sample);
    for (const list of map.values()) list.sort((a, b) => a.filename.localeCompare(b.filename));
    return map;
  }, [samples]);

  const maxIndex = useMemo(
    () => Math.max(1, ...[...byEmotion.values()].map((list) => list.length)),
    [byEmotion],
  );

  const [index, setIndex] = useState(0);
  const position = Math.min(index, maxIndex - 1);

  return (
    <section
      id="compare"
      aria-labelledby="compare-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8"
    >
      <SectionHeader
        id="compare-title"
        index="05"
        kicker="Cross-class comparison"
        title="Listen across emotions"
        description="Pick a sample position and compare the same index across all seven classes side by side. Useful for quick qualitative contrast; the files are unrelated recordings, not parallel readings of the same sentence."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={position === 0}
            aria-label="Previous sample position"
            className="grid h-8 w-8 place-items-center rounded-card border border-line bg-ink-900 text-muted
              transition-colors hover:border-paper/50 hover:text-paper disabled:opacity-40
              focus-visible:ring-2"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(maxIndex - 1, value + 1))}
            disabled={position >= maxIndex - 1}
            aria-label="Next sample position"
            className="grid h-8 w-8 place-items-center rounded-card border border-line bg-ink-900 text-muted
              transition-colors hover:border-paper/50 hover:text-paper disabled:opacity-40
              focus-visible:ring-2"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="comparison-index">
            Sample position
          </label>
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 no-scrollbar" id="comparison-index">
            {Array.from({ length: maxIndex }).map((_, slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setIndex(slot)}
                aria-pressed={position === slot}
                aria-label={`Sample position ${slot + 1} of ${maxIndex}`}
                className={`h-8 w-8 shrink-0 rounded-card border font-mono text-[11px] tabular-nums
                  transition-colors focus-visible:ring-2 ${
                    position === slot
                      ? 'border-paper bg-paper text-ink-900'
                      : 'border-line bg-ink-900 text-muted hover:border-paper/50 hover:text-paper'
                  }`}
              >
                {slot + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="font-mono text-[11px] tabular-nums text-muted">
          Position {position + 1} / {maxIndex}
        </p>
      </div>

      {/* Horizontal comparison rail; scrolls on narrow viewports. */}
      <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <ul className="flex min-w-full gap-3">
          {EMOTIONS.map((emotion) => {
            const list = byEmotion.get(emotion.label) ?? [];
            const sample = list[position];

            return (
              <li
                key={emotion.label}
                className="flex w-[248px] shrink-0 flex-col rounded-card border border-line bg-ink-800/40 sm:w-auto sm:flex-1"
              >
                <div
                  className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5"
                  style={{ backgroundColor: `${emotion.color}12` }}
                >
                  <div className="min-w-0">
                    <p className="font-display text-[13px] font-semibold leading-none text-paper">
                      {emotion.en}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted">{emotion.pt}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-[1px]"
                    style={{ backgroundColor: emotion.color }}
                  />
                </div>

                {sample ? (
                  <div className="flex flex-1 flex-col gap-2.5 p-3">
                    <AudioPlayer
                      id={`compare-${sample.id}`}
                      src={sample.audio_url}
                      color={emotion.color}
                      title={`${emotion.en} sample ${sample.filename}`}
                      metadataDuration={sample.duration_seconds}
                      waveformBars={24}
                      compact
                    />
                    <p className="break-all font-mono text-[10px] leading-snug text-muted">
                      {sample.filename}
                    </p>
                    <dl className="mt-auto space-y-1 border-t border-line/60 pt-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="label-mono">Source</dt>
                        <dd className="font-mono text-[10px] text-paper">{sample.source}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="label-mono">Duration</dt>
                        <dd className="font-mono text-[10px] tabular-nums text-paper">
                          {formatDuration(sample.duration_seconds)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-start gap-2 p-3">
                    <MinusCircle className="h-4 w-4 text-faint" aria-hidden="true" />
                    <p className="font-mono text-[10px] leading-snug text-muted">
                      No sample at position {position + 1}.
                      <span className="mt-1 block text-faint">
                        This class contributes {list.length} curated example
                        {list.length === 1 ? '' : 's'}.
                      </span>
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
