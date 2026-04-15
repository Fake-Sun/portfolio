"use client";

import { useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useState } from "react";

import { localizeProject, localizeSettings } from "@/lib/i18n";
import type { PortfolioSettings, Project } from "@/types/portfolio";

type AdminPanelProps = {
  projects: Project[];
  settings: PortfolioSettings;
  copy: Record<string, unknown>;
};

type ProjectFormState = {
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
  galleryImages: string;
  stack: string;
  services: string;
  metrics: string;
  links: string;
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
  esServices: string;
  esMetrics: string;
  esLinks: string;
  accent: string;
  featured: string;
};

const initialProjectForm: ProjectFormState = {
  slug: "",
  title: "",
  tagline: "",
  year: "2026",
  category: "CRM Platform",
  status: "Concept",
  impact: "",
  summary: "",
  challenge: "",
  solution: "",
  client: "",
  role: "",
  duration: "",
  coverImage: "",
  galleryImages: "",
  stack: "Next.js\nTypeScript",
  services: "Product strategy\nFrontend architecture\nUI system",
  metrics: "Users: 10",
  links: "Live demo: #",
  esTitle: "",
  esTagline: "",
  esCategory: "",
  esStatus: "",
  esImpact: "",
  esSummary: "",
  esChallenge: "",
  esSolution: "",
  esClient: "",
  esRole: "",
  esDuration: "",
  esServices: "",
  esMetrics: "",
  esLinks: "",
  accent: "",
  featured: "false"
};

function createProjectForm(overrides: Partial<ProjectFormState> = {}): ProjectFormState {
  return {
    ...initialProjectForm,
    ...Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [key, typeof value === "string" ? value : value ?? ""])
    )
  } as ProjectFormState;
}

function settingsToForm(settings: PortfolioSettings) {
  const spanishSettings = localizeSettings(settings, "es");

  return {
    name: settings.name,
    title: settings.title,
    intro: settings.intro,
    about: settings.about,
    email: settings.email,
    location: settings.location,
    availability: settings.availability,
    primaryCtaLabel: settings.primaryCtaLabel,
    primaryCtaHref: settings.primaryCtaHref,
    secondaryCtaLabel: settings.secondaryCtaLabel,
    secondaryCtaHref: settings.secondaryCtaHref,
    focusAreas: settings.focusAreas.join("\n"),
    stats: settings.stats.map((item) => `${item.label}: ${item.value}`).join("\n"),
    esName: spanishSettings.name,
    esTitle: spanishSettings.title,
    esIntro: spanishSettings.intro,
    esAbout: spanishSettings.about,
    esAvailability: spanishSettings.availability,
    esPrimaryCtaLabel: spanishSettings.primaryCtaLabel,
    esSecondaryCtaLabel: spanishSettings.secondaryCtaLabel,
    esFocusAreas: spanishSettings.focusAreas.join("\n"),
    esStats: spanishSettings.stats
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n")
  };
}

