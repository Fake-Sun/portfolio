import { notFound, redirect } from "next/navigation";

import {
  getCanonicalProjectSlug,
  isLocale,
  getLocalizedProjectSlug
} from "@/lib/i18n";
import { getProjects } from "@/lib/portfolio";

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

  const canonicalSlug = getCanonicalProjectSlug(slug);
  redirect(`/projects/${canonicalSlug}`);
}
