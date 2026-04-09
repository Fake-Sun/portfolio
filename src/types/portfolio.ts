export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type LocalizedProjectContent = {
  title: string;
  tagline: string;
  category: string;
  status: string;
  impact: string;
  summary: string;
  challenge: string;
  solution: string;
  client: string;
  role: string;
  duration: string;
  services: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
};

export type Project = {
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
  coverImage: string;
  galleryImages: string[];
  stack: string[];
  services: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  featured: boolean;
  accent: string;
  translations: Partial<Record<"es", LocalizedProjectContent>>;
};

export type ProjectInput = Omit<Project, "galleryImages" | "stack" | "services" | "metrics" | "links" | "translations"> & {
  galleryImages: string[] | string;
  stack: string[] | string;
  services: string[] | string;
  metrics: ProjectMetric[] | string;
  links: ProjectLink[] | string;
  esTitle: string;
  esTagline: string;
  esCategory: string;
  esStatus: string;
  esImpact: string;
  esSummary: string;
  esChallenge: string;
  esSolution: string;
  esClient: string;
  esRole: string;
  esDuration: string;
  esServices: string[] | string;
  esMetrics: ProjectMetric[] | string;
  esLinks: ProjectLink[] | string;
};

export type PortfolioStat = {
  label: string;
  value: string;
};

export type LocalizedPortfolioSettingsContent = {
  name: string;
  title: string;
  intro: string;
  about: string;
  availability: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  focusAreas: string[];
  stats: PortfolioStat[];
};

export type PortfolioSettings = {
  name: string;
  title: string;
  intro: string;
  about: string;
  email: string;
  location: string;
  availability: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  focusAreas: string[];
  stats: PortfolioStat[];
  translations: Partial<Record<"es", LocalizedPortfolioSettingsContent>>;
};

export type PortfolioSettingsInput = Omit<PortfolioSettings, "focusAreas" | "stats" | "translations"> & {
  focusAreas: string[] | string;
  stats: PortfolioStat[] | string;
  esName: string;
  esTitle: string;
  esIntro: string;
  esAbout: string;
  esAvailability: string;
  esPrimaryCtaLabel: string;
  esSecondaryCtaLabel: string;
  esFocusAreas: string[] | string;
  esStats: PortfolioStat[] | string;
};
