import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import seedProjects from "@/data/projects.json";
import { normalizeHref } from "@/lib/urls";
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

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";
const supabaseStorageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "portfolio-assets";

const storageUnavailableMessage =
  "Admin storage is not configured. Add Supabase environment variables and run the provided schema before using the live CMS.";

const defaultSettings: PortfolioSettings = {
  name: "Lucas Monzón",
  title: "Full Stack Software Engineer | IT Professional",
  intro:
    "I build web applications and internal tools, and I bring hands-on experience from advanced customer support, technical troubleshooting, hosting, and deployment into the way I approach software.",
  about:
    "My background combines software engineering with real support and operations work. Alongside JavaScript, React, Node.js, Python, Java, and databases, I have experience with Windows and Linux administration, AWS, Docker, DNS, SSL, and day-to-day technical problem solving. That mix makes me comfortable building product features while also thinking about reliability, maintenance, and the actual issues users run into.",
  email: "contact@lucasmonzon.dev",
  location: "Buenos Aires, AR",
  availability: "Available for freelance work and software engineering opportunities",
  primaryCtaLabel: "Email me",
  primaryCtaHref: "mailto:contact@lucasmonzon.dev",
  secondaryCtaLabel: "LinkedIn",
  secondaryCtaHref: "https://www.linkedin.com/in/lucasmonzon2911/",
  focusAreas: [
    "Web applications and internal tools",
    "Advanced troubleshooting and debugging",
    "Hosting, deployment, and infrastructure context",
    "Support-driven technical work"
  ],
  stats: [
    { label: "Base", value: "Buenos Aires" },
    { label: "Support track", value: "Customer support + L2 contingency" },
    { label: "Core stack", value: "JavaScript, React, Node.js" },
    { label: "Infra and ops", value: "AWS, Docker, DNS, SSL" }
  ],
  translations: {
    es: {
      name: "Lucas Monzón",
      title: "Ingeniero Full Stack | Profesional IT",
      intro:
        "Construyo aplicaciones web y herramientas internas, y sumo experiencia real de soporte avanzado, troubleshooting técnico, hosting y despliegue a la forma en que abordo el software.",
      about:
        "Mi perfil combina ingeniería de software con trabajo real de soporte y operación. Además de JavaScript, React, Node.js, Python, Java y bases de datos, tengo experiencia en administración de Windows y Linux, AWS, Docker, DNS, SSL y resolución técnica del día a día. Esa mezcla me da comodidad para construir producto pensando también en confiabilidad, mantenimiento y los problemas reales que tienen los usuarios.",
      availability: "Disponible para freelance y oportunidades en ingeniería de software",
      primaryCtaLabel: "Escribime",
      secondaryCtaLabel: "LinkedIn",
      focusAreas: [
        "Aplicaciones web y herramientas internas",
        "Troubleshooting avanzado y debugging",
        "Hosting, despliegue e infraestructura",
        "Trabajo técnico con base en soporte"
      ],
      stats: [
        { label: "Base", value: "Buenos Aires" },
        { label: "Recorrido en soporte", value: "Atención al cliente + soporte L2" },
        { label: "Stack principal", value: "JavaScript, React, Node.js" },
        { label: "Infra y ops", value: "AWS, Docker, DNS, SSL" }
      ]
    }
  }
};

type ProjectRow = {
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
  gallery_images: string[] | null;
  stack: string[] | null;
  services: string[] | null;
  metrics: ProjectMetric[] | null;
  links: ProjectLink[] | null;
  featured: boolean;
  accent: string;
  translations: Partial<Record<"es", LocalizedProjectContent>> | null;
};

type SettingsRow = {
  id: number;
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
  focus_areas: string[] | null;
  stats: PortfolioStat[] | null;
  translations: Partial<Record<"es", LocalizedPortfolioSettingsContent>> | null;
};

type AdminConfigRow = {
  id: number;
  secret_hash: string;
};

type AdminSessionRow = {
  token_hash: string;
  expires_at: string;
};

