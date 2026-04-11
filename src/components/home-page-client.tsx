"use client";

import { ProjectCard } from "@/components/project-card";
import { useResolvedLocale } from "@/components/locale-provider";
import { siteCopy, type Locale } from "@/lib/i18n";
import type { PortfolioSettings, Project } from "@/types/portfolio";

type HomePageClientProps = {
  settingsByLocale: Record<Locale, PortfolioSettings>;
  projectsByLocale: Record<Locale, Project[]>;
};

export function HomePageClient({ settingsByLocale, projectsByLocale }: HomePageClientProps) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];
  const settings = settingsByLocale[locale];
  const projects = projectsByLocale[locale];
  const secondaryIsExternal = settings.secondaryCtaHref.startsWith("http");
  const skillCloud = [
    ...settings.focusAreas,
    ...(copy.skillCloud as string[])
  ];

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">{copy.heroEyebrow as string}</span>
          <h1>{settings.name}</h1>
          <p className="hero-subtitle">{settings.title}</p>
          <p>{settings.intro}</p>
          <div className="hero-meta-row">
            <span className="hero-meta-pill">{settings.location}</span>
            <span className="hero-meta-pill">{settings.availability}</span>
            <span className="hero-meta-pill">{settings.email}</span>
          </div>
          <div className="hero-actions">
            <a href={settings.primaryCtaHref} className="button-primary">
              {settings.primaryCtaLabel}
            </a>
            <a
              href={settings.secondaryCtaHref}
              className="button-secondary"
              target={secondaryIsExternal ? "_blank" : undefined}
              rel={secondaryIsExternal ? "noreferrer" : undefined}
            >
              <span className="button-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3Zm15.19 9.88c0-3.49-1.86-5.11-4.35-5.11-2 0-2.89 1.1-3.39 1.87V8.5H9.31c.04.75 0 11.5 0 11.5h3.39v-6.42c0-.34.02-.67.12-.91.27-.67.88-1.36 1.9-1.36 1.34 0 1.87 1.02 1.87 2.51V20H20v-7.12Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {settings.secondaryCtaLabel}
            </a>
          </div>
          <div className="hero-bottom">
            <div className="hero-summary-card">
              <span>{copy.snapshot as string}</span>
              <p>{copy.snapshotText as string}</p>
              <div className="hero-summary-points">
                {(copy.snapshotPoints as string[]).map((item) => (
                  <div key={item} className="hero-summary-point">
                    <span />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <div className="hero-summary-tags">
                {(copy.snapshotHighlights as string[]).map((item) => (
                  <span key={item} className="hero-summary-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="skill-cloud">
              {skillCloud.map((item) => (
                <span key={item} className="skill-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="hero-aside">
          <div className="portrait-card portrait-card--hero">
            <img src="/uploads/01.jpg" alt="Lucas Monzón portrait" className="portrait-image" />
          </div>
          <div className="stats-grid">
            {settings.stats.map((stat) => (
              <div key={stat.label} className="signal-tile signal-tile--compact">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="profile-grid">
        <article className="profile-panel">
          <span className="eyebrow">{copy.about as string}</span>
          <h2>{copy.whoIAmTitle as string}</h2>
          <p>{settings.about}</p>
        </article>
        <article className="profile-panel">
          <span className="eyebrow">{copy.focusAreas as string}</span>
          <p>{copy.aboutText as string}</p>
          <div className="capability-list">
            {settings.focusAreas.map((item) => (
              <div key={item} className="capability-item">
                <span />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="about-visual">
        <div className="about-visual__image">
          <img src="/uploads/dev-lucas-03.jpg" alt="Lucas Monzón profile" className="about-profile-image" />
        </div>
        <div className="about-visual__copy">
          <span className="eyebrow">{copy.whoIAm as string}</span>
          <h2>{copy.howIContribute as string}</h2>
          <p>{copy.whoIAmText as string}</p>
          <div className="service-rail">
            {(copy.services as { title: string; description: string }[]).map((service) => (
              <article key={service.title} className="service-card">
                <span>{service.title}</span>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">{copy.myWork as string}</span>
          <h2>{copy.selectedWork as string}</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
