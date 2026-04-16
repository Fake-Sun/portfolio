import { cookies } from "next/headers";

import { AdminAuth } from "@/components/admin-auth";
import { AdminPanel } from "@/components/admin-panel";
import { AdminStorageDisabled } from "@/components/admin-storage-disabled";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteChrome } from "@/components/site-chrome";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { defaultLocale } from "@/lib/i18n";
import {
  getPortfolioSettings,
  getProjects,
  hasAdminSecretConfigured,
  isPersistenceAvailable,
  validateAdminSession
} from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let content: React.ReactNode;

  if (!isPersistenceAvailable()) {
    content = <AdminStorageDisabled />;
  } else {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(adminSessionCookieName)?.value ?? "";
    const [hasAdminSecret, isAuthenticated] = await Promise.all([
      hasAdminSecretConfigured(),
      validateAdminSession(sessionToken)
    ]);

    if (!hasAdminSecret) {
      content = <AdminAuth mode="setup" />;
    } else if (!isAuthenticated) {
      content = <AdminAuth mode="login" />;
    } else {
      const [projects, settings] = await Promise.all([getProjects(), getPortfolioSettings()]);
      content = <AdminPanel projects={projects} settings={settings} />;
    }
  }

  return (
    <LocaleProvider initialLocale={defaultLocale}>
      <SiteChrome>{content}</SiteChrome>
    </LocaleProvider>
  );
}
