import { isLocale } from "@/lib/i18n";
import { notFound, redirect } from "next/navigation";

type AdminPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  redirect("/admin");
}
