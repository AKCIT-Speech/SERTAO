import { useEffect, useState } from 'react';
import { copy, LANGUAGE_STORAGE_KEY, type Language } from '../lib/i18n';

function browserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const preferred = navigator.languages?.[0] ?? navigator.language;
  return preferred?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function initialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'pt' || stored === 'en') return stored;
  } catch {
    // Storage may be unavailable; browser language remains the default.
  }
  return browserLanguage();
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.title = copy[language].pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy[language].metaDescription);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language remains usable without persistence.
    }
  }, [language]);

  return { language, setLanguage };
}
