"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useSite } from "./Providers";
import { Art } from "./Art";
import type { Art as ArtT } from "@/brands/types";

/* ------------------------------------------------------------------ */
/* Little hand-drawn SVG pieces used in the floating background.       */
/* ------------------------------------------------------------------ */

const Bean = () => (
  <svg viewBox="0 0 100 70" className="h-full w-full">
    <defs>
      <radialGradient id="bean-g" cx=".35" cy=".3" r=".85">
        <stop offset="0" stopColor="#9a6640" />
        <stop offset=".5" stopColor="#4f2c16" />
        <stop offset="1" stopColor="#1c0d05" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="35" rx="46" ry="31" fill="url(#bean-g)" />
    <path d="M7 39C30 19 70 52 93 31" stroke="#140803" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M10 36C32 18 68 48 90 28" stroke="rgba(255,210,170,.16)" strokeWidth="1.5" fill="none" />
    <ellipse cx="32" cy="19" rx="15" ry="5" fill="rgba(255,225,190,.2)" transform="rotate(-14 32 19)" />
  </svg>
);

const Cinnamon = () => (
  <svg viewBox="0 0 120 40" className="h-full w-full">
    <rect x="4" y="8" width="112" height="24" rx="12" fill="#8a4a22" />
    <rect x="4" y="8" width="112" height="9" rx="4.5" fill="#a75d2e" />
    <ellipse cx="112" cy="20" rx="6" ry="12" fill="#5e2f13" />
    <path d="M112 12q-5 8 0 16" stroke="#c27a45" strokeWidth="2" fill="none" />
    <path d="M24 12v16M48 12v16M76 12v16" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
  </svg>
);

const Anise = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i} transform={`rotate(${i * 45} 50 50)`}>
        <path d="M50 50L42 12q8-8 16 0z" fill="#7a3d1c" />
        <path d="M50 50L46 16q4-4 8 0z" fill="#9c5428" />
        <ellipse cx="50" cy="24" rx="3" ry="4.5" fill="#d9a066" />
      </g>
    ))}
    <circle cx="50" cy="50" r="7" fill="#5a2a10" />
  </svg>
);

const Chili = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full">
    <path d="M18 22q30-6 70 6t26 26q-30 6-62-10T18 22z" fill="#d6241c" />
    <path d="M28 24q30-2 58 8" stroke="rgba(255,255,255,.35)" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M20 22q-8-4-10-14" stroke="#3f8f2e" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M14 18q6 10 16 6" fill="#3f8f2e" />
  </svg>
);

const Tomato = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="46" fill="#d9301f" />
    <circle cx="50" cy="50" r="39" fill="#ef5a3f" />
    {[0, 72, 144, 216, 288].map((r) => (
      <g key={r} transform={`rotate(${r} 50 50)`}>
        <path d="M50 50L38 18q12-6 24 0z" fill="#f7826a" />
        <ellipse cx="46" cy="28" rx="2.2" ry="3.4" fill="#fde5a8" />
        <ellipse cx="54" cy="30" rx="2.2" ry="3.4" fill="#fde5a8" />
      </g>
    ))}
    <circle cx="50" cy="50" r="7" fill="#f9b29c" />
  </svg>
);

