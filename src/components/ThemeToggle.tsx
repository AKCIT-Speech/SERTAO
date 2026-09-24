import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextTheme} theme`}
      className="inline-flex items-center gap-2 rounded-card border border-line bg-ink-800 px-2.5 py-1.5
        font-mono text-[10px] uppercase tracking-label text-muted transition-colors
        hover:border-paper/50 hover:text-paper focus-visible:ring-2"
    >
      {theme === 'light' ? (
        <Moon className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Sun className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {nextTheme}
    </button>
  );
}
