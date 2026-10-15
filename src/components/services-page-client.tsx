"use client";

import { ArrowRight, ArrowUpRight, Check, Code2, PlugZap, ShieldCheck } from "lucide-react";
import { useResolvedLocale } from "@/components/locale-provider";
import { buttonVariants } from "@/components/ui/button";

const copyByLocale = {
  en: {
    eyebrow: "Freelance / Development services",
    title: "Small development problems. Clear solutions.",
    description: "I help founders, small teams, and agencies fix JavaScript issues and connect existing applications to external services. Defined scope, upfront quotes, and a practical handoff.",
    available: "Available for remote freelance work · English / Spanish",
    cta: "Describe your project",
    browse: "See my work",
    packagesLabel: "01 / Fixed-price starting points",
    packagesTitle: "Focused work, transparent pricing.",
    packagesIntro: "The starting price applies to the limited scope below. I'll review your requirements and confirm a quote before work begins.",
    packages: [
      {
        id: "bug",
        kicker: "JavaScript / Frontend",
        title: "One bug, properly fixed.",
        price: "$99",
        time: "Typical target: 2 business days",
        description: "For one reproducible problem in an existing Vue, React, Next.js, or JavaScript application.",
        included: ["Investigate and fix one localized frontend issue", "Check the affected functionality", "Source-code change or pull request", "Brief root-cause summary", "One correction if my fix introduced an issue"],
        excluded: "Multiple bugs, architectural rewrites, complex authentication, and new feature work are separately quoted.",
        button: "Request a bug fix",
        subject: "JavaScript bug fix inquiry"
      },
      {
        id: "api",
        kicker: "REST API / Integration",
        title: "Connect your app to an API.",
        price: "$199",
        time: "Typical target: 3–5 business days",
        description: "For one straightforward, documented REST API endpoint or workflow in an existing application.",
        included: ["One agreed data-fetch or submission workflow", "Request and response handling", "Basic validation and error handling", "Safe server-side handling of credentials where applicable", "Testing and short setup notes"],
        excluded: "OAuth complexity, payments, multiple endpoints, background jobs, and advanced webhooks require a custom quote.",
        button: "Request an integration",
        subject: "REST API integration inquiry"
      }
    ],
    scopeNote: "Timing starts after requirements and access are provided. Delivery targets are estimates, not guaranteed deadlines.",
    proofLabel: "02 / Relevant work",
    proofTitle: "Real projects, not just promises.",
    projects: [
      { title: "Rift Insight", stack: "Next.js · TypeScript · Riot Games API", text: "An API-powered League of Legends statistics application using multiple external endpoints.", href: "https://github.com/Fake-Sun/rift-insight" },
      { title: "Snipply", stack: "Vue 3 · TypeScript · Chrome Extension APIs", text: "A browser extension built around reusable snippets, forms, organization, and local persistence.", href: "https://github.com/Fake-Sun/Snipply" },
      { title: "Tech Haven E-Commerce", stack: "React · Node.js · MongoDB · Stripe", text: "A full-stack storefront and administration workflow with payments and content management.", href: "/projects/tech-haven-ecommerce" }
    ],
    view: "View project",
    processLabel: "03 / Process",
    processTitle: "Know what you're buying.",
    steps: [
      { title: "Tell me the problem", text: "Share your stack, expected behavior, error details, and access requirements." },
      { title: "Get a clear quote", text: "I'll confirm what's included, what isn't, and a realistic delivery window." },
      { title: "Receive the fix", text: "I implement, verify the agreed scope, and hand over the changes with notes." }
    ],
    contactLabel: "04 / Get started",
    contactTitle: "Have a bug or integration on your backlog?",
    contactText: "Send a short description of what you need. No need to commit before we agree on scope and price.",
    email: "Email about your project",
    back: "Back to portfolio"
  },
  es: {
    eyebrow: "Freelance / Servicios de desarrollo",
    title: "Problemas de desarrollo puntuales. Soluciones claras.",
    description: "Ayudo a emprendedores, equipos y agencias a corregir errores de JavaScript e integrar servicios externos en aplicaciones existentes. Alcance definido, presupuesto previo y entrega documentada.",
    available: "Disponible para trabajo remoto · Español / Inglés",
    cta: "Contame tu proyecto",
    browse: "Ver mis proyectos",
    packagesLabel: "01 / Servicios con precio inicial",
    packagesTitle: "Trabajo concreto, precios claros.",
    packagesIntro: "Los precios iniciales aplican al alcance limitado que se detalla abajo. Reviso los requisitos y confirmo el presupuesto antes de empezar.",
    packages: [
      {
        id: "bug",
        kicker: "JavaScript / Frontend",
        title: "Un bug, bien resuelto.",
        price: "USD 99",
        time: "Plazo estimado: 2 días hábiles",
        description: "Para un problema reproducible en una aplicación existente desarrollada con Vue, React, Next.js o JavaScript.",
        included: ["Investigar y corregir un problema puntual de frontend", "Verificar la funcionalidad afectada", "Cambio de código o pull request", "Breve explicación de la causa", "Una corrección si mi cambio genera un error"],
        excluded: "Varios errores, reescrituras de arquitectura, autenticación compleja y nuevas funciones se presupuestan aparte.",
        button: "Consultar por un bug",
        subject: "Consulta por corrección de bug"
      },
      {
        id: "api",
        kicker: "REST API / Integraciones",
        title: "Conectá tu aplicación a una API.",
        price: "USD 199",
        time: "Plazo estimado: 3 a 5 días hábiles",
        description: "Para integrar un endpoint o flujo sencillo de una API REST documentada en una aplicación existente.",
        included: ["Un flujo acordado para consultar o enviar datos", "Manejo de peticiones y respuestas", "Validación básica y manejo de errores", "Protección de credenciales en servidor cuando corresponda", "Pruebas y documentación breve"],
        excluded: "OAuth complejo, pagos, múltiples endpoints, tareas en segundo plano y webhooks avanzados requieren presupuesto aparte.",
        button: "Consultar por integración",
        subject: "Consulta por integración REST API"
      }
    ],
    scopeNote: "Los plazos cuentan desde que recibo los requisitos y accesos. Son estimaciones, no fechas garantizadas.",
    proofLabel: "02 / Experiencia relevante",
    proofTitle: "Proyectos reales, no solo promesas.",
    projects: [
      { title: "Rift Insight", stack: "Next.js · TypeScript · Riot Games API", text: "Aplicación de estadísticas de League of Legends con múltiples endpoints externos.", href: "https://github.com/Fake-Sun/rift-insight" },
      { title: "Snipply", stack: "Vue 3 · TypeScript · Chrome Extension APIs", text: "Extensión de navegador con snippets reutilizables, formularios, organización y almacenamiento local.", href: "https://github.com/Fake-Sun/Snipply" },
      { title: "Tech Haven E-Commerce", stack: "React · Node.js · MongoDB · Stripe", text: "Tienda full-stack con administración, integración de pagos y gestión de contenido.", href: "/projects/tech-haven-ecommerce" }
    ],
    view: "Ver proyecto",
    processLabel: "03 / Proceso",
    processTitle: "Sabé qué estás contratando.",
    steps: [
      { title: "Contame el problema", text: "Compartí el stack, qué debería suceder, los errores y los accesos necesarios." },
      { title: "Recibí un presupuesto", text: "Confirmo qué incluye el trabajo, qué queda afuera y el plazo estimado." },
      { title: "Recibí la solución", text: "Implemento, verifico lo acordado y entrego los cambios con una explicación." }
    ],
    contactLabel: "04 / Empecemos",
    contactTitle: "¿Tenés un bug o una integración pendiente?",
    contactText: "Mandame un resumen de lo que necesitás. No hay compromiso hasta que acordemos el alcance y el precio.",
    email: "Escribirme por mi proyecto",
    back: "Volver al portfolio"
  }
} as const;