declare global {
  var __portfolioSupabase: SupabaseClient | undefined;
  var __portfolioSupabaseSeeded: boolean | undefined;
}

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
  translations: Partial<Record<"es", LocalizedPortfolioSettingsContent>> | null | undefined
) {
  return {
    es: {
      ...getDefaultSpanishSettingsTranslation(),
      ...(translations?.es ?? {})
    }
  } satisfies Partial<Record<"es", LocalizedPortfolioSettingsContent>>;
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

function getSeedProjects(): Project[] {
  return seedProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    year: project.year,
    category: project.category,
    status: project.status,
    impact: project.impact,
    summary: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    client:
      project.slug === "shoppy-dashboard"
        ? "Admin dashboard concept"
        : project.slug === "tech-haven-ecommerce"
          ? "Tech Haven"
          : "Internal productivity tool",
    role:
      project.slug === "snippet-assistant"
        ? "Product builder + frontend engineer"
        : "Full-stack developer",
    duration: project.slug === "tech-haven-ecommerce" ? "End-to-end build" : "Product case study",
    coverImage:
      project.slug === "shoppy-dashboard"
        ? "/uploads/Portfolio-01.png"
        : project.slug === "tech-haven-ecommerce"
          ? "/uploads/portfolio-02.png"
          : "/uploads/portfolio-03.png",
    galleryImages:
      project.slug === "shoppy-dashboard"
        ? ["/uploads/shoppy-details.jpg"]
        : project.slug === "tech-haven-ecommerce"
          ? ["/uploads/ecommerce-details.jpg"]
          : ["/uploads/snippet-extension-details.png", "/uploads/snippet-extension-details2.png"],
    stack: project.stack,
    services: project.services,
    metrics: project.metrics,
    links: project.links,
    featured: project.featured,
    accent: project.accent,
    translations: getDefaultSpanishProjectTranslation(project.slug)
  }));
}

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!globalThis.__portfolioSupabase) {
    globalThis.__portfolioSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return globalThis.__portfolioSupabase;
}

function requireSupabase() {
  const client = getSupabaseAdmin();
  if (!client) {
    throw new Error(storageUnavailableMessage);
  }
  return client;
}

