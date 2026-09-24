import { useState } from 'react';
import type { EmotionLabel } from '../types';
import { EMOTIONS, emotionInk } from '../lib/emotions';
import Waveform from './Waveform';

interface EmotionSignalRailProps {
  /** Curated count per emotion, computed from samples.json. */
  counts: Record<EmotionLabel, number>;
  selected: EmotionLabel | 'all';
  onSelect: (label: EmotionLabel) => void;
  /** Hover feedback bubbled up so the hero can echo the focused class. */
  onHover?: (label: EmotionLabel | null) => void;
}

const SHORT: Record<EmotionLabel, string> = {
  angry: 'ANG',
  disgust: 'DIS',
  fear: 'FEA',
  happy: 'HAP',
  neutral: 'NEU',
  sad: 'SAD',
  surprise: 'SUR',
};

/**
 * The signature element of the page: seven colour segments, one per emotion
 * class. Hovering previews a class, activating it filters the gallery.
 */
export default function EmotionSignalRail({
  counts,
  selected,
  onSelect,
  onHover,
}: EmotionSignalRailProps) {
  const [hovered, setHovered] = useState<EmotionLabel | null>(null);

  const setHover = (label: EmotionLabel | null) => {
    setHovered(label);
    onHover?.(label);
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="label-mono">Emotion</p>
        <p className="label-mono">{EMOTIONS.length} classes</p>
      </div>

      <div
        className="grid grid-cols-7 gap-[3px] rounded-card border border-line bg-ink-950/70 p-[3px]"
        role="group"
        aria-label="Filter audio samples by emotion class"
      >
        {EMOTIONS.map((emotion) => {
          const isSelected = selected === emotion.label;
          const isHovered = hovered === emotion.label;
          const dim = hovered !== null && !isHovered;

          return (
            <button
              key={emotion.label}
              type="button"
              onClick={() => onSelect(emotion.label)}
              onMouseEnter={() => setHover(emotion.label)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(emotion.label)}
              onBlur={() => setHover(null)}
              aria-pressed={isSelected}
              aria-label={`${emotion.en} / ${emotion.pt} — ${counts[emotion.label] ?? 0} samples`}
              className="group relative flex flex-col items-stretch gap-2 rounded-[2px] px-1 pb-2 pt-2.5
                text-left transition-[background-color,opacity] duration-200 focus-visible:ring-2
                sm:px-2 sm:pb-2.5"
              style={{
                ['--focus-ring' as string]: emotion.color,
                backgroundColor: isSelected
                  ? `${emotion.color}26`
                  : isHovered
                    ? `${emotion.color}18`
                    : 'transparent',
                opacity: dim ? 0.55 : 1,
              }}
            >
              {/* Colour bar: the segment itself */}
              <span
                aria-hidden="true"
                className="block w-full rounded-[1px] transition-[height] duration-200"
                style={{
                  backgroundColor: emotion.color,
                  height: isSelected || isHovered ? 14 : 9,
                }}
              />

              <Waveform
                seed={`rail-${emotion.label}`}
                color={emotion.color}
                progress={isSelected || isHovered ? 1 : 0}
                bars={9}
                height={26}
                className="hidden sm:flex"
              />

              <span className="block">
                <span
                  className="block font-mono text-[10px] uppercase tracking-label sm:hidden"
                  style={{
                    color:
                      isSelected || isHovered
                        ? emotionInk(emotion.label)
                        : 'var(--solid-muted)',
                  }}
                >
                  {SHORT[emotion.label]}
                </span>
                <span
                  className="hidden font-display text-[12px] font-medium leading-tight sm:block"
                  style={{
                    color:
                      isSelected || isHovered ? emotionInk(emotion.label) : 'var(--solid-text)',
                  }}
                >
                  {emotion.en}
                </span>
                <span className="hidden font-mono text-[10px] leading-tight text-muted sm:block">
                  {emotion.pt}
                </span>
                <span className="mt-1 block font-mono text-[10px] tabular-nums text-faint">
                  n={counts[emotion.label] ?? 0}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