function emailHref(subject: string) {
  return "mailto:contact@lucasmonzon.dev?subject=" + encodeURIComponent(subject);
}

export function ServicesPageClient() {
  const locale = useResolvedLocale();
  const copy = copyByLocale[locale];

  return (
    <div className="freelance-page">
      <section className="freelance-hero" aria-labelledby="freelance-title">
        <div className="freelance-hero__content">
          <span className="section-kicker"><span className="status-dot" />{copy.eyebrow}</span>
          <h1 id="freelance-title">{copy.title}</h1>
          <p className="freelance-lead">{copy.description}</p>
          <div className="freelance-actions">
            <a className={buttonVariants()} href={emailHref(locale === "en" ? "Freelance project inquiry" : "Consulta de proyecto freelance")}>{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className={buttonVariants({ variant: "outline" })} href="/#featured">{copy.browse}<ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <p className="freelance-availability"><span className="status-dot" />{copy.available}</p>
        </div>
        <div className="freelance-hero__graphic" aria-hidden="true">
          <div className="freelance-graphic__terminal">
            <div className="freelance-graphic__dots"><span /><span /><span /></div>
            <p><span className="freelance-graphic__prompt">$</span> diagnose --scope one-issue</p>
            <p><span className="freelance-graphic__ok">✓</span> reproduce → fix → verify</p>
            <p><span className="freelance-graphic__ok">✓</span> clean handoff</p>
            <div className="freelance-graphic__cursor" />
          </div>
        </div>
      </section>

      <section className="freelance-section" aria-labelledby="packages-title">
        <div className="freelance-section__heading">
          <span className="section-kicker">{copy.packagesLabel}</span>
          <h2 id="packages-title">{copy.packagesTitle}</h2>
          <p>{copy.packagesIntro}</p>
        </div>
        <div className="freelance-packages">
          {copy.packages.map((offer, index) => (
            <article className="freelance-package" key={offer.id}>
              <div className="freelance-package__top">
                <span className="freelance-package__icon">{index === 0 ? <Code2 size={22} aria-hidden="true" /> : <PlugZap size={22} aria-hidden="true" />}</span>
                <span className="freelance-package__kicker">{offer.kicker}</span>
              </div>
              <h3>{offer.title}</h3>
              <p className="freelance-package__description">{offer.description}</p>
              <div className="freelance-package__price"><strong>{offer.price}</strong><span> {locale === "en" ? "starting price" : "precio inicial"}</span></div>
              <p className="freelance-package__time">{offer.time}</p>
              <ul>{offer.included.map((line) => <li key={line}><Check size={16} aria-hidden="true" />{line}</li>)}</ul>
              <p className="freelance-package__limit">{offer.excluded}</p>
              <a className={buttonVariants()} href={emailHref(offer.subject)}>{offer.button}<ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <p className="freelance-disclaimer"><ShieldCheck size={16} aria-hidden="true" />{copy.scopeNote}</p>
      </section>

      <section className="freelance-section" aria-labelledby="proof-title">
        <div className="freelance-section__heading">
          <span className="section-kicker">{copy.proofLabel}</span>
          <h2 id="proof-title">{copy.proofTitle}</h2>
        </div>
        <div className="freelance-projects">
          {copy.projects.map((project) => (
            <article className="freelance-project" key={project.title}>
              <span className="freelance-project__stack">{project.stack}</span>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
              <a href={project.href} target={project.href.startsWith("https") ? "_blank" : undefined} rel={project.href.startsWith("https") ? "noreferrer" : undefined}>{copy.view}<ArrowUpRight size={15} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="freelance-section" aria-labelledby="process-title">
        <div className="freelance-section__heading">
          <span className="section-kicker">{copy.processLabel}</span>
          <h2 id="process-title">{copy.processTitle}</h2>
        </div>
        <div className="freelance-steps">
          {copy.steps.map((step, i) => (
            <div key={step.title} className="freelance-step">
              <span className="freelance-step__number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="freelance-contact" aria-labelledby="freelance-contact-title">
        <span className="section-kicker">{copy.contactLabel}</span>
        <h2 id="freelance-contact-title">{copy.contactTitle}</h2>
        <p>{copy.contactText}</p>
        <a className={buttonVariants()} href={emailHref(locale === "en" ? "Freelance project inquiry" : "Consulta de proyecto freelance")}>{copy.email}<ArrowUpRight size={18} aria-hidden="true" /></a>
        <a className="freelance-back" href="/">{copy.back}<ArrowRight size={15} aria-hidden="true" /></a>
      </section>
    </div>
  );
}
