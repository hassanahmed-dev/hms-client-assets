"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSite } from "./Providers";
import { Art } from "./Art";
import { Btn, Stars, ease, useOpen } from "./ui";

function Rotating({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % words.length), 2300); return () => clearInterval(t); }, [words.length]);
  return (
    <span className="relative block h-[1.12em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={words[i]} initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease }} className="text-gradient absolute left-0 top-0 whitespace-nowrap">{words[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Cup flies in, coffee pours and fills it, steam rises. Brand logo printed on the cup. */
function CoffeeScene() {
  const { b } = useSite();
  return (
    <svg viewBox="0 0 400 440" className="mx-auto w-full max-w-[26rem] overflow-visible" aria-hidden>
      <defs>
        <clipPath id="cupc"><path d="M118 170h164l-18 170q-2 22-26 22h-76q-24 0-26-22z" /></clipPath>
        <clipPath id="logoc"><circle cx="200" cy="268" r="46" /></clipPath>
        <linearGradient id="liq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a5530" /><stop offset="1" stopColor="#4a2612" /></linearGradient>
      </defs>
      {[[50, 110, 0, 1], [350, 90, 1.2, 0.8], [330, 330, 0.6, 1.1], [60, 320, 1.8, 0.7], [210, 30, 2.4, 0.6]].map(([x, y, d, s], i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -22, 0], rotate: [0, 40, 0] }}
          transition={{ opacity: { delay: 0.8 + d * 0.2 }, y: { duration: 6, repeat: Infinity, delay: d }, rotate: { duration: 6, repeat: Infinity, delay: d } }}
          style={{ transformOrigin: `${x}px ${y}px` }}>
          <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx="17" ry="11" fill="#4a2a14" /><path d="M-14 1q14-9 28 0" stroke="#24120a" strokeWidth="3" fill="none" /></g>
        </motion.g>
      ))}
      {/* coffee splash crown + flying droplets, triggered as the pour hits the cup */}
      <motion.path d="M68 214 Q74 202 45 194 Q16 187 43 182 Q70 177 51 166 Q31 155 59 155 Q87 156 68 140 Q49 124 76 130 Q103 135 99 123 Q95 111 114 117 Q133 124 126 102 Q120 80 140 95 Q159 110 161 86 Q163 63 177 83 Q192 104 201 94 Q210 83 217 98 Q223 112 240 94 Q257 76 256 97 Q254 117 270 110 Q286 103 283 118 Q279 132 308 120 Q338 109 324 126 Q310 143 342 139 Q375 134 349 150 Q323 166 334 171 Q345 175 337 182 Q329 190 351 197 Q373 204 353 209 L332 214 Q200 236 68 214z" fill="#5a2f17" opacity="0.9"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.08, 1], opacity: [0, 0.95, 0.85] }}
        transition={{ delay: 1.75, duration: 0.9, ease: "easeOut" }} style={{ transformOrigin: "200px 200px" }} />
      <motion.path d="M68 214 Q74 202 45 194 Q16 187 43 182 Q70 177 51 166 Q31 155 59 155 Q87 156 68 140 Q49 124 76 130 Q103 135 99 123 Q95 111 114 117 Q133 124 126 102 Q120 80 140 95 Q159 110 161 86 Q163 63 177 83 Q192 104 201 94 Q210 83 217 98 Q223 112 240 94 Q257 76 256 97 Q254 117 270 110 Q286 103 283 118 Q279 132 308 120 Q338 109 324 126 Q310 143 342 139 Q375 134 349 150 Q323 166 334 171 Q345 175 337 182 Q329 190 351 197 Q373 204 353 209 L332 214 Q200 236 68 214z" fill="#8a5530" opacity="0.7" transform="translate(200 200) scale(.78) translate(-200 -200)"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.05, 1], opacity: [0, 0.8, 0.7] }}
        transition={{ delay: 1.85, duration: 0.9, ease: "easeOut" }} style={{ transformOrigin: "200px 200px" }} />
      {[[-6, 186, 6], [11, 149, 7], [31, 114, 7], [83, 99, 7], [110, 63, 7], [158, 44, 5], [212, 68, 7], [264, 60, 5], [297, 91, 7], [354, 97, 5], [396, 126, 5], [362, 172, 5], [394, 205, 5]].map(([x, y, r], i) => (
        <motion.circle key={"b" + i} cx={x} cy={y} r={r} fill="#6b3a1d" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
          transition={{ delay: 1.95 + i * 0.03, type: "spring", stiffness: 200 }} style={{ transformOrigin: `${x}px ${y}px` }} />
      ))}
      {[[-187, -24, 5], [-202, -65, 8], [-159, -87, 6], [-133, -114, 9], [-112, -152, 5], [-78, -189, 9], [-21, -158, 6], [25, -188, 11], [73, -176, 5], [117, -159, 9], [148, -127, 5], [168, -92, 5], [210, -68, 6], [204, -26, 8]].map(([dx, dy, r], i) => (
        <motion.circle key={i} cx="200" cy="175" r={r} fill={i % 3 ? "#6b3a1d" : "#a0663a"}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: [0, dx, dx * 1.08], y: [0, dy, dy + 60], opacity: [0, 1, 0], scale: [0.3, 1, 0.7] }}
          transition={{ duration: 1.6, delay: 1.8 + (i % 5) * 0.05, repeat: Infinity, repeatDelay: 4.2, ease: "easeOut" }} />
      ))}
      <motion.g initial={{ x: -320, y: -280, rotate: -140, scale: 0.35, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.2, 0.9, 0.3, 1.15], delay: 0.2 }} style={{ transformOrigin: "200px 280px" }}>
        <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2.6, ease: "easeInOut" }}>
          <ellipse cx="200" cy="398" rx="120" ry="14" fill="rgba(0,0,0,.35)" />
          <ellipse cx="200" cy="372" rx="120" ry="20" fill="#e8dac8" />
          <ellipse cx="200" cy="366" rx="84" ry="11" fill="#f7eddf" />
          <path d="M276 192h16q34 0 34 38t-34 38h-24" fill="none" stroke="#fbf3e8" strokeWidth="17" strokeLinecap="round" />
          <path d="M118 170h164l-18 170q-2 22-26 22h-76q-24 0-26-22z" fill="#fbf3e8" />
          <g clipPath="url(#cupc)">
            <motion.rect x="110" y="160" width="180" height="210" fill="url(#liq)" initial={{ y: 210 }} animate={{ y: 10 }} transition={{ duration: 3, delay: 1.7, ease: "easeInOut" }} opacity="0.95" />
          </g>
          <circle cx="200" cy="268" r="50" fill="#fff" />
          <image href={b.cupLogo} x="154" y="222" width="92" height="92" preserveAspectRatio="xMidYMid slice" clipPath="url(#logoc)" />
          <motion.ellipse cx="200" cy="170" rx="82" ry="13" initial={{ fill: "#2a1509" }} animate={{ fill: "#8a5a33" }} transition={{ duration: 3, delay: 1.7 }} />
          <motion.ellipse cx="200" cy="170" rx="58" ry="7" fill="#d7ab7a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6 }} />
          <motion.path d="M178 170q22-14 44 0q-22 10-44 0z" fill="#f6e7d3" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4.9, duration: 0.6 }} style={{ transformOrigin: "200px 170px" }} />
          <motion.rect x="193" y="-40" width="14" height="208" rx="7" fill="#6b3a1d"
            style={{ originY: 0 }} initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 1, 0] }} transition={{ duration: 3.2, delay: 1.5, times: [0, 0.12, 0.86, 1] }} />
          {[170, 200, 230].map((x, i) => (
            <motion.path key={x} d={`M${x} 150q-14-26 0-52t0-40`} stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: [0, 0.8, 0], y: [8, -10, -24] }} transition={{ duration: 3, repeat: Infinity, delay: 4.6 + i * 0.8 }} />
          ))}
        </motion.g>
      </motion.g>
    </svg>
  );
}

