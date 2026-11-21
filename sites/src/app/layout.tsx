import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Playfair_Display, Bebas_Neue, Cormorant_Garamond } from "next/font/google";
import { brandFromHost } from "@/brands";
import { ch } from "@/lib/hex";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--f-playfair", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--f-bebas", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--f-cormorant", display: "swap" });

async function brand() {
  const h = await headers();
  return brandFromHost(h.get("x-forwarded-host") || h.get("host"));
}

export async function generateMetadata(): Promise<Metadata> {
  const b = await brand();
  return {
    title: `${b.name} | ${b.tagline}`,
    description: b.hero.sub,
    icons: { icon: b.logo },
    robots: { index: false, follow: false },
    openGraph: { title: `${b.name} | ${b.tagline}`, description: b.hero.sub, images: [b.photos[0]] },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const b = await brand();
  return { themeColor: b.theme.background };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const b = await brand();
  const vars = Object.entries(b.theme).map(([k, v]) => `--c-${k}:${ch(v)};`).join("");
  const display = b.font === "bebas" ? "var(--f-bebas)" : b.font === "cormorant" ? "var(--f-cormorant)" : "var(--f-playfair)";
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${bebas.variable} ${cormorant.variable}`} data-brand={b.slug}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${vars}--font-display:${display};}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
