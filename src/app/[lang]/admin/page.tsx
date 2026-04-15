import { cookies } from "next/headers";

import { AdminAuth } from "@/components/admin-auth";
import { AdminPanel } from "@/components/admin-panel";
import { AdminStorageDisabled } from "@/components/admin-storage-disabled";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { isLocale } from "@/lib/i18n";
import {
  getPortfolioSettings,
  getProjects,
  hasAdminSecretConfigured,
  isPersistenceAvailable,
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

  if (!isPersistenceAvailable()) {
    return <AdminStorageDisabled />;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value ?? "";
  const [hasAdminSecret, isAuthenticated] = await Promise.all([
    hasAdminSecretConfigured(),
    validateAdminSession(sessionToken)
  ]);

  if (!hasAdminSecret) {
    return <AdminAuth mode="setup" />;
  }

  if (!isAuthenticated) {
    return <AdminAuth mode="login" />;
  }

  const [projects, settings] = await Promise.all([getProjects(), getPortfolioSettings()]);

  return <AdminPanel projects={projects} settings={settings} />;
}
