"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { useResolvedLocale } from "@/components/locale-provider";
import { Reveal } from "@/components/portfolio-motion";
import { buttonVariants } from "@/components/ui/button";
import { designCopy } from "@/lib/design-copy";
import { siteCopy, type Locale } from "@/lib/i18n";
import { normalizeHref } from "@/lib/urls";
import type { Project } from "@/types/portfolio";

export function ProjectPageClient({ projectByLocale }: { projectByLocale: Record<Locale, Project> }) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];
  const design = designCopy[locale];
  const project = projectByLocale[locale];
  const chapters = [
    { title: copy.projectSummary, text: project.summary },
    { title: copy.theChallenge, text: project.challenge },
    { title: copy.theSolution, text: project.solution }
  ];

  return (
    <div className="case-study">
      <a href="/#featured" className="case-back"><ArrowLeft size={17} aria-hidden="true" />{copy.backToPortfolio}</a>
      <section className="case-header" aria-labelledby="case-title">
        <Reveal><div className="section-kicker">{project.category}<span>/</span>{project.year}</div>
          <h1 id="case-title">{project.title}<span className="name-period">.</span></h1>
          <p className="case-tagline">{project.tagline}</p>
        </Reveal>
        <div className="case-header__aside"><span className="case-status">{project.status}</span><p>{project.impact}</p>
          <div className="case-primary-links">{project.links.map((link, index) => <a
            key={`${link.label}-${index}`} href={normalizeHref(link.href)} target="_blank" rel="noreferrer"
            className={buttonVariants({ variant: index === 0 ? "default" : "outline", size: "sm" })}>
            {link.label}<ArrowUpRight size={16} aria-hidden="true" />
          </a>)}</div>
        </div>
      </section>

      {project.coverImage && <Reveal className="case-cover"><img src={project.coverImage}
        alt={`${project.title}: ${design.projectPreview}`} fetchPriority="high" /></Reveal>}

      <div className="case-layout">
        <aside className="case-context" aria-label={design.projectDetails}>
          <span className="section-kicker">{copy.context}</span>
          <dl>{[
            [copy.client, project.client || copy.confidential],
            [copy.role, project.role || copy.frontendEngineering],
            [copy.duration, project.duration || copy.notSpecified]
          ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <h3>{copy.stack}</h3><ul className="technology-list">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{copy.servicesLabel}</h3><ul className="case-services">{project.services.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
        <div className="case-chapters">{chapters.map((chapter, index) => <Reveal key={chapter.title}>
          <article className="case-chapter"><span className="chapter-number">0{index + 1}</span><div><h2>{chapter.title}</h2><p>{chapter.text}</p></div></article>
        </Reveal>)}</div>
      </div>

      {project.metrics.length > 0 && <section className="case-results" aria-labelledby="results-title">
        <span className="section-kicker" id="results-title">{copy.metrics}</span>
        <dl>{project.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
      </section>}

      {project.galleryImages.length > 0 && <section className="case-gallery" aria-labelledby="gallery-title">
        <div className="section-heading-row"><div><span className="section-kicker">{design.gallery}</span><h2 id="gallery-title">{project.title}</h2></div></div>
        <div className="case-gallery__grid">{project.galleryImages.map((image, index) => <Reveal key={`${image}-${index}`}>
          <figure><img src={image} alt={`${project.title}: ${design.gallery} ${index + 1}`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, "0")} / {project.title}</figcaption></figure>
        </Reveal>)}</div>
      </section>}

      {project.links.length > 0 && <section className="case-links" aria-labelledby="links-title">
        <h2 id="links-title">{copy.relevantLinks}</h2>
        {project.links.map((link, index) => <a key={`${link.label}-${index}`} href={normalizeHref(link.href)} target="_blank" rel="noreferrer">
          <span>{link.label}<small>{normalizeHref(link.href)}</small></span><ArrowUpRight aria-hidden="true" />
        </a>)}
      </section>}
    </div>
  );
}
