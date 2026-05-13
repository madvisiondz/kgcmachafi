import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, type Language } from './translations';

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'kgc_lang';

function getDir(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

function lookup(key: string, lang: Language): string | undefined {
  const parts = key.split('.');
  let node: unknown = translations[lang];
  for (const p of parts) {
    if (!node || typeof node !== 'object') return undefined;
    const rec = node as Record<string, unknown>;
    if (!(p in rec)) return undefined;
    node = rec[p];
  }
  return typeof node === 'string' ? node : undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'ar' || stored === 'fr' || stored === 'en') return stored;
    return 'ar';
  });

  const dir = getDir(language);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      return (
        lookup(key, language) ??
        lookup(key, 'en') ??
        key
      );
    },
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [dir, language]);

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, dir, t }),
    [dir, language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** @see https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports */
// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider for this codebase
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

