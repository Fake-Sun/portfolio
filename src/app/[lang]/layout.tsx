import { notFound } from "next/navigation";

import { LanguageSelector } from "@/components/language-selector";
import { isLocale, siteCopy, type Locale } from "@/lib/i18n";

type LangLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const copy = siteCopy[locale];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href={`/${locale}`} className="brand-mark">
          Lucas Monzón
        </a>
        <nav className="site-nav">
          <a href={`/${locale}`}>{copy.navWork as string}</a>
          <a href={`/${locale}/admin`}>{copy.navAdmin as string}</a>
          <LanguageSelector locale={locale} />
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
