import { notFound } from "next/navigation";

import { LocaleProvider } from "@/components/locale-provider";
import { ProjectPageClient } from "@/components/project-page-client";
import { SiteChrome } from "@/components/site-chrome";
import {
  defaultLocale,
  getCanonicalProjectSlug,
  localizeProject,
  type Locale
} from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/portfolio";
import type { Project } from "@/types/portfolio";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: LegacyProjectPageProps) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalProjectSlug(slug);
  const rawProject = await getProjectBySlug(canonicalSlug);

  if (!rawProject) {
    notFound();
  }

  const projectByLocale = {
    en: localizeProject(rawProject, "en"),
    es: localizeProject(rawProject, "es")
  } satisfies Record<Locale, Project>;

  return (
    <LocaleProvider initialLocale={defaultLocale}>
      <SiteChrome>
        <ProjectPageClient projectByLocale={projectByLocale} />
      </SiteChrome>
    </LocaleProvider>
  );
}
