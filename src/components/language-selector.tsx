"use client";

import {
  type Locale,
  localeCookieName
} from "@/lib/i18n";
import { usePublicLocale } from "@/components/locale-provider";

const flagByLocale: Record<Locale, { src: string; alt: string; next: Locale; title: string }> = {
  en: {
    src: "/flags/us.svg",
    alt: "English",
    next: "es",
    title: "Switch to Spanish"
  },
  es: {
    src: "/flags/ar.svg",
    alt: "Español",
    next: "en",
    title: "Cambiar a inglés"
  }
};

export function LanguageSelector() {
  const { locale, setLocale } = usePublicLocale();
  const current = flagByLocale[locale];

  function handleToggle() {
    document.cookie = `${localeCookieName}=${current.next}; path=/; max-age=31536000; samesite=lax`;
    setLocale(current.next);
  }

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={handleToggle}
      aria-label={current.title}
      title={current.title}
    >
      <img key={locale} src={current.src} alt={current.alt} className="language-toggle__flag" />
      <span className="language-toggle__label">{locale.toUpperCase()}</span>
    </button>
  );
}
