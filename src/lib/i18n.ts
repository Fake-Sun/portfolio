import type { PortfolioSettings, Project } from "@/types/portfolio";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookieName = "portfolio_locale";

const projectSlugMap: Record<string, { en: string; es: string }> = {
  "shoppy-dashboard": {
    en: "shoppy-dashboard",
    es: "panel-shoppy"
  },
  "tech-haven-ecommerce": {
    en: "tech-haven-ecommerce",
    es: "tech-haven-ecommerce"
  },
  "snippet-assistant": {
    en: "snippet-assistant",
    es: "asistente-snippets"
  }
};

const spanishProjectContent: Record<
  string,
  Partial<Project> & {
    metrics?: { label: string; value: string }[];
    links?: { label: string; href: string }[];
  }
> = {
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

export const siteCopy = {
  en: {
    navWork: "Work",
    navAdmin: "Admin",
    heroEyebrow: "Portfolio / Software engineer",
    basedIn: "Based in",
    contact: "Contact",
    availability: "Availability",
    snapshot: "Profile",
    snapshotText:
      "Software engineer shaped by troubleshooting, customer support, and practical delivery.",
    snapshotPoints: [
      "Built from software work, support pressure, and technical troubleshooting.",
      "Comfortable across product work, admin tools, hosting, and deployment context."
    ],
    snapshotHighlights: [
      "Customer support and L2 escalation handling",
      "Hosting, deployment, DNS, SSL, and infrastructure context",
      "Web applications, admin tools, and technical problem solving"
    ],
    highlights: [
      "Web applications and internal tools",
      "L2 / supervisor support experience",
      "Hosting and deployment context"
    ],
    about: "About",
    aboutText:
      "Grounded in software delivery, support workflows, and real operational problem solving.",
    focusAreas: "Focus areas",
    whoIAm: "Who I am",
    whoIAmTitle: "Software engineering with real support and operations experience",
    whoIAmText:
      "My experience is not limited to building interfaces. It also includes customer support, advanced issue handling, documentation, hosting, infrastructure, and the kind of technical follow-through that matters once software is already in use.",
    whatIDo: "What I do",
    howIWork: "How I work",
    services: [
      {
        title: "Web Applications and Admin Tools",
        description: "User-facing products, dashboards, and internal tools built with a strong focus on maintainability."
      },
      {
        title: "Troubleshooting and Optimization",
        description: "Debugging, issue isolation, cleanup, and performance-minded improvements across the stack."
      },
      {
        title: "Hosting, Deployment, and IT Context",
        description: "Technical work informed by AWS, Docker, DNS, SSL, system administration, and support reality."
      }
    ],
    howIContribute: "Where I bring value",
    skillCloud: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "Java",
      "MySQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Windows / Linux",
      "Git / GitHub",
      "DNS / SSL"
    ],
    myWork: "My work",
    selectedWork: "Selected work",
    viewProject: "View project",
    backToPortfolio: "Back to portfolio",
    projectSummary: "Project summary",
    theChallenge: "The challenge",
    theSolution: "The solution",
    context: "Context",
    client: "Client",
    role: "Role",
    duration: "Duration",
    confidential: "Confidential",
    frontendEngineering: "Frontend engineering",
    notSpecified: "Not specified",
    stack: "Stack",
    servicesLabel: "Services",
    metrics: "Metrics",
    relevantLinks: "Relevant links",
    footerGithub: "GitHub",
    footerLinkedIn: "LinkedIn",
    adminTitle: "Content control room",
    adminIntro:
      "Update your profile, manage projects, and upload images without editing code.",
    adminStorageDisabled:
      "Admin editing is not configured for this deployment yet. Add the Supabase environment variables and schema to enable the live CMS.",
    adminSecret: "Admin secret",
    adminSecretPlaceholder: "Required to save, delete, or upload",
    adminSetupText:
      "No admin secret is configured yet. Create one here to lock editing behind a password.",
    adminLoginText: "Sign in to access the admin panel.",
    createAdminSecret: "Create admin secret",
    confirmAdminSecret: "Confirm admin secret",
    setAdminSecret: "Set admin secret",
    adminLoginButton: "Sign in",
    adminLogoutButton: "Log out",
    projectsTab: "Projects",
    settingsTab: "Profile settings",
    projectIndex: "Project index",
    currentEntries: "Current entries",
    adminProjectHelp:
      "Click any project to load it into the editor. Search covers title, year, category, and client.",
    filterProjects: "Filter projects",
    edit: "Edit",
    delete: "Delete"
    ,
    adminSavingProject: "Saving project...",
    adminProjectSaved: "Project saved.",
    adminSavingSettings: "Saving profile settings...",
    adminSettingsSaved: "Profile settings saved.",
    adminDeletingProject: "Deleting project...",
    adminUploadingCover: "Uploading cover image...",
    adminUploadingGallery: "Uploading gallery image...",
    adminImageUploaded: "Image uploaded.",
    adminProjectLoaded: "Loaded project into the editor.",
    adminNewProjectReady: "Ready for a new project.",
    adminProjectEditorLabel: "Project editor",
    adminNewProjectDraft: "New project draft",
    adminNewProject: "Add new project",
    adminLanguageEnglish: "English",
    adminLanguageSpanish: "Español",
    adminEditingLanguage: "Editing language",
    adminSharedFields: "Shared fields",
    adminSlug: "Slug",
    adminTitleLabel: "Title",
    adminTagline: "Tagline",
    adminYear: "Year",
    adminCategory: "Category",
    adminStatusLabel: "Status",
    adminClient: "Client",
    adminRoleLabel: "Role",
    adminDurationLabel: "Duration",
    adminFeatured: "Featured",
    adminImpact: "Impact",
    adminSummary: "Summary",
    adminChallenge: "Challenge",
    adminSolution: "Solution",
    adminCoverImage: "Cover image URL",
    adminGalleryImages: "Gallery images",
    adminGalleryHelp: "One image URL per line",
    adminStack: "Stack",
    adminServicesField: "Services",
    adminMetricsField: "Metrics",
    adminLinksField: "Links",
    adminAccent: "Accent gradient",
    adminSaveProject: "Save project",
    adminResetForm: "Reset form",
    adminName: "Name",
    adminHeadline: "Headline",
    adminIntroLabel: "Intro",
    adminAboutLabel: "About",
    adminEmail: "Email",
    adminLocation: "Location",
    adminAvailabilityLabel: "Availability",
    adminPrimaryCtaLabel: "Primary CTA label",
    adminPrimaryCtaHref: "Primary CTA href",
    adminSecondaryCtaLabel: "Secondary CTA label",
    adminSecondaryCtaHref: "Secondary CTA href",
    adminFocusAreasField: "Focus areas",
    adminStatsField: "Stats",
    adminSaveSettings: "Save profile settings"
  },
  es: {
    navWork: "Proyectos",
    navAdmin: "Admin",
    heroEyebrow: "Portfolio / Ingeniero de software",
    basedIn: "Ubicado en",
    contact: "Contacto",
    availability: "Disponibilidad",
    snapshot: "Perfil",
    snapshotText:
      "Ingeniero de software con base real en troubleshooting, soporte al cliente y ejecución práctica.",
    snapshotPoints: [
      "Formado entre software, presión de soporte y resolución técnica de problemas.",
      "Cómodo entre producto, herramientas administrativas, hosting y despliegue."
    ],
    snapshotHighlights: [
      "Atención al cliente y manejo de escalaciones L2",
      "Hosting, despliegue, DNS, SSL y contexto de infraestructura",
      "Aplicaciones web, herramientas administrativas y resolución técnica"
    ],
    highlights: [
      "Aplicaciones web y herramientas internas",
      "Experiencia en soporte L2 / supervisor",
      "Contexto de hosting y despliegue"
    ],
    about: "Sobre mí",
    aboutText:
      "Apoyado en entrega de software, flujos de soporte y resolución operativa de problemas reales.",
    focusAreas: "Áreas de enfoque",
    whoIAm: "Quién soy",
    whoIAmTitle: "Ingeniería de software con experiencia real en soporte y operaciones",
    whoIAmText:
      "Mi experiencia no se limita a construir interfaces. También incluye atención al cliente, manejo de casos complejos, documentación, hosting, infraestructura y el tipo de seguimiento técnico que importa cuando el software ya está en uso.",
    whatIDo: "Qué hago",
    howIWork: "Cómo trabajo",
    services: [
      {
        title: "Aplicaciones web y herramientas administrativas",
        description: "Productos, dashboards y herramientas internas construidas con foco fuerte en mantenimiento."
      },
      {
        title: "Troubleshooting y optimización",
        description: "Debugging, aislamiento de problemas, cleanup y mejoras con foco en confiabilidad."
      },
      {
        title: "Hosting, despliegue y contexto IT",
        description: "Trabajo técnico informado por AWS, Docker, DNS, SSL, administración de sistemas y soporte real."
      }
    ],
    howIContribute: "Dónde aporto valor",
    skillCloud: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "Java",
      "MySQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Windows / Linux",
      "Git / GitHub",
      "DNS / SSL"
    ],
    myWork: "Mi trabajo",
    selectedWork: "Proyectos seleccionados",
    viewProject: "Ver proyecto",
    backToPortfolio: "Volver al portfolio",
    projectSummary: "Resumen del proyecto",
    theChallenge: "El desafío",
    theSolution: "La solución",
    context: "Contexto",
    client: "Cliente",
    role: "Rol",
    duration: "Duración",
    confidential: "Confidencial",
    frontendEngineering: "Ingeniería frontend",
    notSpecified: "No especificado",
    stack: "Stack",
    servicesLabel: "Servicios",
    metrics: "Métricas",
    relevantLinks: "Links relevantes",
    footerGithub: "GitHub",
    footerLinkedIn: "LinkedIn",
    adminTitle: "Panel de contenido",
    adminIntro:
      "Actualizá tu perfil, gestioná proyectos y subí imágenes sin editar código.",
    adminStorageDisabled:
      "La edición admin todavía no está configurada para este despliegue. Agregá las variables de entorno y el schema de Supabase para habilitar el CMS en producción.",
    adminSecret: "Clave admin",
    adminSecretPlaceholder: "Requerida para guardar, borrar o subir",
    adminSetupText:
      "Todavía no hay una clave de admin configurada. Creala acá para proteger la edición con contraseña.",
    adminLoginText: "Iniciá sesión para acceder al panel de admin.",
    createAdminSecret: "Crear clave admin",
    confirmAdminSecret: "Confirmar clave admin",
    setAdminSecret: "Guardar clave admin",
    adminLoginButton: "Ingresar",
    adminLogoutButton: "Cerrar sesión",
    projectsTab: "Proyectos",
    settingsTab: "Perfil",
    projectIndex: "Índice de proyectos",
    currentEntries: "Entradas actuales",
    adminProjectHelp:
      "Hacé click en un proyecto para cargarlo en el editor. La búsqueda cubre título, año, categoría y cliente.",
    filterProjects: "Filtrar proyectos",
    edit: "Editar",
    delete: "Borrar",
    adminSavingProject: "Guardando proyecto...",
    adminProjectSaved: "Proyecto guardado.",
    adminSavingSettings: "Guardando perfil...",
    adminSettingsSaved: "Perfil guardado.",
    adminDeletingProject: "Borrando proyecto...",
    adminUploadingCover: "Subiendo imagen de portada...",
    adminUploadingGallery: "Subiendo imagen de galería...",
    adminImageUploaded: "Imagen subida.",
    adminProjectLoaded: "Proyecto cargado en el editor.",
    adminNewProjectReady: "Listo para cargar un proyecto nuevo.",
    adminProjectEditorLabel: "Editor de proyecto",
    adminNewProjectDraft: "Borrador de proyecto nuevo",
    adminNewProject: "Agregar proyecto nuevo",
    adminLanguageEnglish: "English",
    adminLanguageSpanish: "Español",
    adminEditingLanguage: "Idioma de edición",
    adminSharedFields: "Campos compartidos",
    adminSlug: "Slug",
    adminTitleLabel: "Título",
    adminTagline: "Tagline",
    adminYear: "Año",
    adminCategory: "Categoría",
    adminStatusLabel: "Estado",
    adminClient: "Cliente",
    adminRoleLabel: "Rol",
    adminDurationLabel: "Duración",
    adminFeatured: "Destacado",
    adminImpact: "Impacto",
    adminSummary: "Resumen",
    adminChallenge: "Desafío",
    adminSolution: "Solución",
    adminCoverImage: "URL de imagen de portada",
    adminGalleryImages: "Imágenes de galería",
    adminGalleryHelp: "Una URL de imagen por línea",
    adminStack: "Stack",
    adminServicesField: "Servicios",
    adminMetricsField: "Métricas",
    adminLinksField: "Links",
    adminAccent: "Gradiente de acento",
    adminSaveProject: "Guardar proyecto",
    adminResetForm: "Restablecer formulario",
    adminName: "Nombre",
    adminHeadline: "Subtítulo",
    adminIntroLabel: "Intro",
    adminAboutLabel: "Sobre mí",
    adminEmail: "Email",
    adminLocation: "Ubicación",
    adminAvailabilityLabel: "Disponibilidad",
    adminPrimaryCtaLabel: "Texto CTA principal",
    adminPrimaryCtaHref: "Href CTA principal",
    adminSecondaryCtaLabel: "Texto CTA secundaria",
    adminSecondaryCtaHref: "Href CTA secundaria",
    adminFocusAreasField: "Áreas de enfoque",
    adminStatsField: "Stats",
    adminSaveSettings: "Guardar perfil"
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedProjectSlug(canonicalSlug: string, locale: Locale) {
  return projectSlugMap[canonicalSlug]?.[locale] ?? canonicalSlug;
}

export function getCanonicalProjectSlug(localizedSlug: string) {
  const match = Object.entries(projectSlugMap).find(([, localized]) =>
    Object.values(localized).includes(localizedSlug)
  );

  return match?.[0] ?? localizedSlug;
}

export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === "en") {
    return {
      ...project,
      slug: getLocalizedProjectSlug(project.slug, locale)
    };
  }

  const overrides = project.translations.es ?? spanishProjectContent[project.slug];

  return {
    ...project,
    ...overrides,
    slug: getLocalizedProjectSlug(project.slug, locale)
  };
}

export function localizeSettings(settings: PortfolioSettings, locale: Locale): PortfolioSettings {
  if (locale === "en") {
    return settings;
  }

  const translation = settings.translations.es;

  return {
    ...settings,
    name: translation?.name || settings.name,
    title: translation?.title || settings.title,
    intro: translation?.intro || settings.intro,
    about: translation?.about || settings.about,
    availability: translation?.availability || settings.availability,
    primaryCtaLabel: translation?.primaryCtaLabel || settings.primaryCtaLabel,
    secondaryCtaLabel: translation?.secondaryCtaLabel || settings.secondaryCtaLabel,
    focusAreas: translation?.focusAreas || settings.focusAreas,
    stats: translation?.stats || settings.stats
  };
}

export function getLocalizedPath(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  const [, ...rest] = isLocale(segments[0]) ? segments : [defaultLocale, ...segments];

  if (rest[0] === "projects" && rest[1]) {
    const canonicalSlug = getCanonicalProjectSlug(rest[1]);
    return `/${targetLocale}/projects/${getLocalizedProjectSlug(canonicalSlug, targetLocale)}`;
  }

  return `/${targetLocale}/${rest.join("/")}`.replace(/\/$/, "");
}
