import { HomePageClient } from "@/components/home-page-client";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteChrome } from "@/components/site-chrome";
import {
  defaultLocale,
  localizeProject,
  localizeSettings,
  type Locale
} from "@/lib/i18n";
import { getPortfolioSettings, getProjects } from "@/lib/portfolio";
import type { PortfolioSettings, Project } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const [rawSettings, rawProjects] = await Promise.all([getPortfolioSettings(), getProjects()]);
  const settingsByLocale = {
    en: localizeSettings(rawSettings, "en"),
    es: localizeSettings(rawSettings, "es")
  } satisfies Record<Locale, PortfolioSettings>;
  const projectsByLocale = {
    en: rawProjects.map((project) => localizeProject(project, "en")),
    es: rawProjects.map((project) => localizeProject(project, "es"))
  } satisfies Record<Locale, Project[]>;

  return (
    <LocaleProvider initialLocale={defaultLocale}>
      <SiteChrome>
        <HomePageClient settingsByLocale={settingsByLocale} projectsByLocale={projectsByLocale} />
      </SiteChrome>
    </LocaleProvider>
  );
}