/** Rotating card of the brand's own photos with a slow Ken Burns zoom. */
function PhotoCard({ neon }: { neon?: boolean }) {
  const { b } = useSite();
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % b.photos.length), 3600); return () => clearInterval(t); }, [b.photos.length]);
  return (
    <motion.div initial={{ opacity: 0, y: 50, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.6, duration: 1, ease }}
      className={`card relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden p-2 ${neon ? "shadow-[0_0_80px_-10px_rgb(var(--c-primary)/0.7)]" : "shadow-[0_40px_120px_-40px_rgb(var(--c-primary)/0.7)]"}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
        <AnimatePresence initial={false}>
          <motion.img key={b.photos[i]} src={b.photos[i]} alt={`${b.name}`} className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1.02 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.8 }, scale: { duration: 4.5, ease: "linear" } }} />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
          <div className="flex gap-1.5">
            {b.photos.map((p, n) => <span key={p} className={`h-1 rounded-full transition-all duration-500 ${n === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ children, className, delay, from }: { children: React.ReactNode; className: string; delay: number; from: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: from }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.8, ease }} className={`absolute z-10 ${className}`}>
      <div className="card flex animate-float items-center gap-3 rounded-2xl px-3.5 py-2.5 shadow-xl">{children}</div>
    </motion.div>
  );
}

