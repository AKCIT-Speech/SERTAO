import { forwardRef } from 'react';
import type { SamplesManifest } from '../types';
import { FULL_DATASET_TOTAL } from '../lib/emotions';
import { formatAggregateDuration, formatInteger } from '../lib/format';
import SectionHeader from './SectionHeader';

interface DatasetOverviewProps {
  manifest: SamplesManifest;
}

function Metric({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-ink-800/50 p-4">
      <p className="label-mono">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold leading-none tracking-tight text-paper">
        {value}
      </p>
      {hint && <p className="mt-2 font-mono text-[10px] leading-snug text-faint">{hint}</p>}
    </div>
  );
}

const DatasetOverview = forwardRef<HTMLElement, DatasetOverviewProps>(function DatasetOverview(
  { manifest },
  ref,
) {
  return (
    <section
      ref={ref}
      id="overview"
      aria-labelledby="overview-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8"
    >
      <SectionHeader
        id="overview-title"
        index="01"
        kicker="Dataset overview"
        title="What is in this dataset"
        description="This dataset contains speech samples labeled across seven emotional categories. The demo provides a curated set of examples per emotion for qualitative inspection."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric
          value={formatInteger(FULL_DATASET_TOTAL)}
          label="Total samples"
          hint="Full dataset, as declared in the dataset description"
        />
        <Metric value={String(manifest.emotion_classes)} label="Emotion classes" />
        <Metric
          value={formatInteger(manifest.curated_total)}
          label="Curated samples"
          hint="Counted from samples.json"
        />
        <Metric value="pt-BR" label="Language" hint="Brazilian Portuguese" />
        <Metric
          value={formatAggregateDuration(manifest.curated_duration_seconds)}
          label="Curated audio"
          hint="Sum of all curated durations"
        />
      </div>

    </section>
  );
});

export default DatasetOverview;
