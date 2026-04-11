"use client";

import {
  defaultLocale,
  getCanonicalProjectSlug,
  getLocalizedProjectSlug,
  isLocale,
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

function getNextPathname(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];

  if (!currentLocale || !isLocale(currentLocale)) {
    return `/${nextLocale}`;
  }

  if (segments[1] === "projects" && segments[2]) {
    const canonicalSlug = getCanonicalProjectSlug(segments[2]);
    return `/${nextLocale}/projects/${getLocalizedProjectSlug(canonicalSlug, nextLocale)}`;
  }

  const rest = segments.slice(1).join("/");
  return `/${nextLocale}${rest ? `/${rest}` : ""}`;
}

export function LanguageSelector() {
  const { locale, setLocale } = usePublicLocale();
  const current = flagByLocale[locale];

  function handleToggle() {
    const pathname =
      typeof window !== "undefined"
        ? getNextPathname(window.location.pathname || `/${defaultLocale}`, current.next)
        : `/${current.next}`;

    document.cookie = `${localeCookieName}=${current.next}; path=/; max-age=31536000; samesite=lax`;
    setLocale(current.next, pathname);
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
