import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/index.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/playfair-display/latin-800.css";
import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import { buildBrand } from "@/brands";
import { ch } from "@/lib/hex";
import { heroIds, heroSet, img, SZ } from "@/lib/photos";
import "./globals.css";


const brand = async () => buildBrand();

export async function generateMetadata(): Promise<Metadata> {
  const b = await brand();
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const title = `${b.name} | ${b.tagline}`;
  // A logo card for link previews (WhatsApp, Instagram DMs), unless the cafe has its own photo.
  const share = b.photos[0] || `/${b.slug}/og.jpg`;
  return {
    metadataBase: host ? new URL(`https://${host}`) : undefined,
    title,
    description: b.hero.sub,
    icons: {
      icon: [
        { url: `/${b.slug}/favicon-32.png`, sizes: "32x32", type: "image/png" },
        { url: `/${b.slug}/icon-192.png`, sizes: "192x192", type: "image/png" },
      ],
      apple: { url: `/${b.slug}/apple-touch-icon.png`, sizes: "180x180" },
    },
    robots: { index: false, follow: false },
    openGraph: { title, description: b.hero.sub, siteName: b.name, type: "website", images: [b.photos[0] ? { url: share, alt: b.name } : { url: share, width: 1200, height: 630, alt: b.name }] },
    twitter: { card: "summary_large_image", title, description: b.hero.sub, images: [share] },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const b = await brand();
  return { themeColor: b.theme.background };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const b = await brand();
  const vars = Object.entries(b.theme).map(([k, v]) => `--c-${k}:${ch(v)};`).join("");
  const display = b.font === "bebas" ? "'Bebas Neue'" : b.font === "cormorant" ? "'Cormorant Garamond'" : "'Playfair Display'";
  return (
    <html lang="en" data-brand={b.slug}>
      <head>
        <link rel="preload" as="image" href={img(heroIds(b.slug)[0], SZ.hero[0])} imageSrcSet={heroSet(heroIds(b.slug)[0])} imageSizes="100vw" fetchPriority="high" />
        <style dangerouslySetInnerHTML={{ __html: `:root{${vars}--font-display:${display};--font-body:'Inter Variable';}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
