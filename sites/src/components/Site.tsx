"use client";
import { Providers } from "./Providers";
import { Header, Preloader } from "./Chrome";
import { Hero } from "./Hero";
import { Visit } from "./Sections";
import { Story, TasteReel } from "./Showcase";
import { Warmup } from "./Warmup";
import { About, Cart, Cta, Faq, Footer, Gallery, HowTo, MenuSection, Reviews, Stats, Strip, WhatsAppFloat } from "./Sections";

export function Site({ slug }: { slug: "vox" | "barasti" | "miami" }) {
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
    </Providers>
  );
}
