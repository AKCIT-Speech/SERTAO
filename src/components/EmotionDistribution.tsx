import { useMemo } from 'react';
import type { EmotionLabel } from '../types';
import { EMOTIONS, FULL_DATASET_COUNTS } from '../lib/emotions';
import { formatInteger } from '../lib/format';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import SectionHeader from './SectionHeader';

interface EmotionDistributionProps {
  onSelectEmotion: (label: EmotionLabel) => void;
}

export default function EmotionDistribution({ onSelectEmotion }: EmotionDistributionProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  const rows = useMemo(
    () =>
      EMOTIONS.map((emotion) => ({
        ...emotion,
        count: FULL_DATASET_COUNTS[emotion.label],
      })).sort((a, b) => b.count - a.count || a.en.localeCompare(b.en)),
    [],
  );

  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <section
      id="distribution"
      aria-labelledby="distribution-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8"
    >
      <SectionHeader
        id="distribution-title"
        index="02"
        kicker="Class distribution"
        title="Emotion distribution"
        description="Absolute sample counts per emotion class across the full corpus."
      />

      <div ref={ref} className="rounded-card border border-line bg-ink-800/40 p-4 sm:p-6">
        <ul className="space-y-4">
          {rows.map((row, index) => {
            const widthPercent = (row.count / max) * 100;
            return (
              <li key={row.label}>
                <button
                  type="button"
                  onClick={() => onSelectEmotion(row.label)}
                  className="group block w-full text-left focus-visible:ring-2"
                  style={{ ['--focus-ring' as string]: row.color }}
                  aria-label={`Filter gallery by ${row.en} / ${row.pt} — ${row.count} samples`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-sm font-medium text-paper">
                      {row.en}
                      <span className="font-mono text-[11px] font-normal text-muted">
                        {' '}
                        / {row.pt}
                      </span>
                    </p>
                    <p className="shrink-0 font-mono text-[13px] tabular-nums text-paper">
                      {formatInteger(row.count)}
                    </p>
                  </div>

                  <div className="mt-1.5 h-2.5 w-full rounded-[1px] bg-ink-950">
                    <div
                      className="h-full origin-left rounded-[1px] transition-opacity group-hover:opacity-80"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: row.color,
                        transform: inView || reducedMotion ? 'scaleX(1)' : 'scaleX(0)',
                        transition: reducedMotion
                          ? 'none'
                          : `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 70}ms`,
                      }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
