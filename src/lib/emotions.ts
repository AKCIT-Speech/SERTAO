import type { EmotionLabel } from '../types';

export interface EmotionMeta {
  label: EmotionLabel;
  en: string;
  pt: string;
  color: string;
  /** Short qualitative note; describes the class, never a speaker. */
  note: string;
}

/** Canonical order, mirrored in scripts/build-samples.mjs. */
export const EMOTIONS: EmotionMeta[] = [
  {
    label: 'angry',
    en: 'Angry',
    pt: 'Raiva',
    color: '#E45756',
    note: 'High-arousal negative valence; raised intensity and abrupt onsets.',
  },
  {
    label: 'disgust',
    en: 'Disgust',
    pt: 'Nojo',
    color: '#8C7650',
    note: 'Negative valence with constricted, often creaky phonation.',
  },
  {
    label: 'fear',
    en: 'Fear',
    pt: 'Medo',
    color: '#8067D8',
    note: 'Unstable pitch contours, breathiness and hesitation.',
  },
  {
    label: 'happy',
    en: 'Happy',
    pt: 'Alegria',
    color: '#F2B84B',
    note: 'Positive valence; wider pitch range and faster tempo.',
  },
  {
    label: 'neutral',
    en: 'Neutral',
    pt: 'Neutro',
    color: '#91A3A8',
    note: 'Baseline class; flat prosody, dominant in the full dataset.',
  },
  {
    label: 'sad',
    en: 'Sad',
    pt: 'Tristeza',
    color: '#4D7CFE',
    note: 'Low arousal; reduced loudness, slower rate, falling contours.',
  },
  {
    label: 'surprise',
    en: 'Surprise',
    pt: 'Surpresa',
    color: '#2FAE9B',
    note: 'Sharp pitch excursions and short, marked utterances.',
  },
];

export const EMOTION_BY_LABEL: Record<EmotionLabel, EmotionMeta> = EMOTIONS.reduce(
  (acc, e) => {
    acc[e.label] = e;
    return acc;
  },
  {} as Record<EmotionLabel, EmotionMeta>,
);

export const EMOTION_ORDER: EmotionLabel[] = EMOTIONS.map((e) => e.label);

export function emotionColor(label: EmotionLabel): string {
  return EMOTION_BY_LABEL[label]?.color ?? 'var(--solid-muted)';
}

/**
 * Theme-aware variant of an emotion hue, for use as *text*. Resolves to the
 * brand colour in dark mode and to a darkened one in light mode, so the label
 * keeps enough contrast against the surface. See src/index.css.
 */
export function emotionInk(label: EmotionLabel): string {
  return `var(--e-${label}-ink)`;
}

export function emotionMeta(label: EmotionLabel): EmotionMeta {
  return EMOTION_BY_LABEL[label];
}

/**
 * Class counts of the *full* dataset as declared in the dataset description.
 * These are metadata, not derived from the curated files in this repository —
 * every count rendered for the curated demo is computed from samples.json.
 */
export const FULL_DATASET_COUNTS: Record<EmotionLabel, number> = {
  neutral: 599,
  happy: 189,
  sad: 74,
  angry: 71,
  disgust: 59,
  surprise: 53,
  fear: 42,
};

export const FULL_DATASET_TOTAL = Object.values(FULL_DATASET_COUNTS).reduce(
  (a, b) => a + b,
  0,
);
