interface SectionHeaderProps {
  /** Small monospace index such as "02". */
  index: string;
  title: string;
  kicker?: string;
  description?: string;
  id?: string;
}

export default function SectionHeader({
  index,
  title,
  kicker,
  description,
  id,
}: SectionHeaderProps) {
  return (
    <header className="mb-8 border-t border-line pt-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-label text-faint">{index}</span>
        {kicker && <span className="label-mono">{kicker}</span>}
      </div>
      <h2
        id={id}
        className="mt-3 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      )}
    </header>
  );
}
