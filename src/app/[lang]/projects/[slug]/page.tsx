import { notFound } from "next/navigation";

import { ProjectPageClient } from "@/components/project-page-client";
import {
  getCanonicalProjectSlug,
  getLocalizedProjectSlug,
  isLocale,
  localizeProject,
  type Locale
} from "@/lib/i18n";
import { getProjectBySlug, getProjects } from "@/lib/portfolio";
import type { Project } from "@/types/portfolio";

type ProjectPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.flatMap((project) => [
    { lang: "en", slug: getLocalizedProjectSlug(project.slug, "en") },
    { lang: "es", slug: getLocalizedProjectSlug(project.slug, "es") }
  ]);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const canonicalSlug = getCanonicalProjectSlug(slug);
  const rawProject = await getProjectBySlug(canonicalSlug);

  if (!rawProject) {
    notFound();
  }

  const projectByLocale = {
    en: localizeProject(rawProject, "en"),
    es: localizeProject(rawProject, "es")
  } satisfies Record<Locale, Project>;

  return <ProjectPageClient projectByLocale={projectByLocale} />;
}
