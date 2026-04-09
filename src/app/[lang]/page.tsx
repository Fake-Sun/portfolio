import { ProjectCard } from "@/components/project-card";
import {
  isLocale,
  localizeProject,
  localizeSettings,
  siteCopy,
  type Locale
} from "@/lib/i18n";
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
  const copy = siteCopy[locale];
  const [rawSettings, rawProjects] = await Promise.all([getPortfolioSettings(), getProjects()]);
  const settings = localizeSettings(rawSettings, locale);
  const projects = rawProjects.map((project) => localizeProject(project, locale));
  const secondaryIsExternal = settings.secondaryCtaHref.startsWith("http");

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">{copy.heroEyebrow as string}</span>
          <h1>{settings.name}</h1>
          <p className="hero-subtitle">{settings.title}</p>
          <p>{settings.intro}</p>
          <div className="hero-details">
            <div className="hero-detail">
              <span>{copy.basedIn as string}</span>
              <strong>{settings.location}</strong>
            </div>
            <div className="hero-detail">
              <span>{copy.contact as string}</span>
              <strong>{settings.email}</strong>
            </div>
            <div className="hero-detail hero-detail--wide">
              <span>{copy.availability as string}</span>
              <strong>{settings.availability}</strong>
            </div>
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
            </div>
            <div className="hero-highlight-list">
              {(copy.highlights as string[]).map((item) => (
                <div key={item} className="hero-highlight-item">
                  <span />
                  <p>{item}</p>
                </div>
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

      <section className="insight-strip">
        <div>
          <span>{copy.about as string}</span>
          <p>{copy.aboutText as string}</p>
        </div>
        <div>
          <span>{copy.availability as string}</span>
          <p>{settings.availability}</p>
        </div>
        <div>
          <span>{copy.focusAreas as string}</span>
          <p>{settings.focusAreas.slice(0, 3).join(" / ")}</p>
        </div>
      </section>

      <section className="about-visual">
        <div className="about-visual__image">
          <img src="/uploads/dev-lucas-03.jpg" alt="Lucas Monzón profile" className="about-profile-image" />
        </div>
        <div className="about-visual__copy">
          <span className="eyebrow">{copy.whoIAm as string}</span>
          <h2>{copy.whoIAmTitle as string}</h2>
          <p>{copy.whoIAmText as string}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="eyebrow">{copy.whatIDo as string}</span>
          <h2>{copy.howIWork as string}</h2>
        </div>
        <div className="insight-strip">
          {(copy.services as { title: string; description: string }[]).map((service) => (
            <div key={service.title}>
              <span>{service.title}</span>
              <p>{service.description}</p>
            </div>
          ))}
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
