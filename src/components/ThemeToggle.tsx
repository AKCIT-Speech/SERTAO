import { Moon, Sprout, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: 'light' as const, label: 'Light', Icon: Sun },
    { value: 'dark' as const, label: 'Dark', Icon: Moon },
    { value: 'sertao' as const, label: 'SERTAO', Icon: Sprout },
  ] satisfies Array<{ value: Theme; label: string; Icon: typeof Sun }>;

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-card border border-line bg-ink-800 p-1"
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={`${label} theme`}
            title={label}
            className={`inline-flex items-center gap-1.5 rounded-card px-2 py-1.5 font-mono text-[10px]
              uppercase tracking-label transition-colors focus-visible:ring-2 sm:px-2.5
              ${isActive ? 'bg-ink-950 text-paper' : 'text-muted hover:text-paper'}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
