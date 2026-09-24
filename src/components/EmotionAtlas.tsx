import type { EmotionLabel } from '../types';
import { EMOTIONS } from '../lib/emotions';
import SectionHeader from './SectionHeader';
import Waveform from './Waveform';

interface EmotionAtlasProps {
  selected: EmotionLabel | 'all';
  onSelectEmotion: (label: EmotionLabel) => void;
}

export default function EmotionAtlas({ selected, onSelectEmotion }: EmotionAtlasProps) {
  return (
    <section
      id="atlas"
      aria-labelledby="atlas-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8"
    >
      <SectionHeader
        id="atlas-title"
        index="03"
        kicker="Emotion atlas"
        title="Emotion Atlas"
        description="One entry per class. Selecting an entry filters the gallery below."
      />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EMOTIONS.map((emotion) => {
          const isSelected = selected === emotion.label;

          return (
            <li key={emotion.label}>
              <button
                type="button"
                onClick={() => onSelectEmotion(emotion.label)}
                aria-pressed={isSelected}
                className="group flex h-full w-full flex-col gap-3 rounded-card border bg-ink-800/40 p-4
                  text-left transition-colors hover:bg-ink-800/70 focus-visible:ring-2"
                style={{
                  ['--focus-ring' as string]: emotion.color,
                  borderColor: isSelected ? emotion.color : 'var(--solid-line)',
                  backgroundColor: isSelected ? `${emotion.color}14` : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-none tracking-tight text-paper">
                      {emotion.en}
                    </h3>
                    <p className="mt-1.5 font-mono text-[11px] text-muted">{emotion.pt}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-3 w-3 shrink-0 rounded-[1px]"
                    style={{ backgroundColor: emotion.color }}
                  />
                </div>

                <Waveform
                  seed={`atlas-${emotion.label}`}
                  color={emotion.color}
                  progress={isSelected ? 1 : 0.35}
                  bars={32}
                  height={30}
                />

                <p className="border-t border-line/60 pt-3 text-[12px] leading-relaxed text-muted">
                  {emotion.note}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
