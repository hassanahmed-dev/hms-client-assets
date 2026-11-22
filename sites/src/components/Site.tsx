"use client";
import type { Slug } from "@/brands/types";
import { Providers } from "./Providers";
import { DemoBadge } from "./DemoBadge";
import { Header, Preloader } from "./Chrome";
import { Hero } from "./Hero";
import { Visit } from "./Sections";
import { Story, TasteReel } from "./Showcase";
import { Warmup } from "./Warmup";
import { About, Cart, Cta, Faq, Footer, Gallery, HowTo, MenuSection, Reviews, Stats, Strip, WhatsAppFloat } from "./Sections";

export function Site({ slug }: { slug: Slug }) {
  return (
    <Providers slug={slug}>
      <Warmup />
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Strip />
        <About />
        <Story />
        <TasteReel />
        <MenuSection />
        <Stats />
        <Gallery />
        <Reviews />
        <HowTo />
        <Faq />
        <Visit />
        <Cta />
      </main>
      <Footer />
      <Cart />
      <WhatsAppFloat />
      <DemoBadge />
    </Providers>
  );
}
