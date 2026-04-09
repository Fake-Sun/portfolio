import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyProjectPage({ params }: LegacyProjectPageProps) {
  const { slug } = await params;
  redirect(`/${defaultLocale}/projects/${slug}` as never);
}
