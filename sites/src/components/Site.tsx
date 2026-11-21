"use client";
import { Providers } from "./Providers";
import { Header, Preloader } from "./Chrome";
import { Hero } from "./Hero";
import { Visit } from "./Sections";
import { About, Cart, Cta, Faq, Footer, Gallery, HowTo, MenuSection, Reviews, Signature, Stats, Strip, WhatsAppFloat } from "./Sections";

export function Site({ slug }: { slug: "vox" | "barasti" | "miami" }) {
  return (
    <Providers slug={slug}>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Strip />
        <About />
        <Signature />
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
