import { siteCopy, type Locale } from "@/lib/i18n";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  project: Project;
  locale: Locale;
};

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const copy = siteCopy[locale];

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
        <div className="project-card__meta">
          <span>{project.role}</span>
          <span>{project.client}</span>
        </div>
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
