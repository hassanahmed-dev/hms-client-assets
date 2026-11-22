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
  return {
    title: `${b.name} | ${b.tagline}`,
    description: b.hero.sub,
    icons: { icon: b.logo },
    robots: { index: false, follow: false },
    openGraph: { title: `${b.name} | ${b.tagline}`, description: b.hero.sub, images: b.photos[0] ? [b.photos[0]] : [] },
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
