import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'sertao';

export const THEME_STORAGE_KEY = 'sertao-theme';

/** Light is the default; the choice is remembered across visits. */
function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'sertao') return stored;
  } catch {
    // Private mode or blocked storage: fall through to the default.
  }
  return 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  for (const name of ['light', 'dark', 'sertao'] as const) {
    root.classList.toggle(`theme-${name}`, theme === name);
  }
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort only.
    }
  }, [theme]);

  const toggle = useCallback(
    () =>
      setTheme((current) =>
        current === 'light' ? 'dark' : current === 'dark' ? 'sertao' : 'light',
      ),
    [],
  );

  return { theme, setTheme, toggle };
}
