"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { rs } from "@/brands";
import { img, photoFor, SCENES } from "@/lib/photos";
import { useSite } from "./Providers";
import { Btn, Stars, ease, useOpen } from "./ui";

function Rotating({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % words.length), 2600); return () => clearInterval(t); }, [words.length]);
  return (
    <span className="relative block h-[1.12em] overflow-hidden" style={{ clipPath: "inset(0 -0.3em 0 0)" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={words[i]} initial={{ y: "105%" }} animate={{ y: "0%" }} exit={{ y: "-105%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }} className="text-gradient absolute left-0 top-0 whitespace-nowrap">{words[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Line({ children, d }: { children: React.ReactNode; d: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className="block" initial={{ y: "110%", rotate: 3 }} animate={{ y: "0%", rotate: 0 }} transition={{ delay: d, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}

/** Rising grill sparks for Barasti. */
function Embers() {
  const e = [6, 14, 22, 31, 38, 47, 55, 63, 70, 78, 86, 93, 10, 42, 67, 88];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {e.map((x, i) => (
        <span key={i} className={`ember ${i > 9 ? "hidden md:block" : ""}`}
          style={{ left: `${x}%`, animationDuration: `${6 + (i % 6) * 1.4}s`, animationDelay: `${-i * 1.1}s`, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2 }} />
      ))}
    </div>
  );
}

/** Cycling "tonight's pick" card with a real photo and a one-tap add. */
function PickCard() {
  const { b, add } = useSite();
  const all = b.cats.flatMap((c) => c.items);
  const picks = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as typeof all;
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % picks.length), 4200); return () => clearInterval(t); }, [picks.length]);
  const it = picks[i];
  if (!it) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease }}
      className="w-[19rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/35 p-2 backdrop-blur-xl">
      <div className="relative h-40 overflow-hidden rounded-[1.35rem]">
        <AnimatePresence initial={false}>
          <motion.img key={it.n} src={photoFor(it.n, it.t, 640, 360)} alt={it.n} className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.6 }, scale: { duration: 4.5, ease: "linear" } }} />
        </AnimatePresence>
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
          {b.slug === "miami" ? "Tonight's pick" : "Most ordered"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.p key={it.n} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.35 }}
              className="truncate text-sm font-bold text-white">{it.n}</motion.p>
          </AnimatePresence>
          <p className="font-display text-lg text-primary">{rs(it.p)}</p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => add(it.n, 1)} aria-label={`Add ${it.n}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-gradient text-ink shadow-lg"><Plus className="h-5 w-5" /></motion.button>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { b } = useSite();
  const ref = useRef<HTMLElement>(null);
  const shots = SCENES[b.slug].hero;
  const [s, setS] = useState(0);
  useEffect(() => { const t = setInterval(() => setS((p) => (p + 1) % shots.length), 6000); return () => clearInterval(t); }, [shots.length]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgS = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const txtY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const st = useOpen();

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* cinematic photo background */}
      <motion.div aria-hidden style={{ y: bgY, scale: bgS }} className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.img key={shots[s]} src={img(shots[s], 2000)} alt="" className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.18 }} animate={{ opacity: 1, scale: 1.02 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 7.5, ease: "linear" } }} />
        </AnimatePresence>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/60" />
      {b.slug === "miami" && <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,rgb(var(--c-primary)/0.35),transparent_55%),radial-gradient(ellipse_at_20%_90%,rgb(var(--c-secondary)/0.3),transparent_50%)] mix-blend-screen" />}
      {b.slug === "barasti" && <Embers />}
      <div aria-hidden className="noise absolute inset-0 -z-10" />

      <motion.div style={{ opacity: fade, y: txtY }} className="container-x relative grid w-full items-end gap-10 pb-24 pt-36 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-8">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease }} className="eyebrow border-white/15 bg-black/30 text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-success" /></span>
            {b.hero.eyebrow}
          </motion.span>
          {b.slug === "miami" && (
            <motion.img src={b.logo} alt="" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
              className="flicker mt-6 h-20 w-20 rounded-full object-cover shadow-[0_0_30px_rgb(var(--c-primary)),0_0_70px_rgb(var(--c-secondary)/0.6)]" />
          )}
          <h1 className="mt-6 text-[clamp(2.9rem,8.4vw,7.2rem)] leading-[0.98]">
            <Line d={0.45}>{b.hero.start}</Line>
            <Line d={0.6}><Rotating words={b.hero.rotating} /></Line>
          </h1>
          <div className="overflow-hidden">
            <motion.p initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease }} className="mt-3 text-xl font-semibold text-white/90 sm:text-2xl">{b.hero.end}</motion.p>
          </div>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }} className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{b.hero.sub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.8, ease }} className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Btn href="#menu">{b.slug === "miami" ? "See menu & book" : "Order now"}</Btn>
            <Btn href="#visit" variant="ghost" arrow={false} className="border-white/20 bg-black/30 backdrop-blur"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{b.areaLine}</span></Btn>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: 0.8 }} className="mt-9 flex flex-wrap items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient font-display text-xl text-ink">{b.rating}</span>
            <div>
              <Stars value={b.rating} />
              <p className="mt-1 text-xs text-white/70">{b.reviewsCount} Google reviews · {st ? (st.open ? "Open right now" : b.hours.text) : b.hours.text}</p>
            </div>
          </motion.div>
        </div>
        <div className="hidden justify-end lg:col-span-4 lg:flex"><PickCard /></div>
      </motion.div>

      {/* slide counter + scroll cue */}
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/60 sm:flex">
        <span>Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20"><span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-white" /></span>
      </div>
      <div className="absolute bottom-8 right-6 hidden gap-1.5 sm:flex">
        {shots.map((x, n) => (
          <button key={x} onClick={() => setS(n)} aria-label={`Show photo ${n + 1}`} className="h-1 w-8 overflow-hidden rounded-full bg-white/25">
            {n === s && <motion.span key={s} className="block h-full bg-white" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />}
          </button>
        ))}
      </div>
      <a href="#about" aria-label="Scroll down" className="absolute bottom-6 left-6 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 sm:hidden"><ArrowDown className="h-4 w-4" /></a>
    </section>
  );
}
