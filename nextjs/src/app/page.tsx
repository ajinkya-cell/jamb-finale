import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBuilder } from "@/components/PageBuilder";
import { getHomePage, getHomeSeo } from "@/sanity/fetch";
import type { DynamicFetchOptions } from "@/sanity/live";
import { WithFetchOptions } from "@/sanity/WithFetchOptions";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return {
    title: seo.title ?? undefined,
    description: seo.description ?? undefined,
    ...(seo.image && { openGraph: { images: [{ url: seo.image }] } }),
    ...(seo.noIndex && { robots: "noindex" }),
  };
}

export default function HomePage() {
  return <WithFetchOptions>{(options) => <Home options={options} />}</WithFetchOptions>;
}

async function Home({ options }: { options: DynamicFetchOptions }) {
  const page = await getHomePage(options);
  if (!page) notFound();

  return (
    <>
      <PageBuilder blocks={page.pageBuilder} />
      {/* Closing band before the footer, as on jamb.co.uk. */}
      <div aria-hidden="true" className="h-20 w-full bg-[#f4f0ed]" />
    </>
  );
}
