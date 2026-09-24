export type EmotionLabel =
  | 'angry'
  | 'disgust'
  | 'fear'
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'surprise';

export type SampleSource = 'SERTÃO' | 'CORAA human-review';

export type SampleSplit = 'train' | 'valid' | 'test';

/** One row of public/data/samples.json → samples[]. */
export interface AudioSample {
  id: string;
  filename: string;
  label: EmotionLabel;
  label_pt: string;
  source: SampleSource;
  split: SampleSplit;
  language: string;
  /** Always a relative, web-style path such as /audio/sertao/fear/example.wav */
  audio_url: string;
  duration_seconds: number | null;
  /** The dataset ships no speaker identifiers, so this is always null. */
  speaker: string | null;
}

export interface PerEmotionCount {
  label: EmotionLabel;
  label_pt: string;
  curated: number;
}

export interface SamplesManifest {
  dataset: string;
  version: string;
  generated_at: string;
  language: string;
  sources: string[];
  curated_total: number;
  emotion_classes: number;
  curated_duration_seconds: number;
  notes: Record<string, string>;
  per_emotion: PerEmotionCount[];
  samples: AudioSample[];
}

export type EmotionFilter = EmotionLabel | 'all';
export type SourceFilter = SampleSource | 'all';
export type SplitFilter = SampleSplit | 'all';
export type SortKey = 'emotion' | 'duration' | 'filename';

export interface Filters {
  emotion: EmotionFilter;
  source: SourceFilter;
  split: SplitFilter;
  query: string;
  sort: SortKey;
}
