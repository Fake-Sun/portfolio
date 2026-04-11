import { notFound } from "next/navigation";

import { LocaleProvider } from "@/components/locale-provider";
import { SiteChrome } from "@/components/site-chrome";
import { isLocale, type Locale } from "@/lib/i18n";

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

  return (
    <LocaleProvider initialLocale={locale}>
      <SiteChrome>{children}</SiteChrome>
    </LocaleProvider>
  );
}
