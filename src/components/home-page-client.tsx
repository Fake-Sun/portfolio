"use client";

import { ArrowDown, ArrowUpRight, Code2, Database, Globe2, Layers3, MapPin, Server } from "lucide-react";

import { ProjectCard } from "@/components/project-card";
import { Parallax, Reveal } from "@/components/portfolio-motion";
import { useResolvedLocale } from "@/components/locale-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { designCopy } from "@/lib/design-copy";
import { siteCopy, type Locale } from "@/lib/i18n";
import type { PortfolioSettings, Project } from "@/types/portfolio";

type HomePageClientProps = {
  settingsByLocale: Record<Locale, PortfolioSettings>;
  projectsByLocale: Record<Locale, Project[]>;
};

const skillGroupMembers = [
  ["React", "TypeScript", "Node.js"],
  ["Python", "Java", "MySQL", "MongoDB"],
  ["AWS", "Docker", "Windows / Linux", "Git / GitHub", "DNS / SSL"]
];
const skillIcons = [Code2, Database, Server];

export function HomePageClient({ settingsByLocale, projectsByLocale }: HomePageClientProps) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];
  const design = designCopy[locale];
  const settings = settingsByLocale[locale];
  const projects = projectsByLocale[locale];
  const secondaryIsExternal = settings.secondaryCtaHref.startsWith("http");

  return (
    <div className="portfolio-home">
      <section className="intro-hero" aria-labelledby="intro-title">
        <div className="intro-hero__grid" aria-hidden="true" />
        <Reveal className="intro-copy">
          <div className="section-kicker"><span className="status-dot" />{copy.heroEyebrow}</div>
          <h1 id="intro-title">{settings.name}<span className="name-period">.</span></h1>
          <p className="intro-role">{settings.title}</p>
          <p className="intro-description">{settings.intro}</p>
          <div className="intro-actions">
            <a href={settings.primaryCtaHref} className={buttonVariants()}>
              {settings.primaryCtaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href={settings.secondaryCtaHref} className={buttonVariants({ variant: "outline" })}
              target={secondaryIsExternal ? "_blank" : undefined} rel={secondaryIsExternal ? "noreferrer" : undefined}>
              <span className="linkedin-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3Zm15.19 9.88c0-3.49-1.86-5.11-4.35-5.11-2 0-2.89 1.1-3.39 1.87V8.5H9.31c.04.75 0 11.5 0 11.5h3.39v-6.42c0-.34.02-.67.12-.91.27-.67.88-1.36 1.9-1.36 1.34 0 1.87 1.02 1.87 2.51V20H20v-7.12Z" /></svg>
              </span>
              {settings.secondaryCtaLabel}
            </a>
          </div>
          <div className="intro-location"><MapPin size={14} aria-hidden="true" />{settings.location}</div>
        </Reveal>

        <div className="portrait-scene">
          <div className="portrait-orbit portrait-orbit--one" aria-hidden="true" />
          <div className="portrait-orbit portrait-orbit--two" aria-hidden="true" />
          <Parallax className="portrait-stage" distance={28}>
            <div className="portrait-frame">
              <img src="/uploads/lucas-portrait-formal.png" alt={design.portrait}
                width={1086} height={1448} fetchPriority="high" />
              <div className="portrait-caption"><span>Lucas Monzón</span><ArrowUpRight size={18} aria-hidden="true" /></div>
            </div>
          </Parallax>
          <div className="floating-note floating-note--code" aria-hidden="true"><Code2 size={22} /><span>React / TypeScript</span></div>
          <div className="floating-note floating-note--stack" aria-hidden="true"><Layers3 size={22} /><span>{design.floatingNote}</span></div>
          <span className="portrait-coordinate" aria-hidden="true">34°36′ S / 58°23′ W</span>
        </div>

        <div className="hero-baseline">
          <a href="#featured" className="explore-link"><span className="explore-arrow"><ArrowDown size={17} aria-hidden="true" /></span>{design.scroll}</a>
          <p className="availability-note"><span className="status-dot" />{settings.availability}</p>
        </div>
      </section>

      <dl className="profile-signals">
        {settings.stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
      </dl>

      <section id="featured" className="portfolio-section work-section" aria-labelledby="work-title">
        <Reveal className="section-heading-row">
          <div><span className="section-kicker">01 / {copy.selectedWork}</span><h2 id="work-title">{design.workIntro}</h2></div>
          <p>{design.workDescription}</p>
        </Reveal>
        <div className="work-grid">
          {projects.map((project, index) => <Reveal key={project.slug} className={index === 0 ? "work-grid__lead" : undefined}>
            <ProjectCard project={project} locale={locale} index={index} />
          </Reveal>)}
        </div>
        <div className="section-endnote"><span>{String(projects.length).padStart(2, "0")} {design.projectCount}</span><span>Next.js / TypeScript / {copy.myWork}</span></div>
      </section>

      <section id="expertise" className="portfolio-section expertise-section" aria-labelledby="expertise-title">
        <Reveal className="expertise-heading">
          <span className="section-kicker">02 / {design.expertise}</span>
          <h2 id="expertise-title">{design.expertiseTitle}</h2>
          <p>{design.expertiseIntro}</p>
          <div className="expertise-symbol" aria-hidden="true"><Code2 strokeWidth={0.7} /></div>
        </Reveal>
        <div className="expertise-content">
          <div className="skill-groups">
            {skillGroupMembers.map((members, index) => {
              const Icon = skillIcons[index];
              return <Reveal className="skill-group" key={index} delay={index * 0.05}>
                <div className="skill-group__title"><Icon size={20} aria-hidden="true" /><h3>{design.skillGroups[index]}</h3><span>0{index + 1}</span></div>
                <ul className="technology-list">{members.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </Reveal>;
            })}
          </div>
          <div className="focus-overview"><span className="section-kicker">{copy.focusAreas}</span>
            <ul>{settings.focusAreas.map((area) => <li key={area}><ArrowUpRight size={16} aria-hidden="true" />{area}</li>)}</ul>
          </div>
        </div>
      </section>

      <section id="about" className="about-section" aria-labelledby="about-title">
        <div className="about-photo-column">
          <Parallax className="about-photo" distance={22}>
            <img src="/uploads/lucas-portrait-smiling.png" alt={design.smilingPortrait} width={1086} height={1448} loading="lazy" />
          </Parallax>
          <div className="photo-footnote"><Globe2 size={16} aria-hidden="true" /><span>{settings.location}</span><span>LM.</span></div>
        </div>
        <Reveal className="about-story">
          <span className="section-kicker">03 / {design.about}</span>
          <h2 id="about-title">{design.aboutTitle}</h2>
          <p className="about-story__lead">{settings.about}</p>
          <Accordion defaultValue={["background"]} className="background-accordion">
            <AccordionItem value="background">
              <AccordionTrigger>{design.moreBackground}</AccordionTrigger>
              <AccordionContent><p>{copy.whoIAmText}</p></AccordionContent>
            </AccordionItem>
            {copy.services.map((service, index) => <AccordionItem key={index} value={`service-${index}`}>
              <AccordionTrigger>{service.title}</AccordionTrigger>
              <AccordionContent><p>{service.description}</p></AccordionContent>
            </AccordionItem>)}
          </Accordion>
        </Reveal>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="contact-orbit" aria-hidden="true" />
        <Reveal><span className="section-kicker">04 / {copy.contact}</span>
          <h2 id="contact-title">{design.contactTitle}</h2><p>{design.contactIntro}</p>
          <a href={`mailto:${settings.email}`} className="contact-email">{settings.email}<ArrowUpRight aria-hidden="true" /></a>
        </Reveal>
      </section>
    </div>
  );
}