export function AdminPanel({
  projects,
  settings,
  copy
}: AdminPanelProps) {
  const router = useRouter();
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [settingsForm, setSettingsForm] = useState(settingsToForm(settings));
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "settings">("projects");
  const [contentLanguage, setContentLanguage] = useState<"en" | "es">("en");
  const filteredSearch = useDeferredValue(search);

  const filteredProjects = projects.filter((project) => {
    const query = filteredSearch.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.year.includes(query) ||
      project.client.toLowerCase().includes(query)
    );
  });

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(copy.adminSavingProject as string);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectForm)
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(payload.error ?? "Unable to save project.");
      return;
    }

    setStatus(copy.adminProjectSaved as string);
    setProjectForm(initialProjectForm);
    startTransition(() => router.refresh());
  }

  async function handleSettingsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(copy.adminSavingSettings as string);

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settingsForm)
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(payload.error ?? "Unable to save settings.");
      return;
    }

    setStatus(copy.adminSettingsSaved as string);
    startTransition(() => router.refresh());
  }

  async function handleDelete(slug: string) {
    setStatus(copy.adminDeletingProject as string);

    const response = await fetch(`/api/projects/${slug}`, {
      method: "DELETE"
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(payload.error ?? "Unable to delete project.");
      return;
    }

    setStatus("Project deleted.");
    startTransition(() => router.refresh());
  }

  async function uploadImage(file: File, target: "cover" | "gallery") {
    setStatus(
      target === "cover"
        ? (copy.adminUploadingCover as string)
        : (copy.adminUploadingGallery as string)
    );

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body
    });

    const payload = (await response.json()) as { error?: string; url?: string };

    if (!response.ok || !payload.url) {
      setStatus(payload.error ?? "Unable to upload image.");
      return;
    }

    if (target === "cover") {
      setProjectForm((current) => ({ ...current, coverImage: payload.url ?? "" }));
    } else {
      setProjectForm((current) => ({
        ...current,
        galleryImages: [current.galleryImages, payload.url].filter(Boolean).join("\n")
      }));
    }

    setStatus(copy.adminImageUploaded as string);
  }

  function loadProject(project: Project) {
    const spanishProject = localizeProject(project, "es");

    setProjectForm(createProjectForm({
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
      coverImage: project.coverImage,
      galleryImages: project.galleryImages.join("\n"),
      stack: project.stack.join("\n"),
      services: project.services.join("\n"),
      metrics: project.metrics.map((item) => `${item.label}: ${item.value}`).join("\n"),
      links: project.links.map((item) => `${item.label}: ${item.href}`).join("\n"),
      esTitle: spanishProject.title,
      esTagline: spanishProject.tagline,
      esCategory: spanishProject.category,
      esStatus: spanishProject.status,
      esImpact: spanishProject.impact,
      esSummary: spanishProject.summary,
      esChallenge: spanishProject.challenge,
      esSolution: spanishProject.solution,
      esClient: spanishProject.client,
      esRole: spanishProject.role,
      esDuration: spanishProject.duration,
      esServices: spanishProject.services.join("\n"),
      esMetrics: spanishProject.metrics
        .map((item) => `${item.label}: ${item.value}`)
        .join("\n"),
      esLinks: spanishProject.links
        .map((item) => `${item.label}: ${item.href}`)
        .join("\n"),
      accent: project.accent,
      featured: String(project.featured)
    }));
    setActiveTab("projects");
    setContentLanguage("en");
    setStatus(`${copy.adminProjectLoaded as string} "${project.title}".`);
  }

  function startNewProject() {
    setProjectForm(createProjectForm());
    setActiveTab("projects");
    setContentLanguage("en");
    setStatus(copy.adminNewProjectReady as string);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    startTransition(() => router.refresh());
  }

  return (
    <div className="admin-layout">
      <section className="admin-editor">
        <div className="section-heading">
          <span className="eyebrow">Portfolio CMS</span>
          <h1>{copy.adminTitle as string}</h1>
          <p>{copy.adminIntro as string}</p>
        </div>

        <div className="admin-tabs">
          <button
            type="button"
            className={activeTab === "projects" ? "is-active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            {copy.projectsTab as string}
          </button>
          <button
            type="button"
            className={activeTab === "settings" ? "is-active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            {copy.settingsTab as string}
          </button>
          <button type="button" onClick={handleLogout}>
            {copy.adminLogoutButton as string}
          </button>
        </div>

        <div className="admin-language-toggle">
          <span>{copy.adminEditingLanguage as string}</span>
          <div>
            <button
              type="button"
              className={contentLanguage === "en" ? "is-active" : ""}
              onClick={() => setContentLanguage("en")}
            >
              {copy.adminLanguageEnglish as string}
            </button>
            <button
              type="button"
              className={contentLanguage === "es" ? "is-active" : ""}
              onClick={() => setContentLanguage("es")}
            >
              {copy.adminLanguageSpanish as string}
            </button>
          </div>
        </div>

        {activeTab === "projects" ? (
          <form className="admin-form" onSubmit={handleProjectSubmit}>
            <div className="admin-form-toolbar full-span">
              <div>
                <span>{copy.adminProjectEditorLabel as string}</span>
                <h3>{projectForm.slug || (copy.adminNewProjectDraft as string)}</h3>
              </div>
              <button type="button" onClick={startNewProject}>
                {copy.adminNewProject as string}
              </button>
            </div>
            <div className="admin-form-section">
              <h3>{copy.adminSharedFields as string}</h3>
            </div>
            <label>
              <span>{copy.adminSlug as string}</span>
              <input
                value={projectForm.slug}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, slug: event.target.value }))
                }
              />
            </label>
            <label>
              <span>{copy.adminYear as string}</span>
              <input
                value={projectForm.year}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, year: event.target.value }))
                }
              />
            </label>
            <label>
              <span>{copy.adminFeatured as string}</span>
              <select
                value={projectForm.featured}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, featured: event.target.value }))
                }
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            </label>
            <label className="full-span">
              <span>{copy.adminCoverImage as string}</span>
              <input
                value={projectForm.coverImage}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, coverImage: event.target.value }))
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadImage(file, "cover");
                  }
                }}
              />
            </label>
            <label className="full-span">
              <span>{copy.adminGalleryImages as string}</span>
              <textarea
                rows={4}
                placeholder={copy.adminGalleryHelp as string}
                value={projectForm.galleryImages}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, galleryImages: event.target.value }))
                }
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  for (const file of files) {
                    void uploadImage(file, "gallery");
                  }
                }}
              />
            </label>
            <label>
              <span>{copy.adminStack as string}</span>
              <textarea
                rows={5}
                value={projectForm.stack}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, stack: event.target.value }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminAccent as string}</span>
              <textarea
                rows={3}
                value={projectForm.accent}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, accent: event.target.value }))
                }
              />
            </label>
            <div className="admin-form-section full-span">
              <h3>
                {contentLanguage === "en"
                  ? (copy.adminLanguageEnglish as string)
                  : (copy.adminLanguageSpanish as string)}
              </h3>
            </div>
            <label>
              <span>{copy.adminTitleLabel as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.title : projectForm.esTitle}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "title" : "esTitle"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminTagline as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.tagline : projectForm.esTagline}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "tagline" : "esTagline"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminCategory as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.category : projectForm.esCategory}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "category" : "esCategory"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminStatusLabel as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.status : projectForm.esStatus}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "status" : "esStatus"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminClient as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.client : projectForm.esClient}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "client" : "esClient"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminRoleLabel as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.role : projectForm.esRole}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "role" : "esRole"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminDurationLabel as string}</span>
              <input
                value={contentLanguage === "en" ? projectForm.duration : projectForm.esDuration}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "duration" : "esDuration"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminImpact as string}</span>
              <textarea
                rows={3}
                value={contentLanguage === "en" ? projectForm.impact : projectForm.esImpact}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "impact" : "esImpact"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminSummary as string}</span>
              <textarea
                rows={4}
                value={contentLanguage === "en" ? projectForm.summary : projectForm.esSummary}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "summary" : "esSummary"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminChallenge as string}</span>
              <textarea
                rows={4}
                value={contentLanguage === "en" ? projectForm.challenge : projectForm.esChallenge}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "challenge" : "esChallenge"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminSolution as string}</span>
              <textarea
                rows={4}
                value={contentLanguage === "en" ? projectForm.solution : projectForm.esSolution}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "solution" : "esSolution"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminServicesField as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? projectForm.services : projectForm.esServices}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "services" : "esServices"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminMetricsField as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? projectForm.metrics : projectForm.esMetrics}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "metrics" : "esMetrics"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminLinksField as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? projectForm.links : projectForm.esLinks}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "links" : "esLinks"]: event.target.value
                  }))
                }
              />
            </label>
            <div className="admin-actions">
              <button type="submit">{copy.adminSaveProject as string}</button>
              <button type="button" onClick={startNewProject}>
                {copy.adminResetForm as string}
              </button>
              <span>{status}</span>
            </div>
          </form>
        ) : (
          <form className="admin-form" onSubmit={handleSettingsSubmit}>
            <div className="admin-form-section">
              <h3>{copy.adminSharedFields as string}</h3>
            </div>
            <label>
              <span>{copy.adminEmail as string}</span>
              <input
                value={settingsForm.email}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label>
              <span>{copy.adminLocation as string}</span>
              <input
                value={settingsForm.location}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, location: event.target.value }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminPrimaryCtaHref as string}</span>
              <input
                value={settingsForm.primaryCtaHref}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    primaryCtaHref: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminSecondaryCtaHref as string}</span>
              <input
                value={settingsForm.secondaryCtaHref}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    secondaryCtaHref: event.target.value
                  }))
                }
              />
            </label>
            <div className="admin-form-section full-span">
              <h3>
                {contentLanguage === "en"
                  ? (copy.adminLanguageEnglish as string)
                  : (copy.adminLanguageSpanish as string)}
              </h3>
            </div>
            <label>
              <span>{copy.adminName as string}</span>
              <input
                value={contentLanguage === "en" ? settingsForm.name : settingsForm.esName}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "name" : "esName"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminHeadline as string}</span>
              <input
                value={contentLanguage === "en" ? settingsForm.title : settingsForm.esTitle}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "title" : "esTitle"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminIntroLabel as string}</span>
              <textarea
                rows={4}
                value={contentLanguage === "en" ? settingsForm.intro : settingsForm.esIntro}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "intro" : "esIntro"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminAboutLabel as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? settingsForm.about : settingsForm.esAbout}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "about" : "esAbout"]: event.target.value
                  }))
                }
              />
            </label>
            <label className="full-span">
              <span>{copy.adminAvailabilityLabel as string}</span>
              <input
                value={contentLanguage === "en" ? settingsForm.availability : settingsForm.esAvailability}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "availability" : "esAvailability"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminPrimaryCtaLabel as string}</span>
              <input
                value={contentLanguage === "en" ? settingsForm.primaryCtaLabel : settingsForm.esPrimaryCtaLabel}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "primaryCtaLabel" : "esPrimaryCtaLabel"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminSecondaryCtaLabel as string}</span>
              <input
                value={contentLanguage === "en" ? settingsForm.secondaryCtaLabel : settingsForm.esSecondaryCtaLabel}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "secondaryCtaLabel" : "esSecondaryCtaLabel"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminFocusAreasField as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? settingsForm.focusAreas : settingsForm.esFocusAreas}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "focusAreas" : "esFocusAreas"]: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span>{copy.adminStatsField as string}</span>
              <textarea
                rows={5}
                value={contentLanguage === "en" ? settingsForm.stats : settingsForm.esStats}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    [contentLanguage === "en" ? "stats" : "esStats"]: event.target.value
                  }))
                }
              />
            </label>
            <div className="admin-actions">
              <button type="submit">{copy.adminSaveSettings as string}</button>
              <span>{status}</span>
            </div>
          </form>
        )}
      </section>

      <section className="admin-list">
        <div className="section-heading">
          <span className="eyebrow">Project index</span>
          <h2>{copy.currentEntries as string}</h2>
          <p>{copy.adminProjectHelp as string}</p>
        </div>

        <input
          className="admin-search"
          placeholder={copy.filterProjects as string}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="admin-projects">
          {filteredProjects.map((project) => (
            <article key={project.slug} className="admin-project-card">
              <div>
                <p>
                  {project.year} / {project.category}
                </p>
                <h3>{project.title}</h3>
                <span>{project.client || "Independent project"}</span>
              </div>
              <div className="admin-project-actions">
                <button type="button" className="admin-btn" onClick={() => loadProject(project)}>
                  {copy.edit as string}
                </button>
                <button type="button" className="admin-btn" onClick={() => handleDelete(project.slug)}>
                  {copy.delete as string}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
