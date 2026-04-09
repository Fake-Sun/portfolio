import { cookies } from "next/headers";

import { AdminAuth } from "@/components/admin-auth";
import { AdminPanel } from "@/components/admin-panel";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { isLocale, siteCopy, type Locale } from "@/lib/i18n";
import {
  getPortfolioSettings,
  getProjects,
  hasAdminSecretConfigured,
  validateAdminSession
} from "@/lib/portfolio";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const copy = siteCopy[locale];
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value ?? "";
  const [hasAdminSecret, isAuthenticated] = await Promise.all([
    hasAdminSecretConfigured(),
    validateAdminSession(sessionToken)
  ]);

  if (!hasAdminSecret) {
    return <AdminAuth mode="setup" copy={copy} />;
  }

  if (!isAuthenticated) {
    return <AdminAuth mode="login" copy={copy} />;
  }

  const [projects, settings] = await Promise.all([getProjects(), getPortfolioSettings()]);

  return (
    <AdminPanel
      projects={projects}
      settings={settings}
      copy={copy}
    />
  );
}
