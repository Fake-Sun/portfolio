import type { Metadata } from "next";
import { LocaleProvider } from "@/components/locale-provider";
import { ServicesPageClient } from "@/components/services-page-client";
import { SiteChrome } from "@/components/site-chrome";
import { defaultLocale } from "@/lib/i18n";
import "./services.css";

export const metadata: Metadata = {
  title: "Freelance Development Services",
  description:
    "Fixed-scope JavaScript, React, Vue and Next.js bug fixes from $99, and REST API integrations from $199. Work directly with Lucas Monzón.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Freelance Development Services | Lucas Monzón",
    description: "Small development problems, solved with clear scope. JavaScript fixes and API integrations.",
    url: "https://lucasmonzon.dev/services"
  }
};

export default function ServicesPage() {
  return (
    <LocaleProvider initialLocale={defaultLocale}>
      <SiteChrome>
        <ServicesPageClient />
      </SiteChrome>
    </LocaleProvider>
  );
}
