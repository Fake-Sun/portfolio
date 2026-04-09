import { existsSync, mkdirSync } from "node:fs";
import { promises as fs } from "node:fs";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import seedProjects from "@/data/projects.json";
import type {
  LocalizedPortfolioSettingsContent,
  LocalizedProjectContent,
  PortfolioSettings,
  PortfolioSettingsInput,
  PortfolioStat,
  Project,
  ProjectInput,
  ProjectLink,
  ProjectMetric
} from "@/types/portfolio";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "portfolio.sqlite");

const defaultSettings: PortfolioSettings = {
  name: "Lucas Monzón",
  title: "Full Stack Software Engineer | IT Professional",
  intro:
    "I build scalable web applications across frontend and backend, and I bring a strong IT and troubleshooting background into the way I approach software, systems, and support-heavy environments.",
  about:
    "I am a software engineer based in Buenos Aires with experience across web development, technical problem-solving, IT support, and infrastructure-minded work. My background includes customer service, advanced support, and real-world troubleshooting, which has made me especially comfortable operating in environments where reliability, clarity, and fast resolution matter.",
  email: "contact@lucasmonzon.dev",
  location: "Buenos Aires, AR",
  availability: "Available for freelance work and software engineering opportunities",
  primaryCtaLabel: "Email me",
  primaryCtaHref: "mailto:contact@lucasmonzon.dev",
  secondaryCtaLabel: "LinkedIn",
  secondaryCtaHref: "https://www.linkedin.com/in/lucasmonzon2911/",
  focusAreas: [
    "Full-stack web development",
    "Technical problem-solving",
    "Optimization and debugging",
    "IT and system support"
  ],
  stats: [
    { label: "Base", value: "Buenos Aires" },
    { label: "Main focus", value: "Full-stack web apps" },
    { label: "Core stack", value: "JavaScript, React, Node.js" },
    { label: "Additional strengths", value: "AWS, Docker, IT support" }
  ],
  translations: {
    es: {
      name: "Lucas Monzón",
      title: "Ingeniero Full Stack | Profesional IT",
      intro:
        "Construyo aplicaciones web escalables en frontend y backend, y sumo una base fuerte de IT y troubleshooting a la forma en que abordo software, sistemas y entornos con soporte real.",
      about:
        "Soy un ingeniero de software en Buenos Aires con experiencia en desarrollo web, resolución de problemas técnicos, soporte IT y trabajo orientado a infraestructura. Mi recorrido incluye atención al cliente, soporte avanzado y troubleshooting real, algo que me da comodidad en entornos donde importan la confiabilidad, la claridad y la velocidad de resolución.",
      availability: "Disponible para freelance y oportunidades en ingeniería de software",
      primaryCtaLabel: "Escribime",
      secondaryCtaLabel: "LinkedIn",
      focusAreas: [
        "Desarrollo web full-stack",
        "Resolución de problemas técnicos",
        "Optimización y debugging",
        "Soporte IT y sistemas"
      ],
      stats: [
        { label: "Base", value: "Buenos Aires" },
        { label: "Enfoque", value: "Aplicaciones web full-stack" },
        { label: "Stack principal", value: "JavaScript, React, Node.js" },
        { label: "Fortalezas", value: "AWS, Docker, soporte IT" }
      ]
    }
  }
};

type DbProjectRow = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  category: string;
  status: string;
  impact: string;
  summary: string;
  challenge: string;
  solution: string;
  client: string;
  role: string;
  duration: string;
  cover_image: string;
  gallery_images: string;
  stack: string;
  services: string;
  metrics: string;
  links: string;
  featured: number;
  accent: string;
  translations: string;
};

type DbSettingsRow = {
  name: string;
  title: string;
  intro: string;
  about: string;
  email: string;
  location: string;
  availability: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  focus_areas: string;
  stats: string;
  translations: string;
};