function Visual() {
  const { b } = useSite();
  const st = useOpen();
  const sig = b.signature.map((n) => b.cats.flatMap((c) => c.items).find((i) => i.n === n)).filter(Boolean);
  return (
    <div className="relative mx-auto w-full max-w-[30rem] pb-16 pt-10">
      {b.scene === "coffee" ? <CoffeeScene /> : <PhotoCard neon={b.scene === "neon"} />}
      {b.scene === "neon" && (
        <motion.img src={b.logo} alt="" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.4, type: "spring", stiffness: 120 }}
          className="flicker absolute -top-4 left-4 z-20 h-24 w-24 rounded-full object-cover shadow-[0_0_30px_rgb(var(--c-primary)),0_0_70px_rgb(var(--c-secondary)/0.6)]" />
      )}
      <Chip className="right-0 top-6 sm:-right-4" delay={1.6} from={30}>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient font-display text-lg text-ink">{b.rating}</span>
        <div><Stars value={b.rating} className="[&_svg]:h-3 [&_svg]:w-3" /><p className="mt-0.5 text-[0.7rem] text-muted">{b.reviewsCount} Google reviews</p></div>
      </Chip>
      <Chip className="bottom-6 left-0 sm:-left-6 [&>div]:[animation-delay:-4s]" delay={1.9} from={-30}>
        <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-card"><Clock className="h-5 w-5 text-primary" /></span>
        <div><p className="text-sm font-bold leading-tight">{st ? (st.open ? "Open now" : "Opens at " + (b.hours.open > 12 ? b.hours.open - 12 + " PM" : b.hours.open + " AM")) : "Open daily"}</p><p className="text-[0.7rem] text-muted">{b.hours.text}</p></div>
      </Chip>
      {b.scene === "grill" && sig[1] && (
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5, duration: 0.8, ease }} className="absolute -right-3 bottom-1/4 z-10 hidden sm:block">
          <div className="card animate-float p-2 [animation-delay:-3s]"><Art t={sig[1]!.t} c={sig[1]!.c} logo={b.cupLogo} className="h-20 w-20" /></div>
        </motion.div>
      )}
      {b.scene === "grill" && sig[2] && (
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8, duration: 0.8, ease }} className="absolute left-1/3 -top-2 z-10 hidden sm:block">
          <div className="card animate-float-slow p-1.5 [animation-delay:-6s]"><Art t={sig[2]!.t} c={sig[2]!.c} logo={b.cupLogo} className="h-14 w-14" /></div>
        </motion.div>
      )}
      {b.scene !== "coffee" && sig[0] && (
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.2, duration: 0.8, ease }} className="absolute -left-2 top-1/3 z-10 hidden sm:block">
          <div className="card animate-float-slow p-2"><Art t={sig[0]!.t} c={sig[0]!.c} logo={b.cupLogo} className="h-20 w-20" /></div>
        </motion.div>
      )}
    </div>
  );
}

export function Hero() {
  const { b } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const st = useOpen();
  return (
    <section id="top" ref={ref} className="noise relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <div className="absolute -left-32 top-10 h-[34rem] w-[34rem] animate-float-slow rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute right-[-10rem] top-40 h-[28rem] w-[28rem] animate-float rounded-full bg-secondary/20 blur-[120px]" />
          <div className="absolute left-[8%] top-[22%] hidden h-14 w-14 animate-spin-slow rounded-2xl border border-primary/40 md:block" />
          <div className="absolute right-[12%] top-[16%] hidden h-6 w-6 animate-float rounded-full bg-brand-gradient md:block" />
          <div className="absolute bottom-[18%] left-[46%] hidden h-10 w-10 animate-float-slow rotate-45 border border-secondary/40 md:block" />
        </motion.div>
      </div>
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div style={{ y: y2 }} className="lg:col-span-7">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease }} className="eyebrow">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-success" /></span>
            {b.hero.eyebrow}
          </motion.span>
          <h1 className="mt-6 text-[clamp(2.7rem,7.6vw,6rem)] leading-[1.0]">
            <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease }}>{b.hero.start}</motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease }}><Rotating words={b.hero.rotating} /></motion.span>
            <motion.span className="mt-2 block font-sans text-[0.34em] font-semibold leading-snug tracking-normal text-foreground/85" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9, ease }}>{b.hero.end}</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8, ease }} className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{b.hero.sub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease }} className="mt-9 flex flex-col gap-3 xs:flex-row">
            <Btn href="#menu">{b.slug === "miami" ? "See menu & book" : "Order now"}</Btn>
            <Btn href="#visit" variant="ghost" arrow={false}><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />Find us in {b.areaLine}</span></Btn>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-10 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3">
              {b.photos.slice(0, 3).map((p) => <img key={p} src={p} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-background" />)}
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-gradient font-display text-xs text-ink ring-2 ring-background">{b.rating}★</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Rated {b.rating} on Google</p>
              <p className="mt-0.5 text-xs text-muted">{b.reviewsCount} reviews · {st?.open ? "Open right now" : b.hours.text}</p>
            </div>
          </motion.div>
        </motion.div>
        <div className="lg:col-span-5"><Visual /></div>
      </div>
    </section>
  );
}