const Lemon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="46" fill="#f2c318" />
    <circle cx="50" cy="50" r="40" fill="#fff6c9" />
    {Array.from({ length: 9 }).map((_, i) => (
      <path key={i} d="M50 50L41 15q9-4 18 0z" fill="#ffe36a" transform={`rotate(${i * 40} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="4" fill="#fff6c9" />
  </svg>
);

const Onion = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#a54aa0" strokeWidth="9" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1e2f2" strokeWidth="4" />
    <circle cx="50" cy="50" r="27" fill="none" stroke="#b862b2" strokeWidth="6" opacity=".8" />
  </svg>
);

const Leaf = ({ c = "#3f9a3a" }: { c?: string }) => (
  <svg viewBox="0 0 100 60" className="h-full w-full">
    <path d="M6 30Q40-8 94 30Q40 68 6 30z" fill={c} />
    <path d="M10 30H88" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
    {[26, 44, 62].map((x) => <path key={x} d={`M${x} 30l10-10M${x} 30l10 10`} stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />)}
  </svg>
);

const Garlic = () => (
  <svg viewBox="0 0 80 100" className="h-full w-full">
    <path d="M40 6q8 14 22 30t-2 56q-20 10-40 0T18 36 40 6z" fill="#f4ecdc" />
    <path d="M40 10q-6 40 0 82" stroke="#e2d4ba" strokeWidth="3" fill="none" />
    <path d="M40 6l-2-6" stroke="#cbb895" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Peppers = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    {[[30, 34, 11], [58, 26, 9], [72, 56, 12], [40, 66, 10], [20, 60, 7]].map(([x, y, r], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={r} fill="#2b1a12" />
        <circle cx={x - r / 3} cy={y - r / 3} r={r / 3} fill="rgba(255,255,255,.18)" />
      </g>
    ))}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Floating layer: pieces at different depths, parallax on scroll.     */
/* ------------------------------------------------------------------ */

type Piece = {
  /** left in %, start height in % of the loop */
  x: number; y: number;
  /** size in px, rotation, blur px, opacity, parallax speed */
  s: number; r: number; b: number; o: number; d: number;
  k: string;
  /** hide on small screens */
  m?: boolean;
};

const VOX: Piece[] = [
  { x: 3, y: 8, s: 150, r: -20, b: 9, o: 0.55, d: 0.55, k: "bean" },
  { x: 84, y: 4, s: 120, r: 35, b: 7, o: 0.5, d: 0.5, k: "bean" },
  { x: 90, y: 40, s: 64, r: 70, b: 0, o: 0.85, d: 0.3, k: "bean", m: true },
  { x: 12, y: 46, s: 54, r: 120, b: 0, o: 0.8, d: 0.28, k: "bean" },
  { x: 46, y: 18, s: 34, r: 10, b: 2, o: 0.45, d: 0.12, k: "bean", m: true },
  { x: 70, y: 70, s: 160, r: -50, b: 11, o: 0.45, d: 0.62, k: "bean" },
  { x: 28, y: 82, s: 44, r: 200, b: 1, o: 0.6, d: 0.18, k: "bean" },
  { x: 58, y: 52, s: 28, r: 80, b: 3, o: 0.35, d: 0.1, k: "bean", m: true },
  { x: 76, y: 22, s: 110, r: 20, b: 0, o: 0.75, d: 0.34, k: "cinnamon", m: true },
  { x: 6, y: 66, s: 60, r: 0, b: 0, o: 0.75, d: 0.3, k: "anise" },
  { x: 52, y: 90, s: 40, r: 30, b: 2, o: 0.5, d: 0.14, k: "anise", m: true },
  { x: 36, y: 34, s: 90, r: -10, b: 6, o: 0.35, d: 0.45, k: "bean", m: true },
  { x: 94, y: 86, s: 50, r: 160, b: 0, o: 0.8, d: 0.26, k: "bean" },
  { x: 62, y: 6, s: 70, r: 0, b: 4, o: 0.45, d: 0.2, k: "art:hot", m: true },
  { x: 20, y: 24, s: 64, r: 0, b: 3, o: 0.45, d: 0.22, k: "art:iced", m: true },
];

const BARASTI: Piece[] = [
  { x: 4, y: 6, s: 120, r: -18, b: 7, o: 0.55, d: 0.55, k: "tomato" },
  { x: 86, y: 8, s: 130, r: 30, b: 8, o: 0.5, d: 0.5, k: "chili" },
  { x: 90, y: 42, s: 60, r: 0, b: 0, o: 0.85, d: 0.3, k: "lemon", m: true },
  { x: 10, y: 44, s: 80, r: -30, b: 0, o: 0.8, d: 0.28, k: "leaf" },
  { x: 46, y: 16, s: 36, r: 0, b: 2, o: 0.45, d: 0.12, k: "peppers", m: true },
  { x: 72, y: 72, s: 150, r: 0, b: 10, o: 0.4, d: 0.62, k: "onion" },
  { x: 26, y: 84, s: 48, r: 40, b: 0, o: 0.75, d: 0.2, k: "garlic" },
  { x: 58, y: 54, s: 70, r: 120, b: 3, o: 0.4, d: 0.1, k: "chili", m: true },
  { x: 78, y: 24, s: 74, r: 20, b: 0, o: 0.75, d: 0.34, k: "leaf2", m: true },
  { x: 4, y: 68, s: 64, r: 0, b: 0, o: 0.8, d: 0.3, k: "tomato" },
  { x: 52, y: 92, s: 44, r: 0, b: 2, o: 0.5, d: 0.14, k: "peppers", m: true },
  { x: 36, y: 32, s: 100, r: 0, b: 6, o: 0.35, d: 0.45, k: "lemon", m: true },
  { x: 94, y: 86, s: 56, r: -40, b: 0, o: 0.8, d: 0.26, k: "chili" },
  { x: 62, y: 4, s: 84, r: 0, b: 4, o: 0.45, d: 0.2, k: "art:burger", m: true },
  { x: 18, y: 22, s: 76, r: 0, b: 3, o: 0.45, d: 0.22, k: "art:fries", m: true },
  { x: 40, y: 64, s: 80, r: 0, b: 5, o: 0.35, d: 0.4, k: "art:bbq", m: true },
];

function Shape({ k, logo }: { k: string; logo: string }) {
  if (k.startsWith("art:")) return <Art t={k.slice(4) as ArtT} c="#7a4a2a" logo={logo} className="h-full w-full" />;
  switch (k) {
    case "bean": return <Bean />;
    case "cinnamon": return <Cinnamon />;
    case "anise": return <Anise />;
    case "chili": return <Chili />;
    case "tomato": return <Tomato />;
    case "lemon": return <Lemon />;
    case "onion": return <Onion />;
    case "leaf": return <Leaf />;
    case "leaf2": return <Leaf c="#4fb35a" />;
    case "garlic": return <Garlic />;
    case "peppers": return <Peppers />;
    default: return null;
  }
}

function Floater({ p, vh, logo, i }: { p: Piece; vh: number; logo: string; i: number }) {
  const { scrollY } = useScroll();
  const loop = vh + p.s * 2 + 200;
  // Moves up as you scroll (faster = closer), wraps around off-screen so the page never runs empty.
  const y = useTransform(scrollY, (v) => {
    const start = (p.y / 100) * loop;
    const pos = (((start - v * p.d) % loop) + loop) % loop;
    return pos - p.s - 100;
  });
  const rot = useTransform(scrollY, (v) => p.r + v * p.d * 0.05 * (i % 2 ? 1 : -1));
  return (
    <motion.div style={{ y, left: `${p.x}%`, width: p.s, height: p.s }} className={`absolute top-0 ${p.m ? "hidden md:block" : ""}`}>
      <motion.div style={{ rotate: rot }} className="h-full w-full">
        <div
          className="amb-bob h-full w-full"
          style={{ filter: p.b ? `blur(${p.b}px)` : undefined, opacity: p.o, animationDelay: `${-i * 1.7}s`, animationDuration: `${9 + (i % 5) * 2}s` }}
        >
          <Shape k={p.k} logo={logo} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Rising grill embers, pure CSS. */
function Embers() {
  const e = [6, 14, 22, 31, 38, 47, 55, 63, 70, 78, 86, 93, 10, 42, 67, 88, 27, 59];
  return (
    <>
      {e.map((x, i) => (
        <span
          key={i}
          className={`ember ${i > 11 ? "hidden md:block" : ""}`}
          style={{ left: `${x}%`, animationDuration: `${7 + (i % 6) * 1.6}s`, animationDelay: `${-i * 1.3}s`, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2 }}
        />
      ))}
    </>
  );
}

export function Ambient() {
  const { b } = useSite();
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const f = () => setVh(window.innerHeight);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  if (b.slug === "miami") return null;
  const pieces = b.slug === "vox" ? VOX : BARASTI;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      {/* warm light pools */}
      <div className="absolute -left-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-secondary/10 blur-[140px]" />
      {b.slug === "barasti" && (
        <>
          <div className="smoke absolute left-[10%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-white/[0.035] blur-[90px]" />
          <div className="smoke absolute right-[5%] top-[60%] h-[26rem] w-[26rem] rounded-full bg-white/[0.03] blur-[90px] [animation-delay:-9s]" />
          <Embers />
        </>
      )}
      {pieces.map((p, i) => <Floater key={i} p={p} vh={vh} logo={b.cupLogo} i={i} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flowing wave band between sections: milk & coffee for Vox,          */
/* sauce & fire for Barasti.                                           */
/* ------------------------------------------------------------------ */

const WAVE = (amp: number, base: number, ph: number) => {
  // two identical periods across 2880 so translateX(-50%) loops seamlessly
  let d = `M0 160V${base}`;
  for (let x = 0; x <= 2880; x += 40) {
    const y = base + Math.sin((x / 1440) * Math.PI * 4 + ph) * amp + Math.sin((x / 1440) * Math.PI * 2 + ph * 2) * amp * 0.5;
    d += `L${x} ${y.toFixed(1)}`;
  }
  return d + "V160z";
};

export function Swirl({ flip }: { flip?: boolean }) {
  const { b } = useSite();
  if (b.slug === "miami") return null;
  const layers =
    b.slug === "vox"
      ? [
          { c: "#3b1e0e", a: 22, y: 46, p: 0, t: 26 },
          { c: "#8a5a35", a: 18, y: 66, p: 1.6, t: 19 },
          { c: "#e9d3b6", a: 14, y: 88, p: 3.1, t: 15 },
          { c: "#fbf1e2", a: 8, y: 104, p: 4.4, t: 22 },
        ]
      : [
          { c: "#4a1608", a: 22, y: 46, p: 0, t: 24 },
          { c: "#b5361c", a: 18, y: 66, p: 1.6, t: 18 },
          { c: "#e8752a", a: 14, y: 88, p: 3.1, t: 14 },
          { c: "#f6b545", a: 8, y: 104, p: 4.4, t: 21 },
        ];
  return (
    <div aria-hidden className={`relative h-24 overflow-hidden sm:h-36 ${flip ? "rotate-180" : ""}`}>
      {layers.map((l, i) => (
        <div key={i} className="wave absolute inset-y-0 left-0 w-[200%]" style={{ animationDuration: `${l.t}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
          <svg viewBox="0 0 2880 160" preserveAspectRatio="none" className="h-full w-full">
            <path d={WAVE(l.a, l.y, l.p)} fill={l.c} />
          </svg>
        </div>
      ))}
      <div className="wave absolute inset-y-0 left-0 w-[200%]" style={{ animationDuration: "30s" }}>
        <svg viewBox="0 0 2880 160" preserveAspectRatio="none" className="h-full w-full">
          <path d={WAVE(6, 124, 2)} fill="rgb(var(--c-background))" />
        </svg>
      </div>
    </div>
  );
}
