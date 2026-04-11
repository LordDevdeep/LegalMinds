"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, getTranslation } from "./index";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lm-locale") as Locale | null;
    if (saved && ["en", "hi", "kn", "ta", "ml", "te"].includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("lm-locale", l);
  }, []);

  const t = useCallback(
    (key: string) => getTranslation(locale, key),
    [locale]
  );

  // Avoid hydration mismatch — render nothing extra until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: "en", setLocale, t: (key) => getTranslation("en", key) }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
