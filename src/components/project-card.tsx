"use client";

import { siteCopy, type Locale } from "@/lib/i18n";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  project: Project;
  locale: Locale;
};

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const copy = siteCopy[locale];
  const metaItems = [project.role, project.client].filter(Boolean);

  return (
    <article className="project-card">
      <div className="project-card__media" style={{ backgroundImage: project.accent }}>
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.title} className="project-card__image" />
        ) : null}
        <div className="project-card__topline">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </div>
      <div className="project-card__body">
        <h3>{project.title}</h3>
        <p>{project.tagline}</p>
        {metaItems.length > 0 ? (
          <div className="project-card__meta">
            {metaItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ) : null}
        <div className="project-card__footer">
          <span>{project.status}</span>
          <a href={`/${locale}/projects/${project.slug}`} className="project-card__link">
            {copy.viewProject as string}
          </a>
        </div>
      </div>
    </article>
  );
}
