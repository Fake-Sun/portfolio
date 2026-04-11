"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { defaultLocale, localeCookieName, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale, pathname?: string) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  initialLocale: Locale;
  children: React.ReactNode;
};

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(localeCookieName);
    if (stored === "en" || stored === "es") {
      setLocaleState(stored);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale(nextLocale, pathname) {
        setLocaleState(nextLocale);
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        window.localStorage.setItem(localeCookieName, nextLocale);

        if (pathname && window.location.pathname !== pathname) {
          window.history.replaceState(window.history.state, "", pathname);
        }
      }
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function usePublicLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("usePublicLocale must be used within LocaleProvider.");
  }

  return context;
}

export function useResolvedLocale() {
  const context = useContext(LocaleContext);
  return context?.locale ?? defaultLocale;
}
