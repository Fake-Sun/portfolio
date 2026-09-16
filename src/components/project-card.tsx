"use client";

import { ArrowUpRight, Code2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { designCopy } from "@/lib/design-copy";
import { siteCopy, type Locale } from "@/lib/i18n";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = { project: Project; locale: Locale; index?: number };

export function ProjectCard({ project, locale, index = 0 }: ProjectCardProps) {
  const copy = siteCopy[locale];
  const projectHref = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article className={`work-card${index === 0 ? " work-card--lead" : ""}`}>
      <a href={projectHref} className="work-card__visual" aria-label={`${copy.viewProject}: ${project.title}`}>
        <div className="work-card__browser" aria-hidden="true"><span /><span /><span /><i>{project.title}</i><ArrowUpRight size={13} /></div>
        <div className="work-card__screen">
          {project.coverImage ? <img src={project.coverImage} alt={`${project.title}: ${designCopy[locale].projectPreview}`} loading="lazy" /> :
            <div className="work-card__placeholder" style={{ backgroundImage: project.accent }}><Code2 size={72} strokeWidth={1} aria-hidden="true" /><span>{project.title}</span></div>}
        </div>
        <span className="work-card__open" aria-hidden="true"><ArrowUpRight size={23} /></span>
      </a>
      <div className="work-card__content">
        <div className="work-card__eyebrow"><span>{project.category}</span><span>{project.year}</span></div>
        <h3><a href={projectHref}>{project.title}</a></h3>
        <p>{project.tagline}</p>
        <div className="work-card__context">{[project.role, project.client].filter(Boolean).map((item, i) => <span key={`${item}-${i}`}>{item}</span>)}</div>
        {project.stack.length > 0 && <ul className="work-card__stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>}
        <div className="work-card__bottom"><span className="work-card__status">{project.status}</span>
          <a href={projectHref} className={buttonVariants({ variant: "outline", size: "sm" })}>{copy.viewProject}<ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  );
}
