"use client";

import { usePathname } from "next/navigation";

import { defaultLocale, getLocalizedPath, type Locale, localeCookieName } from "@/lib/i18n";

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

type LanguageSelectorProps = {
  locale: Locale;
};

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const pathname = usePathname();
  const current = flagByLocale[locale];

  function handleToggle() {
    document.cookie = `${localeCookieName}=${current.next}; path=/; max-age=31536000; samesite=lax`;
    window.location.href = getLocalizedPath(pathname || `/${defaultLocale}`, current.next);
  }

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={handleToggle}
      aria-label={current.title}
      title={current.title}
    >
      <img src={current.src} alt={current.alt} className="language-toggle__flag" />
    </button>
  );
}
