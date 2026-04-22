"use client";

import { useResolvedLocale } from "@/components/locale-provider";
import { siteCopy, type Locale } from "@/lib/i18n";
import { normalizeHref } from "@/lib/urls";
import type { Project } from "@/types/portfolio";

type ProjectPageClientProps = {
  projectByLocale: Record<Locale, Project>;
};

export function ProjectPageClient({ projectByLocale }: ProjectPageClientProps) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];
  const project = projectByLocale[locale];
  const projectTitle = project.title || "Portfolio project";

  return (
    <div className="project-page">
      <a href="/" className="back-link">
        {copy.backToPortfolio as string}
      </a>

      <section className="project-hero" style={{ backgroundImage: project.accent }}>
        <div className="project-hero__overlay" />
        <div className="project-hero__copy">
          <span className="eyebrow">
            {project.category} / {project.year}
          </span>
          <h1>{project.title}</h1>
          <p>{project.tagline}</p>
          <strong>{project.impact}</strong>
        </div>
      </section>

      {project.coverImage ? (
        <section className="project-media">
          <img
            src={project.coverImage}
            alt={`${projectTitle} cover preview`}
            className="project-cover-image"
          />
        </section>
      ) : null}

      <section className="project-body">
        <article>
          <h2>{copy.projectSummary as string}</h2>
          <p>{project.summary}</p>
        </article>
        <article>
          <h2>{copy.theChallenge as string}</h2>
          <p>{project.challenge}</p>
        </article>
        <article>
          <h2>{copy.theSolution as string}</h2>
          <p>{project.solution}</p>
        </article>
      </section>

      <section className="project-meta-grid">
        <div className="meta-panel">
          <h3>{copy.context as string}</h3>
          <ul className="meta-detail-list">
            <li className="meta-detail-item">
              <span>{copy.client as string}</span>
              <strong>{project.client || (copy.confidential as string)}</strong>
            </li>
            <li className="meta-detail-item">
              <span>{copy.role as string}</span>
              <strong>{project.role || (copy.frontendEngineering as string)}</strong>
            </li>
            <li className="meta-detail-item">
              <span>{copy.duration as string}</span>
              <strong>{project.duration || (copy.notSpecified as string)}</strong>
            </li>
          </ul>
        </div>
        <div className="meta-panel">
          <h3>{copy.stack as string}</h3>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="meta-panel">
          <h3>{copy.servicesLabel as string}</h3>
          <ul>
            {project.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="meta-panel">
          <h3>{copy.metrics as string}</h3>
          <ul className="meta-metric-list">
            {project.metrics.map((metric) => (
              <li key={metric.label} className="meta-metric-item">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {project.galleryImages.length > 0 ? (
        <section className="gallery-grid">
          {project.galleryImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`${projectTitle} gallery image ${index + 1}`}
              className="gallery-image"
            />
          ))}
        </section>
      ) : null}

      <section className="project-links-panel">
        <h2>{copy.relevantLinks as string}</h2>
        <div className="project-links-grid">
          {project.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={normalizeHref(link.href)}
              target="_blank"
              rel="noreferrer"
              className="project-link-card"
            >
              <span>{link.label}</span>
              <strong>{normalizeHref(link.href)}</strong>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
