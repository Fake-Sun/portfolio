"use client";

import { useResolvedLocale } from "@/components/locale-provider";
import { siteCopy } from "@/lib/i18n";

export function AdminStorageDisabled() {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];

  return (
    <section className="admin-auth-shell">
      <div className="section-heading">
        <span className="eyebrow">Portfolio CMS</span>
        <h1>{copy.adminTitle as string}</h1>
        <p>{copy.adminStorageDisabled as string}</p>
      </div>
    </section>
  );
}