async function ensureSeeded() {
  const supabase = getSupabaseAdmin();
  if (!supabase || globalThis.__portfolioSupabaseSeeded) {
    return;
  }

  const { data: existingSettings, error: settingsError } = await supabase
    .from("portfolio_settings")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  if (settingsError) {
    throw new Error(settingsError.message);
  }

  if (!existingSettings) {
    const settingsPayload = serializeSettings(defaultSettings);
    const { error } = await supabase.from("portfolio_settings").insert({
      id: 1,
      ...settingsPayload
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const { count, error: countError } = await supabase
    .from("projects")
    .select("slug", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  if (!count) {
    const rows = getSeedProjects().map(serializeProject);
    const { error } = await supabase.from("projects").insert(rows);

    if (error) {
      throw new Error(error.message);
    }
  }

  globalThis.__portfolioSupabaseSeeded = true;
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
        href: normalizeHref(rest.join(":").trim())
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

function deserializeProject(row: ProjectRow): Project {
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
    galleryImages: row.gallery_images ?? [],
    stack: row.stack ?? [],
    services: row.services ?? [],
    metrics: row.metrics ?? [],
    links: row.links ?? [],
    featured: Boolean(row.featured),
    accent: row.accent,
    translations: row.translations ?? getDefaultSpanishProjectTranslation(row.slug)
  };
}

function deserializeSettings(row: SettingsRow): PortfolioSettings {
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
    focusAreas: row.focus_areas ?? [],
    stats: row.stats ?? [],
    translations: normalizeSettingsTranslations(row.translations)
  };
}

function serializeProject(project: Project) {
  return {
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    year: project.year,
    category: project.category,
    status: project.status,
    impact: project.impact,
    summary: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    client: project.client,
    role: project.role,
    duration: project.duration,
    cover_image: project.coverImage,
    gallery_images: project.galleryImages,
    stack: project.stack,
    services: project.services,
    metrics: project.metrics,
    links: project.links,
    featured: project.featured,
    accent: project.accent,
    translations: project.translations
  };
}

function serializeSettings(settings: PortfolioSettings) {
  return {
    name: settings.name,
    title: settings.title,
    intro: settings.intro,
    about: settings.about,
    email: settings.email,
    location: settings.location,
    availability: settings.availability,
    primary_cta_label: settings.primaryCtaLabel,
    primary_cta_href: settings.primaryCtaHref,
    secondary_cta_label: settings.secondaryCtaLabel,
    secondary_cta_href: settings.secondaryCtaHref,
    focus_areas: settings.focusAreas,
    stats: settings.stats,
    translations: normalizeSettingsTranslations(settings.translations)
  };
}

export function isPersistenceAvailable() {
  return isSupabaseConfigured();
}

function assertRequiredFields<T extends Record<string, unknown>>(
  input: T,
  fields: { key: keyof T; label: string; language?: "English" | "Spanish" }[]
) {
  const missing = fields
    .filter((field) => !String(input[field.key] ?? "").trim())
    .map((field) => (field.language ? `${field.language} ${field.label}` : field.label));

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}.`);
  }
}

export function parseProjectInput(payload: Record<string, unknown>): ProjectInput {
  const title = String(payload.title ?? "").trim();
  if (!title) {
    throw new Error("Title is required.");
  }
  const slug = toSlug(String(payload.slug ?? "").trim()) || toSlug(title);

  const input: ProjectInput = {
    originalSlug: String(payload.originalSlug ?? "").trim(),
    slug,
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

  assertRequiredFields(input, [
    { key: "title", label: "title", language: "English" },
    { key: "tagline", label: "tagline", language: "English" },
    { key: "category", label: "category", language: "English" },
    { key: "status", label: "status", language: "English" },
    { key: "client", label: "client", language: "English" },
    { key: "role", label: "role", language: "English" },
    { key: "duration", label: "duration", language: "English" },
    { key: "impact", label: "impact", language: "English" },
    { key: "summary", label: "summary", language: "English" },
    { key: "challenge", label: "challenge", language: "English" },
    { key: "solution", label: "solution", language: "English" },
    { key: "services", label: "services", language: "English" },
    { key: "metrics", label: "metrics", language: "English" },
    { key: "esTitle", label: "title", language: "Spanish" },
    { key: "esTagline", label: "tagline", language: "Spanish" },
    { key: "esCategory", label: "category", language: "Spanish" },
    { key: "esStatus", label: "status", language: "Spanish" },
    { key: "esClient", label: "client", language: "Spanish" },
    { key: "esRole", label: "role", language: "Spanish" },
    { key: "esDuration", label: "duration", language: "Spanish" },
    { key: "esImpact", label: "impact", language: "Spanish" },
    { key: "esSummary", label: "summary", language: "Spanish" },
    { key: "esChallenge", label: "challenge", language: "Spanish" },
    { key: "esSolution", label: "solution", language: "Spanish" },
    { key: "esServices", label: "services", language: "Spanish" },
    { key: "esMetrics", label: "metrics", language: "Spanish" }
  ]);

  return input;
}

export function parseSettingsInput(payload: Record<string, unknown>): PortfolioSettingsInput {
  const input: PortfolioSettingsInput = {
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
    esName: String(payload.esName ?? "").trim(),
    esTitle: String(payload.esTitle ?? "").trim(),
    esIntro: String(payload.esIntro ?? "").trim(),
    esAbout: String(payload.esAbout ?? "").trim(),
    esAvailability: String(payload.esAvailability ?? "").trim(),
    esPrimaryCtaLabel: String(payload.esPrimaryCtaLabel ?? "").trim(),
    esSecondaryCtaLabel: String(payload.esSecondaryCtaLabel ?? "").trim(),
    esFocusAreas: String(payload.esFocusAreas ?? ""),
    esStats: String(payload.esStats ?? "")
  };

  assertRequiredFields(input, [
    { key: "name", label: "name", language: "English" },
    { key: "title", label: "headline", language: "English" },
    { key: "intro", label: "intro", language: "English" },
    { key: "about", label: "about", language: "English" },
    { key: "availability", label: "availability", language: "English" },
    { key: "primaryCtaLabel", label: "primary CTA label", language: "English" },
    { key: "secondaryCtaLabel", label: "secondary CTA label", language: "English" },
    { key: "focusAreas", label: "focus areas", language: "English" },
    { key: "stats", label: "stats", language: "English" },
    { key: "esName", label: "name", language: "Spanish" },
    { key: "esTitle", label: "headline", language: "Spanish" },
    { key: "esIntro", label: "intro", language: "Spanish" },
    { key: "esAbout", label: "about", language: "Spanish" },
    { key: "esAvailability", label: "availability", language: "Spanish" },
    { key: "esPrimaryCtaLabel", label: "primary CTA label", language: "Spanish" },
    { key: "esSecondaryCtaLabel", label: "secondary CTA label", language: "Spanish" },
    { key: "esFocusAreas", label: "focus areas", language: "Spanish" },
    { key: "esStats", label: "stats", language: "Spanish" }
  ]);

  return input;
}

export async function getProjects() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return getSeedProjects();
  }

  try {
    await ensureSeeded();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false })
      .order("title", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as ProjectRow[]).map(deserializeProject);
  } catch {
    return getSeedProjects();
  }
}

export async function getFeaturedProjects() {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return getSeedProjects().find((project) => project.slug === slug);
  }

  try {
    await ensureSeeded();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? deserializeProject(data as ProjectRow) : undefined;
  } catch {
    return getSeedProjects().find((project) => project.slug === slug);
  }
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

  const supabase = requireSupabase();
  await ensureSeeded();

  const { error } = await supabase.from("projects").upsert(serializeProject(project), {
    onConflict: "slug"
  });

  if (error) {
    throw new Error(error.message);
  }

  if (input.originalSlug && input.originalSlug !== project.slug) {
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("slug", input.originalSlug);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  return project;
}

export async function deleteProject(slug: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("projects").delete().eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getPortfolioSettings() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return defaultSettings;
  }

  try {
    await ensureSeeded();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? deserializeSettings(data as SettingsRow) : defaultSettings;
  } catch {
    return defaultSettings;
  }
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

  const supabase = requireSupabase();
  await ensureSeeded();

  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      id: 1,
      ...serializeSettings(settings)
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }

  return settings;
}

export async function saveUploadedFile(fileName: string, buffer: Buffer, contentType?: string) {
  const supabase = requireSupabase();
  const objectPath = `uploads/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(objectPath, buffer, {
      contentType,
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function hasAdminSecretConfigured() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_config")
    .select("secret_hash")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean((data as AdminConfigRow | null)?.secret_hash);
}

export async function setAdminSecret(secret: string) {
  const normalized = secret.trim();
  if (normalized.length < 6) {
    throw new Error("Admin secret must be at least 6 characters.");
  }
  if (await hasAdminSecretConfigured()) {
    throw new Error("Admin secret is already configured.");
  }

  const supabase = requireSupabase();
  const { error } = await supabase.from("admin_config").upsert(
    {
      id: 1,
      secret_hash: hashSecret(normalized)
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyAdminSecret(secret: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_config")
    .select("secret_hash")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as AdminConfigRow | null;
  if (!row?.secret_hash) {
    return false;
  }

  return verifySecret(secret, row.secret_hash);
}

export async function createAdminSession() {
  const supabase = requireSupabase();
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 14;

  const { error } = await supabase.from("admin_sessions").insert({
    token_hash: hashToken(token),
    expires_at: new Date(expiresAt).toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  return { token, expiresAt };
}

export async function validateAdminSession(token: string) {
  if (!token) {
    return false;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_sessions")
    .select("token_hash, expires_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as AdminSessionRow | null;
  if (!row) {
    return false;
  }

  if (Date.parse(row.expires_at) < Date.now()) {
    await deleteAdminSession(token);
    return false;
  }

  return true;
}

export async function deleteAdminSession(token: string) {
  if (!token) {
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("admin_sessions")
    .delete()
    .eq("token_hash", hashToken(token));

  if (error) {
    throw new Error(error.message);
  }
}
