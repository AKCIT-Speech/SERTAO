import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { AudioSample, EmotionLabel } from '../types';
import { EMOTIONS } from '../lib/emotions';
import { useReducedMotion } from '../hooks/useReducedMotion';
import AudioPlayer from './AudioPlayer';

interface EmotionComparisonProps {
  samples: AudioSample[];
}

interface EmotionSlide {
  emotion: (typeof EMOTIONS)[number];
  sample: AudioSample | null;
}

const AUTOPLAY_MS = 5200;

export default function EmotionComparison({ samples }: EmotionComparisonProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const paused = manualPaused || interactionPaused;

  const slides = useMemo<EmotionSlide[]>(() => {
    const byEmotion = new Map<EmotionLabel, AudioSample[]>();
    for (const emotion of EMOTIONS) byEmotion.set(emotion.label, []);
    for (const sample of samples) byEmotion.get(sample.label)?.push(sample);

    return EMOTIONS.map((emotion) => {
      const list = byEmotion.get(emotion.label) ?? [];
      list.sort((a, b) => a.filename.localeCompare(b.filename));
      return { emotion, sample: list[0] ?? null };
    });
  }, [samples]);

  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (reducedMotion || paused || slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  if (!activeSlide) return null;

  const { emotion, sample } = activeSlide;
  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <section
      id="compare"
      aria-labelledby="compare-title"
      className="border-y border-line bg-ink-800/30"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInteractionPaused(false);
        }
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex items-center justify-between">
          <h2 id="compare-title" className="label-mono text-paper">
            SERTÃO
          </h2>
          <button
            type="button"
            onClick={() => setManualPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? 'Resume carousel' : 'Pause carousel'}
            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-ink-900 text-muted
              transition-colors hover:border-paper/50 hover:text-paper focus-visible:ring-2"
            style={{ ['--focus-ring' as string]: emotion.color }}
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: emotion.color }}
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-2xl font-semibold leading-none tracking-tight text-paper sm:text-3xl">
                {emotion.en}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-muted">
                {emotion.pt}
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-label text-faint">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div
          key={sample?.id ?? emotion.label}
          className="mt-5 rounded-2xl bg-ink-800/75 px-4 py-5 shadow-sm animate-fade-up sm:px-8 sm:py-7"
          style={{ ['--focus-ring' as string]: emotion.color }}
          aria-live="polite"
        >
          {sample ? (
            <AudioPlayer
              id={`carousel-${sample.id}`}
              src={sample.audio_url}
              color={emotion.color}
              title={`${emotion.en} sample`}
              metadataDuration={sample.duration_seconds}
              waveformBars={64}
            />
          ) : (
            <p className="font-mono text-xs text-muted">—</p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous emotion"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-ink-900 text-muted
              transition-colors hover:border-paper/50 hover:text-paper focus-visible:ring-2"
            style={{ ['--focus-ring' as string]: emotion.color }}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-1.5" role="tablist" aria-label="Emotions">
            {slides.map((slide, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={slide.emotion.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={slide.emotion.en}
                  onClick={() => goTo(index)}
                  className="flex min-w-0 flex-1 focus-visible:ring-2"
                  style={{ ['--focus-ring' as string]: slide.emotion.color }}
                >
                  <span
                    className="h-1.5 w-full rounded-full transition-opacity"
                    style={{
                      backgroundColor: slide.emotion.color,
                      opacity: active ? 1 : 0.25,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next emotion"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-ink-900 text-muted
              transition-colors hover:border-paper/50 hover:text-paper focus-visible:ring-2"
            style={{ ['--focus-ring' as string]: emotion.color }}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
