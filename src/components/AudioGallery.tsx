import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AudioSample, EmotionLabel } from '../types';
import { EMOTIONS } from '../lib/emotions';
import { copy, formatCount, type Language } from '../lib/i18n';
import AudioCard from './AudioCard';

interface AudioGalleryProps {
  samples: AudioSample[];
  language: Language;
}

export default function AudioGallery({ samples, language }: AudioGalleryProps) {
  const t = copy[language];
  const [openEmotion, setOpenEmotion] = useState<EmotionLabel | null>(null);

  const byEmotion = useMemo(() => {
    const groups = new Map<EmotionLabel, AudioSample[]>();
    for (const emotion of EMOTIONS) groups.set(emotion.label, []);
    for (const sample of samples) groups.get(sample.label)?.push(sample);
    return groups;
  }, [samples]);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="mx-auto max-w-6xl scroll-mt-4 px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 border-t-2 border-paper pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono">{t.galleryKicker}</p>
          <h2 id="gallery-title" className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            {t.galleryTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.galleryDescription}</p>
        </div>
        <p className="font-mono text-[11px] tabular-nums text-muted">
          <strong className="mr-2 font-display text-2xl font-semibold text-paper">{formatCount(samples.length, language)}</strong>
          {t.publishedFiles}
        </p>
      </div>

      <div className="border-t border-line">
        {EMOTIONS.map((emotion) => {
          const entries = byEmotion.get(emotion.label) ?? [];
          const open = openEmotion === emotion.label;
          const primary = language === 'pt' ? emotion.pt : emotion.en;
          const secondary = language === 'pt' ? emotion.en : emotion.pt;
          const panelId = `samples-${emotion.label}`;
          const headingId = `heading-${emotion.label}`;

          return (
            <section key={emotion.label} className="border-b border-line" aria-labelledby={headingId}>
              <h3 id={headingId}>
                <button
                  type="button"
                  onClick={() => setOpenEmotion(open ? null : emotion.label)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={`${open ? t.collapse : t.expand} ${primary}: ${entries.length} ${t.recordings}`}
                  className="group flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-ink-800/40 focus-visible:ring-2 sm:gap-6"
                  style={{ ['--focus-ring' as string]: emotion.color }}
                >
                  <span className="h-3 w-3 shrink-0 rounded-[2px]" style={{ backgroundColor: emotion.color }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">{primary}</span>
                    <span className="mt-0.5 block text-xs text-muted">{secondary}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted">{entries.length} {t.recordings}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </h3>

              {open && (
                <div id={panelId} role="region" aria-labelledby={headingId} className="pb-4 pl-7 sm:pl-9">
                  <ul className="border-t border-line">
                    {entries.map((sample) => (
                      <li key={sample.id}><AudioCard sample={sample} language={language} /></li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

    </section>
  );
}
