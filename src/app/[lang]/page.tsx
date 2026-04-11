import { HomePageClient } from "@/components/home-page-client";
import {
  isLocale,
  localizeProject,
  localizeSettings,
  type Locale
} from "@/lib/i18n";
import type { PortfolioSettings, Project } from "@/types/portfolio";
import { getPortfolioSettings, getProjects } from "@/lib/portfolio";
import { notFound } from "next/navigation";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const [rawSettings, rawProjects] = await Promise.all([getPortfolioSettings(), getProjects()]);
  const settingsByLocale = {
    en: localizeSettings(rawSettings, "en"),
    es: localizeSettings(rawSettings, "es")
  } satisfies Record<Locale, PortfolioSettings>;
  const projectsByLocale = {
    en: rawProjects.map((project) => localizeProject(project, "en")),
    es: rawProjects.map((project) => localizeProject(project, "es"))
  } satisfies Record<Locale, Project[]>;

  return <HomePageClient settingsByLocale={settingsByLocale} projectsByLocale={projectsByLocale} />;
}