function getDefaultSpanishSettingsTranslation(): LocalizedPortfolioSettingsContent {
  return {
    name: defaultSettings.translations.es?.name ?? defaultSettings.name,
    title: defaultSettings.translations.es?.title ?? defaultSettings.title,
    intro: defaultSettings.translations.es?.intro ?? defaultSettings.intro,
    about: defaultSettings.translations.es?.about ?? defaultSettings.about,
    availability: defaultSettings.translations.es?.availability ?? defaultSettings.availability,
    primaryCtaLabel:
      defaultSettings.translations.es?.primaryCtaLabel ?? defaultSettings.primaryCtaLabel,
    secondaryCtaLabel:
      defaultSettings.translations.es?.secondaryCtaLabel ?? defaultSettings.secondaryCtaLabel,
    focusAreas: defaultSettings.translations.es?.focusAreas ?? defaultSettings.focusAreas,
    stats: defaultSettings.translations.es?.stats ?? defaultSettings.stats
  };
}

function normalizeSettingsTranslations(
  translations: Partial<Record<"es", LocalizedPortfolioSettingsContent>>
) {
  return {
    ...translations,
    es: {
      ...getDefaultSpanishSettingsTranslation(),
      ...(translations.es ?? {})
    }
  } satisfies Partial<Record<"es", LocalizedPortfolioSettingsContent>>;
}

declare global {
  var __portfolioDb: DatabaseSync | undefined;
}

function ensureDataDir() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

function getDb() {
  if (globalThis.__portfolioDb) {
    ensureSchema(globalThis.__portfolioDb);
    return globalThis.__portfolioDb;
  }

  ensureDataDir();
  const db = new DatabaseSync(dbPath);
  ensureSchema(db);
  seedDatabase(db);
  globalThis.__portfolioDb = db;
  return db;
}

function ensureSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      intro TEXT NOT NULL,
      about TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      availability TEXT NOT NULL,
      primary_cta_label TEXT NOT NULL,
      primary_cta_href TEXT NOT NULL,
      secondary_cta_label TEXT NOT NULL,
      secondary_cta_href TEXT NOT NULL,
      focus_areas TEXT NOT NULL,
      stats TEXT NOT NULL,
      translations TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS projects (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      year TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      impact TEXT NOT NULL,
      summary TEXT NOT NULL,
      challenge TEXT NOT NULL,
      solution TEXT NOT NULL,
      client TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      gallery_images TEXT NOT NULL DEFAULT '[]',
      stack TEXT NOT NULL,
      services TEXT NOT NULL,
      metrics TEXT NOT NULL,
      links TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      accent TEXT NOT NULL,
      translations TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS admin_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      secret_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL
    );
  `);

  const settingsColumns = db.prepare("PRAGMA table_info(portfolio_settings)").all() as { name: string }[];
  if (!settingsColumns.some((column) => column.name === "translations")) {
    db.exec("ALTER TABLE portfolio_settings ADD COLUMN translations TEXT NOT NULL DEFAULT '{}'");
  }

  const projectColumns = db.prepare("PRAGMA table_info(projects)").all() as { name: string }[];
  if (!projectColumns.some((column) => column.name === "translations")) {
    db.exec("ALTER TABLE projects ADD COLUMN translations TEXT NOT NULL DEFAULT '{}'");
  }
}

function getDefaultSpanishProjectTranslation(slug: string): Partial<Record<"es", LocalizedProjectContent>> {
  const translations: Record<string, LocalizedProjectContent> = {
    "shoppy-dashboard": {
      title: "Panel Shoppy",
      tagline:
        "Panel administrativo de e-commerce, responsive y pensado para operación diaria y visibilidad del negocio.",
      category: "Panel Administrativo",
      status: "Completado",
      impact: "Reuní múltiples flujos administrativos en una única interfaz configurable.",
      summary:
        "Shoppy es un panel administrativo para e-commerce enfocado en ayudar a gestionar pedidos, clientes, empleados, contenido y reportes desde un solo lugar.",
      challenge:
        "Las herramientas administrativas suelen volverse confusas cuando intentan cubrir analítica, calendario, edición de contenido y gestión operativa al mismo tiempo.",
      solution:
        "Diseñé un dashboard responsive con una arquitectura de información clara, manteniendo soporte para tablas, gráficos, calendario, kanban, edición y personalización.",
      client: "Concepto de panel administrativo",
      role: "Desarrollo frontend",
      duration: "Caso de estudio de producto",
      services: ["Desarrollo frontend", "UX para dashboards", "Integración de componentes"],
      metrics: [
        { label: "Enfoque", value: "Productividad administrativa" },
        { label: "Tipo de interfaz", value: "Dashboard responsive" },
        { label: "Módulos", value: "Tablas, gráficos, calendario, kanban" }
      ],
      links: [{ label: "Referencia de portfolio", href: "https://lucasmonzon.dev/" }]
    },
    "tech-haven-ecommerce": {
      title: "Tech Haven E-Commerce",
      tagline:
        "Plataforma e-commerce full-stack con storefront, gestión de productos vía CMS y checkout con Stripe.",
      category: "Aplicación Web Full-Stack",
      status: "Build de producción disponible",
      impact:
        "Integré storefront, pagos, gestión de contenido y flujo de pedidos en una sola aplicación MERN.",
      summary:
        "Tech Haven es una plataforma de comercio full-stack construida con MERN, Payload CMS y Stripe. Combina experiencia de compra para usuarios con un flujo administrativo de contenido y productos.",
      challenge:
        "Un producto e-commerce necesita equilibrar experiencia de usuario, confiabilidad de pagos, gestión de productos, SEO, media y autenticación sin sentirse fragmentado.",
      solution:
        "Usé una arquitectura full-stack con control de productos desde CMS, autenticación segura, flujo de compra persistente y checkout con Stripe para lograr una experiencia coherente.",
      client: "Tech Haven",
      role: "Desarrollador full-stack",
      duration: "Desarrollo end-to-end",
      services: ["Desarrollo full-stack", "Integración CMS", "Integración de pagos"],
      metrics: [
        { label: "Arquitectura", value: "MERN + PayloadCMS" },
        { label: "Checkout", value: "Stripe" },
        { label: "Audiencia", value: "Clientes + administradores" }
      ],
      links: [
        { label: "Demo en vivo", href: "https://ecommerce-8ljx.onrender.com/" },
        { label: "Referencia de portfolio", href: "https://lucasmonzon.dev/" }
      ]
    },
    "snippet-assistant": {
      title: "Asistente de Snippets",
      tagline:
        "Extensión de Chrome para crear, organizar e insertar snippets reutilizables directamente desde el navegador.",
      category: "Extensión de Navegador",
      status: "Completado",
      impact:
        "Construido como una herramienta práctica para reducir el trabajo repetitivo de copiar y pegar en flujos diarios.",
      summary:
        "Snippet Assistant es una extensión de navegador desarrollada como desafío personal para aprender Vue 3, Vite y TypeScript mientras resolvía un problema real de productividad.",
      challenge:
        "La gestión manual de snippets se vuelve lenta y propensa a errores cuando un equipo reutiliza mensajes, plantillas o fragmentos en tareas repetitivas.",
      solution:
        "Diseñé la extensión alrededor de creación rápida, edición, carpetas, breadcrumbs e inserción ágil para que los snippets sigan siendo útiles en trabajo real y no se conviertan en ruido.",
      client: "Herramienta interna de productividad",
      role: "Constructor de producto + frontend",
      duration: "Proyecto personal",
      services: ["Prototipado de producto", "Desarrollo frontend", "UX para extensiones"],
      metrics: [
        { label: "Almacenamiento", value: "Local-first" },
        { label: "Función principal", value: "Inserción de snippets" },
        { label: "Organización", value: "Carpetas + breadcrumbs" }
      ],
      links: [{ label: "Referencia de portfolio", href: "https://lucasmonzon.dev/" }]
    }
  };

  const translation = translations[slug];
  return translation ? { es: translation } : {};
}

function seedDatabase(db: DatabaseSync) {
  const settingsCount = db.prepare("SELECT COUNT(*) as count FROM portfolio_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    db.prepare(`
      INSERT INTO portfolio_settings (
        id, name, title, intro, about, email, location, availability,
        primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href,
        focus_areas, stats, translations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      defaultSettings.name,
      defaultSettings.title,
      defaultSettings.intro,
      defaultSettings.about,
      defaultSettings.email,
      defaultSettings.location,
      defaultSettings.availability,
      defaultSettings.primaryCtaLabel,
      defaultSettings.primaryCtaHref,
      defaultSettings.secondaryCtaLabel,
      defaultSettings.secondaryCtaHref,
      JSON.stringify(defaultSettings.focusAreas),
      JSON.stringify(defaultSettings.stats),
      JSON.stringify(defaultSettings.translations)
    );
  } else {
    const row = db.prepare("SELECT translations FROM portfolio_settings WHERE id = 1").get() as
      | { translations: string }
      | undefined;
    const parsedTranslations = row?.translations
      ? (JSON.parse(row.translations) as Partial<Record<"es", LocalizedPortfolioSettingsContent>>)
      : {};
    const normalizedTranslations = normalizeSettingsTranslations(parsedTranslations);

    if (!row?.translations || JSON.stringify(parsedTranslations) !== JSON.stringify(normalizedTranslations)) {
      db.prepare("UPDATE portfolio_settings SET translations = ? WHERE id = 1").run(
        JSON.stringify(normalizedTranslations)
      );
    }
  }

  const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (projectsCount.count === 0) {
    const statement = db.prepare(`
      INSERT INTO projects (
        slug, title, tagline, year, category, status, impact, summary,
        challenge, solution, client, role, duration, cover_image, gallery_images,
        stack, services, metrics, links, featured, accent, translations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const project of seedProjects) {
      statement.run(
        project.slug,
        project.title,
        project.tagline,
        project.year,
        project.category,
        project.status,
        project.impact,
        project.summary,
        project.challenge,
        project.solution,
        project.slug === "shoppy-dashboard" ? "Admin dashboard concept" : project.slug === "tech-haven-ecommerce" ? "Tech Haven" : "Internal productivity tool",
        project.slug === "snippet-assistant" ? "Product builder + frontend engineer" : "Full-stack developer",
        project.slug === "tech-haven-ecommerce" ? "End-to-end build" : "Product case study",
        project.slug === "shoppy-dashboard" ? "/uploads/Portfolio-01.png" : project.slug === "tech-haven-ecommerce" ? "/uploads/portfolio-02.png" : "/uploads/portfolio-03.png",
        JSON.stringify(
          project.slug === "shoppy-dashboard"
            ? ["/uploads/shoppy-details.jpg"]
            : project.slug === "tech-haven-ecommerce"
              ? ["/uploads/ecommerce-details.jpg"]
              : ["/uploads/snippet-extension-details.png", "/uploads/snippet-extension-details2.png"]
        ),
        JSON.stringify(project.stack),
        JSON.stringify(project.services),
        JSON.stringify(project.metrics),
        JSON.stringify(project.links),
        project.featured ? 1 : 0,
        project.accent,
        JSON.stringify(getDefaultSpanishProjectTranslation(project.slug))
      );
    }
  } else {
    const rows = db.prepare("SELECT slug, translations FROM projects").all() as {
      slug: string;
      translations: string;
    }[];

    for (const row of rows) {
      if (!row.translations || row.translations === "{}") {
        db.prepare("UPDATE projects SET translations = ? WHERE slug = ?").run(
          JSON.stringify(getDefaultSpanishProjectTranslation(row.slug)),
          row.slug
        );
      }
    }
  }
}

function parseList(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split("\n")
    .flatMap((line) => line.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMetrics(value: string | ProjectMetric[]) {
  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split(":");
      return {
        label: label?.trim() || "Metric",
        value: rest.join(":").trim() || "-"
      };
    });
}

function parseLinks(value: string | ProjectLink[]) {
  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split(":");
      return {
        label: label?.trim() || "Link",
        href: rest.join(":").trim() || "#"
      };
    });
}

function parseStats(value: string | PortfolioStat[]) {
  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split(":");
      return {
        label: label?.trim() || "Stat",
        value: rest.join(":").trim() || "-"
      };
    });
}

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function hashSecret(secret: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(secret, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifySecret(secret: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }
  const supplied = scryptSync(secret, salt, 64);
  const stored = Buffer.from(hash, "hex");
  return supplied.length === stored.length && timingSafeEqual(supplied, stored);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function deserializeProject(row: DbProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    year: row.year,
    category: row.category,
    status: row.status,
    impact: row.impact,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    client: row.client,
    role: row.role,
    duration: row.duration,
    coverImage: row.cover_image,
    galleryImages: JSON.parse(row.gallery_images) as string[],
    stack: JSON.parse(row.stack) as string[],
    services: JSON.parse(row.services) as string[],
    metrics: JSON.parse(row.metrics) as ProjectMetric[],
    links: JSON.parse(row.links) as ProjectLink[],
    featured: Boolean(row.featured),
    accent: row.accent,
    translations: JSON.parse(row.translations || "{}") as Partial<Record<"es", LocalizedProjectContent>>
  };
}

function deserializeSettings(row: DbSettingsRow): PortfolioSettings {
  const translations = normalizeSettingsTranslations(
    JSON.parse(row.translations || "{}") as Partial<Record<"es", LocalizedPortfolioSettingsContent>>
  );

  return {
    name: row.name,
    title: row.title,
    intro: row.intro,
    about: row.about,
    email: row.email,
    location: row.location,
    availability: row.availability,
    primaryCtaLabel: row.primary_cta_label,
    primaryCtaHref: row.primary_cta_href,
    secondaryCtaLabel: row.secondary_cta_label,
    secondaryCtaHref: row.secondary_cta_href,
    focusAreas: JSON.parse(row.focus_areas) as string[],
    stats: JSON.parse(row.stats) as PortfolioStat[],
    translations
  };
}

export function parseProjectInput(payload: Record<string, unknown>): ProjectInput {
  const title = String(payload.title ?? "").trim();
  if (!title) {
    throw new Error("Title is required.");
  }

  return {
    slug: String(payload.slug ?? "").trim() || toSlug(title),
    title,
    tagline: String(payload.tagline ?? "").trim(),
    year: String(payload.year ?? "").trim(),
    category: String(payload.category ?? "").trim(),
    status: String(payload.status ?? "").trim(),
    impact: String(payload.impact ?? "").trim(),
    summary: String(payload.summary ?? "").trim(),
    challenge: String(payload.challenge ?? "").trim(),
    solution: String(payload.solution ?? "").trim(),
    client: String(payload.client ?? "").trim(),
    role: String(payload.role ?? "").trim(),
    duration: String(payload.duration ?? "").trim(),
    coverImage: String(payload.coverImage ?? "").trim(),
    galleryImages: String(payload.galleryImages ?? ""),
    stack: String(payload.stack ?? ""),
    services: String(payload.services ?? ""),
    metrics: String(payload.metrics ?? ""),
    links: String(payload.links ?? ""),
    esTitle: String(payload.esTitle ?? "").trim(),
    esTagline: String(payload.esTagline ?? "").trim(),
    esCategory: String(payload.esCategory ?? "").trim(),
    esStatus: String(payload.esStatus ?? "").trim(),
    esImpact: String(payload.esImpact ?? "").trim(),
    esSummary: String(payload.esSummary ?? "").trim(),
    esChallenge: String(payload.esChallenge ?? "").trim(),
    esSolution: String(payload.esSolution ?? "").trim(),
    esClient: String(payload.esClient ?? "").trim(),
    esRole: String(payload.esRole ?? "").trim(),
    esDuration: String(payload.esDuration ?? "").trim(),
    esServices: String(payload.esServices ?? ""),
    esMetrics: String(payload.esMetrics ?? ""),
    esLinks: String(payload.esLinks ?? ""),
    featured: String(payload.featured ?? "") === "true",
    accent: String(payload.accent ?? "").trim() || "linear-gradient(135deg, #101827 0%, #17324f 100%)"
  };
}

export function parseSettingsInput(payload: Record<string, unknown>): PortfolioSettingsInput {
  return {
    name: String(payload.name ?? "").trim(),
    title: String(payload.title ?? "").trim(),
    intro: String(payload.intro ?? "").trim(),
    about: String(payload.about ?? "").trim(),
    email: String(payload.email ?? "").trim(),
    location: String(payload.location ?? "").trim(),
    availability: String(payload.availability ?? "").trim(),
    primaryCtaLabel: String(payload.primaryCtaLabel ?? "").trim(),
    primaryCtaHref: String(payload.primaryCtaHref ?? "").trim(),
    secondaryCtaLabel: String(payload.secondaryCtaLabel ?? "").trim(),
    secondaryCtaHref: String(payload.secondaryCtaHref ?? "").trim(),
    focusAreas: String(payload.focusAreas ?? ""),
    stats: String(payload.stats ?? ""),
    esTitle: String(payload.esTitle ?? "").trim(),
    esName: String(payload.esName ?? "").trim(),
    esIntro: String(payload.esIntro ?? "").trim(),
    esAbout: String(payload.esAbout ?? "").trim(),
    esAvailability: String(payload.esAvailability ?? "").trim(),
    esPrimaryCtaLabel: String(payload.esPrimaryCtaLabel ?? "").trim(),
    esSecondaryCtaLabel: String(payload.esSecondaryCtaLabel ?? "").trim(),
    esFocusAreas: String(payload.esFocusAreas ?? ""),
    esStats: String(payload.esStats ?? "")
  };
}

export async function getProjects() {
  const rows = getDb().prepare("SELECT * FROM projects ORDER BY CAST(year AS INTEGER) DESC, title ASC").all() as DbProjectRow[];
  return rows.map(deserializeProject);
}

export async function getFeaturedProjects() {
  const rows = getDb().prepare("SELECT * FROM projects WHERE featured = 1 ORDER BY CAST(year AS INTEGER) DESC, title ASC").all() as DbProjectRow[];
  return rows.map(deserializeProject);
}

export async function getProjectBySlug(slug: string) {
  const row = getDb().prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as DbProjectRow | undefined;
  return row ? deserializeProject(row) : undefined;
}

export async function upsertProject(input: ProjectInput) {
  const project: Project = {
    slug: input.slug || toSlug(input.title),
    title: input.title,
    tagline: input.tagline,
    year: input.year,
    category: input.category,
    status: input.status,
    impact: input.impact,
    summary: input.summary,
    challenge: input.challenge,
    solution: input.solution,
    client: input.client,
    role: input.role,
    duration: input.duration,
    coverImage: input.coverImage,
    galleryImages: parseList(input.galleryImages),
    stack: parseList(input.stack),
    services: parseList(input.services),
    metrics: parseMetrics(input.metrics),
    links: parseLinks(input.links),
    featured: input.featured,
    accent: input.accent,
    translations: {
      es: {
        title: input.esTitle,
        tagline: input.esTagline,
        category: input.esCategory,
        status: input.esStatus,
        impact: input.esImpact,
        summary: input.esSummary,
        challenge: input.esChallenge,
        solution: input.esSolution,
        client: input.esClient,
        role: input.esRole,
        duration: input.esDuration,
        services: parseList(input.esServices),
        metrics: parseMetrics(input.esMetrics),
        links: parseLinks(input.esLinks)
      }
    }
  };

  getDb()
    .prepare(`
      INSERT INTO projects (
        slug, title, tagline, year, category, status, impact, summary,
        challenge, solution, client, role, duration, cover_image, gallery_images,
        stack, services, metrics, links, featured, accent, translations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        tagline = excluded.tagline,
        year = excluded.year,
        category = excluded.category,
        status = excluded.status,
        impact = excluded.impact,
        summary = excluded.summary,
        challenge = excluded.challenge,
        solution = excluded.solution,
        client = excluded.client,
        role = excluded.role,
        duration = excluded.duration,
        cover_image = excluded.cover_image,
        gallery_images = excluded.gallery_images,
        stack = excluded.stack,
        services = excluded.services,
        metrics = excluded.metrics,
        links = excluded.links,
        featured = excluded.featured,
        accent = excluded.accent,
        translations = excluded.translations
    `)
    .run(
      project.slug,
      project.title,
      project.tagline,
      project.year,
      project.category,
      project.status,
      project.impact,
      project.summary,
      project.challenge,
      project.solution,
      project.client,
      project.role,
      project.duration,
      project.coverImage,
      JSON.stringify(project.galleryImages),
      JSON.stringify(project.stack),
      JSON.stringify(project.services),
      JSON.stringify(project.metrics),
      JSON.stringify(project.links),
      project.featured ? 1 : 0,
      project.accent,
      JSON.stringify(project.translations)
    );

  return project;
}

export async function deleteProject(slug: string) {
  const result = getDb().prepare("DELETE FROM projects WHERE slug = ?").run(slug);
  if (result.changes === 0) {
    throw new Error("Project not found.");
  }
}

export async function getPortfolioSettings() {
  const row = getDb().prepare("SELECT * FROM portfolio_settings WHERE id = 1").get() as DbSettingsRow | undefined;
  return row ? deserializeSettings(row) : defaultSettings;
}

export async function updatePortfolioSettings(input: PortfolioSettingsInput) {
  const settings: PortfolioSettings = {
    name: input.name,
    title: input.title,
    intro: input.intro,
    about: input.about,
    email: input.email,
    location: input.location,
    availability: input.availability,
    primaryCtaLabel: input.primaryCtaLabel,
    primaryCtaHref: input.primaryCtaHref,
    secondaryCtaLabel: input.secondaryCtaLabel,
    secondaryCtaHref: input.secondaryCtaHref,
    focusAreas: parseList(input.focusAreas),
    stats: parseStats(input.stats),
    translations: {
      es: {
        name: input.esName,
        title: input.esTitle,
        intro: input.esIntro,
        about: input.esAbout,
        availability: input.esAvailability,
        primaryCtaLabel: input.esPrimaryCtaLabel,
        secondaryCtaLabel: input.esSecondaryCtaLabel,
        focusAreas: parseList(input.esFocusAreas),
        stats: parseStats(input.esStats)
      }
    }
  };

  getDb()
    .prepare(`
      UPDATE portfolio_settings
      SET
        name = ?,
        title = ?,
        intro = ?,
        about = ?,
        email = ?,
        location = ?,
        availability = ?,
        primary_cta_label = ?,
        primary_cta_href = ?,
        secondary_cta_label = ?,
        secondary_cta_href = ?,
        focus_areas = ?,
        stats = ?,
        translations = ?
      WHERE id = 1
    `)
    .run(
      settings.name,
      settings.title,
      settings.intro,
      settings.about,
      settings.email,
      settings.location,
      settings.availability,
      settings.primaryCtaLabel,
      settings.primaryCtaHref,
      settings.secondaryCtaLabel,
      settings.secondaryCtaHref,
      JSON.stringify(settings.focusAreas),
      JSON.stringify(settings.stats),
      JSON.stringify(settings.translations)
    );

  return settings;
}

export async function saveUploadedFile(fileName: string, buffer: Buffer) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function hasAdminSecretConfigured() {
  const row = getDb().prepare("SELECT secret_hash FROM admin_config WHERE id = 1").get() as { secret_hash: string } | undefined;
  return Boolean(row?.secret_hash);
}

export async function setAdminSecret(secret: string) {
  const normalized = secret.trim();
  if (normalized.length < 6) {
    throw new Error("Admin secret must be at least 6 characters.");
  }
  if (await hasAdminSecretConfigured()) {
    throw new Error("Admin secret is already configured.");
  }
  getDb().prepare("INSERT INTO admin_config (id, secret_hash) VALUES (1, ?)").run(hashSecret(normalized));
}

export async function verifyAdminSecret(secret: string) {
  const row = getDb().prepare("SELECT secret_hash FROM admin_config WHERE id = 1").get() as { secret_hash: string } | undefined;
  if (!row?.secret_hash) {
    return false;
  }
  return verifySecret(secret, row.secret_hash);
}

export async function createAdminSession() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 14;
  getDb().prepare("INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)").run(hashToken(token), expiresAt);
  return { token, expiresAt };
}

export async function validateAdminSession(token: string) {
  if (!token) {
    return false;
  }
  const row = getDb().prepare("SELECT token_hash, expires_at FROM admin_sessions WHERE token_hash = ?").get(hashToken(token)) as { token_hash: string; expires_at: number } | undefined;
  if (!row) {
    return false;
  }
  if (row.expires_at < Date.now()) {
    getDb().prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(token));
    return false;
  }
  return true;
}

export async function deleteAdminSession(token: string) {
  if (!token) {
    return;
  }
  getDb().prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(token));
}
