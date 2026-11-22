"use client";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSite } from "./Providers";
import { ease, useOpen, waLink } from "./ui";

export function Preloader() {
  const { b } = useSite();
  const [show, setShow] = useState(true);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const key = `pre-${b.slug}`;
    try { if (sessionStorage.getItem(key)) { setShow(false); return; } } catch {}
    document.documentElement.style.overflow = "hidden";
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const total = touch ? 650 : 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else { try { sessionStorage.setItem(key, "1"); } catch {} setTimeout(() => setShow(false), 80); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [b.slug]);
  useEffect(() => { if (!show) document.documentElement.style.overflow = ""; }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div role="status" aria-label={`Loading ${b.name}`} className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          initial={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[100px]" />
          <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -25 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, ease }} className="relative">
            <span aria-hidden className="absolute inset-[-16px] animate-spin-slow rounded-full border border-dashed border-primary/60" />
            <img src={b.logo} alt="" className="h-28 w-28 rounded-full object-cover shadow-[0_0_60px_rgb(var(--c-primary)/0.5)]" />
          </motion.div>
          <div className="relative mt-8 overflow-hidden">
            <motion.p initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.25, duration: 0.7, ease }} className="font-display text-3xl sm:text-4xl">
              {b.short}
            </motion.p>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">{b.tagline}</motion.p>
          <div className="relative mt-10 w-[min(280px,70vw)]">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-right font-display text-sm tabular-nums text-muted">{pct}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const NAV = [["#about", "About"], ["#menu", "Menu"], ["#gallery", "Gallery"], ["#reviews", "Reviews"], ["#visit", "Visit"]];

export function Header() {
  const { b, count, setOpen } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const st = useOpen();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "py-2" : "py-4")}>
      <motion.div style={{ scaleX: bar }} className="absolute inset-x-0 top-0 h-[2px] origin-left bg-brand-gradient" />
      <div className="container-x">
        <div className={cn("flex items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4",
          scrolled ? "border-line/80 bg-background/75 shadow-[0_20px_60px_-30px_rgba(0,0,0,.8)] backdrop-blur-xl" : "border-transparent")}>
          <a href="#top" className="flex items-center gap-3">
            <img src={b.logo} alt={b.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40" />
            <span className="hidden leading-tight xs:block">
              <span className="block font-display text-lg">{b.short}</span>
              <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                {st && <span className={cn("h-1.5 w-1.5 rounded-full", st.open ? "bg-success" : "bg-muted")} />}
                {st ? (st.open ? "Open now" : "Closed now") : b.areaLine}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map(([h, l]) => (
              <a key={h} href={h} className="rounded-full px-4 py-2 text-sm text-foreground/80 transition hover:bg-card hover:text-foreground">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-card/60 transition hover:border-primary" aria-label="Open your order">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-gradient px-1 text-[0.65rem] font-bold text-ink">{count}</motion.span>
                )}
              </AnimatePresence>
            </button>
            <a href="#menu" className="hidden rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-bold text-ink sm:inline-block">Order now</a>
            <button onClick={() => setMob(true)} className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl lg:hidden">
            <button onClick={() => setMob(false)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Close menu"><X className="h-5 w-5" /></button>
            <nav className="flex h-full flex-col items-center justify-center gap-4">
              {NAV.map(([h, l], i) => (
                <motion.a key={h} href={h} onClick={() => setMob(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, ease }}
                  className="font-display text-4xl">{l}</motion.a>
              ))}
              <a href={waLink(b.wa, `Hi ${b.short}!`)} target="_blank" rel="noopener noreferrer" className="mt-6 rounded-full bg-brand-gradient px-7 py-3 font-bold text-ink">WhatsApp us</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
