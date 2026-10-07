import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBuilder } from "@/components/PageBuilder";
import { getHomePage, getHomeSeo } from "@/sanity/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return {
    title: seo.title ?? undefined,
    description: seo.description ?? undefined,
    ...(seo.image && { openGraph: { images: [{ url: seo.image }] } }),
    ...(seo.noIndex && { robots: "noindex" }),
  };
}

export default async function HomePage() {
  const page = await getHomePage();
  if (!page) notFound();

  return (
    <>
      <PageBuilder blocks={page.pageBuilder} />
      {/* Closing band before the footer, as on jamb.co.uk. */}
      <div aria-hidden="true" className="h-20 w-full bg-[#f4f0ed]" />
    </>
  );
}
