"use client";
import { Providers } from "./Providers";
import { Header, Preloader } from "./Chrome";
import { Hero } from "./Hero";
import { Visit } from "./Sections";
import { Ambient, Swirl } from "./Ambient";
import { About, Cart, Cta, Faq, Footer, Gallery, HowTo, MenuSection, Reviews, Signature, Stats, Strip, WhatsAppFloat } from "./Sections";

export function Site({ slug }: { slug: "vox" | "barasti" | "miami" }) {
  return (
    <Providers slug={slug}>
      <Preloader />
      <Ambient />
      <Header />
      <main>
        <Hero />
        <Swirl />
        <Strip />
        <About />
        <Signature />
        <MenuSection />
        <Swirl />
        <Stats />
        <Gallery />
        <Reviews />
        <HowTo />
        <Faq />
        <Visit />
        <Swirl />
        <Cta />
      </main>
      <Footer />
      <Cart />
      <WhatsAppFloat />
    </Providers>
  );
}
