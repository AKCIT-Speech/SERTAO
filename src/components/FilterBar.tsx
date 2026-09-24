import { X } from 'lucide-react';
import type { EmotionFilter, Filters } from '../types';
import { EMOTIONS, emotionInk } from '../lib/emotions';

interface FilterBarProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  shownCount: number;
  totalCount: number;
  emotionCounts: Record<EmotionFilter, number>;
}

export default function FilterBar({
  filters,
  onChange,
  onReset,
  shownCount,
  totalCount,
  emotionCounts,
}: FilterBarProps) {
  const chips: { value: EmotionFilter; label: string; color?: string; count?: number }[] = [
    { value: 'all', label: 'All emotions' },
    ...EMOTIONS.map((e) => ({
      value: e.label as EmotionFilter,
      label: e.en,
      color: e.color,
      count: emotionCounts[e.label],
    })),
  ];

  const isFiltered = filters.emotion !== 'all';

  return (
    <div className="border-t border-line py-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="label-mono">Classe de emoção</p>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-card border border-line px-2 py-1.5
                font-mono text-[10px] uppercase tracking-label text-muted transition-colors
                hover:border-paper/50 hover:text-paper focus-visible:ring-2"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Limpar
            </button>
          )}
        </div>

        {/* Emotion chips */}
        <div
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar"
          role="group"
          aria-label="Selecionar classe de emoção"
        >
          {chips.map((chip) => {
            const active = filters.emotion === chip.value;
            const color = chip.color ?? 'var(--solid-text)';
            const textColor = chip.value === 'all' ? 'var(--solid-text)' : emotionInk(chip.value);
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onChange({ emotion: chip.value })}
                aria-pressed={active}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-card border px-3 py-1.5
                  font-mono text-[11px] transition-colors focus-visible:ring-2"
                style={{
                  ['--focus-ring' as string]: color,
                  borderColor: active ? color : 'var(--solid-line)',
                  backgroundColor: active && chip.color ? `${chip.color}1F` : 'transparent',
                  color: active ? textColor : 'var(--solid-muted)',
                }}
              >
                {chip.color && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-[1px]"
                    style={{ backgroundColor: chip.color }}
                  />
                )}
                {chip.label}
                {chip.count !== undefined && (
                  <span className="tabular-nums text-faint">{chip.count}</span>
                )}
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Exibindo {shownCount} de {totalCount} arquivos de áudio
        </p>
      </div>
    </div>
  );
}
