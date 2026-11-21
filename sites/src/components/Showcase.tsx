"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { rs } from "@/brands";
import type { Item } from "@/brands/types";
import { lqip, photoFor, SZ } from "@/lib/photos";
import { useSite } from "./Providers";
import { ease } from "./ui";

/** Photo that wipes in with a clip-path as it enters, then drifts with scroll. */
export function RevealPhoto({ src, alt, className, from = "bottom" }: { src: string; alt: string; className?: string; from?: "bottom" | "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const start = from === "left" ? "inset(0 100% 0 0)" : from === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
  return (
    <motion.div ref={ref} initial={{ clipPath: start }} whileInView={{ clipPath: "inset(0 0 0 0)" }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} className={`relative overflow-hidden ${className || ""}`}>
      <motion.img style={{ y, ...lqip(src) }} src={src} alt={alt} decoding="async" className="absolute inset-[-14%_0] h-[128%] w-full object-cover" />
    </motion.div>
  );
}

/** Editorial rows for the signature items: big photo, giant number, story, price. */
export function Story() {
  const { b, add, cart } = useSite();
  const all = b.cats.flatMap((c) => c.items);
  const sig = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as Item[];
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-3xl">
          <motion.span initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Signature picks</motion.span>
          <motion.h2 initial="h" whileInView="v" viewport={{ once: true }} className="mt-5 text-[clamp(2.3rem,6vw,5rem)] leading-[1]">
            {["The ones people", "come back for."].map((t, k) => (
              <span key={t} className="block overflow-hidden pb-[0.06em]">
                <motion.span className={`block ${k ? "text-gradient" : ""}`} variants={{ h: { y: "105%" }, v: { y: "0%" } }} transition={{ duration: 1, delay: k * 0.1, ease: [0.16, 1, 0.3, 1] }}>{t}</motion.span>
              </span>
            ))}
          </motion.h2>
        </div>
        <div className="mt-16 space-y-20 sm:space-y-28">
          {sig.map((it, i) => {
            const flip = i % 2 === 1;
            const q = cart[it.n] || 0;
            return (
              <div key={it.n} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <div className="group relative">
                    <RevealPhoto src={photoFor(it.n, it.t, ...SZ.story)} alt={it.n} from={flip ? "right" : "left"} className="aspect-[4/3] rounded-[2rem]" />
                    {it.tag && <span className="absolute left-5 top-5 rounded-full bg-black/55 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">{it.tag}</span>}
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.9, delay: 0.2, ease }}
                  className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <span className="font-display text-[clamp(4.5rem,10vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(var(--c-primary)/0.7)]">0{i + 1}</span>
                  <h3 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">{it.n}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">{it.d}</p>
                  <div className="mt-7 flex items-center gap-5">
                    <span className="font-display text-3xl text-primary">{rs(it.p)}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => add(it.n, 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-ink shadow-[0_10px_40px_-10px_rgb(var(--c-primary)/0.9)]">
                      <Plus className="h-4 w-4" />{q ? `Added · ${q}` : "Add to order"}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Pinned section: the page scrolls down, the dish reel slides sideways. */
export function TasteReel() {
  const { b, add } = useSite();
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const all = b.cats.flatMap((c) => c.items);
  // signature items first, then one from each category in turn; never the same photo twice
  const order: Item[] = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as Item[];
  const longest = Math.max(...b.cats.map((c) => c.items.length));
  for (let r = 0; r < longest; r++) for (const c of b.cats) if (c.items[r]) order.push(c.items[r]);
  const seen = new Set<string>();
  const reel = order.filter((it) => { const k = photoFor(it.n, it.t); if (seen.has(k) || it.n === "Still Water") return false; seen.add(k); return true; }).slice(0, 10);
  useEffect(() => {
    const f = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48)); };
    f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, [reel.length]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} id="taste" className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-primary" />From the kitchen</span>
            <h2 className="mt-4 text-[clamp(2.1rem,5vw,4rem)] leading-[1.02]">Scroll the <span className="text-gradient">menu</span></h2>
          </div>
          <div className="hidden h-1 w-48 overflow-hidden rounded-full bg-line sm:block"><motion.div style={{ width: bar }} className="h-full bg-brand-gradient" /></div>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex gap-5 pl-[max(1rem,calc((100vw-82rem)/2+2.5rem))] pr-6 will-change-transform">
          {reel.map((it, i) => (
            <figure key={it.n} className={`group relative shrink-0 overflow-hidden rounded-[1.75rem] ${i % 3 === 1 ? "h-[52vh] w-[min(70vw,24rem)] self-end" : "h-[60vh] w-[min(78vw,30rem)]"}`}>
              <img src={photoFor(it.n, it.t, ...SZ.reel)} alt={it.n} style={lqip(photoFor(it.n, it.t, ...SZ.reel))} decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 font-display text-2xl leading-tight text-white">{it.n}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{rs(it.p)}</p>
                </div>
                <button onClick={() => add(it.n, 1)} aria-label={`Add ${it.n}`} className="grid h-11 w-11 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"><Plus className="h-5 w-5" /></button>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
