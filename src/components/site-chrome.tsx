"use client";

import { LanguageSelector } from "@/components/language-selector";
import { siteCopy } from "@/lib/i18n";
import { useResolvedLocale } from "@/components/locale-provider";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="/" className="brand-mark">
          Lucas Monzón
        </a>
        <nav className="site-nav">
          <a href="/">{copy.navWork as string}</a>
          <a href="/admin">{copy.navAdmin as string}</a>
          <LanguageSelector />
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <a href="mailto:contact@lucasmonzon.dev">contact@lucasmonzon.dev</a>
        <div className="site-footer__links">
          <a href="https://github.com/Fake-Sun" target="_blank" rel="noreferrer">
            {copy.footerGithub as string}
          </a>
          <a
            href="https://www.linkedin.com/in/lucasmonzon2911/"
            target="_blank"
            rel="noreferrer"
          >
            {copy.footerLinkedIn as string}
          </a>
        </div>
      </footer>
    </div>
  );
}
