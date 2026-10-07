import type { Metadata } from "next";
import { draftMode } from "next/headers";
import localFont from "next/font/local";
import { VisualEditing } from "next-sanity/visual-editing";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { ExitPreview } from "@/components/preview/ExitPreview";
import { SanityLive } from "@/sanity/live";
import "./globals.css";

// Galaxie Copernicus Book, the typeface used across jamb.co.uk.
const copernicus = localFont({
  src: "../../public/font.ttf",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-primary",
  fallback: ["Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Jamb",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={copernicus.variable}>
      <body className="font-serif antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="md:min-h-screen">
          {children}
        </main>
        <Footer />
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && (
          <>
            <VisualEditing />
            <ExitPreview />
          </>
        )}
      </body>
    </html>
  );
}
