"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSite } from "./Providers";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Btn({ children, href, onClick, variant = "primary", className, arrow = true, external }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: "primary" | "ghost"; className?: string; arrow?: boolean; external?: boolean;
}) {
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5",
    variant === "primary"
      ? "bg-brand-gradient text-ink shadow-[0_10px_40px_-10px_rgb(var(--c-primary)/0.9)] hover:shadow-[0_14px_50px_-8px_rgb(var(--c-secondary)/0.9)]"
      : "border border-line bg-card/40 text-foreground hover:border-primary/70 hover:bg-card",
    className,
  );
  const inner = (
    <>
      {variant === "primary" && <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />}
      <span className="relative">{children}</span>
      {arrow && <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />}
    </>
  );
  if (href) return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={cn("h-4 w-4", i < Math.round(value) ? "fill-accent text-accent" : "text-line")} />
      ))}
    </span>
  );
}

export function TiltCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const bg = useTransform([mx, my] as never, ([x, y]: number[]) => `radial-gradient(380px circle at ${x * 100}% ${y * 100}%, rgb(var(--c-primary) / 0.18), transparent 60%)`);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  };
  return (
    <motion.div onPointerMove={move} onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("card glow-border group h-full transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_rgb(var(--c-primary)/0.55)]", className)}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: bg }} />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export function Heading({ eyebrow, title, sub, center = true }: { eyebrow: string; title: ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <motion.span initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />{eyebrow}
      </motion.span>
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.08, ease }}
        className="mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">{title}</motion.h2>
      {sub && <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.16, ease }}
        className={cn("mt-5 text-base leading-relaxed text-muted sm:text-lg", center && "mx-auto max-w-2xl")}>{sub}</motion.p>}
    </div>
  );
}

/** Karachi local hour, and whether the cafe is open right now. */
export function useOpen() {
  const { b } = useSite();
  const [s, setS] = useState<{ open: boolean; day: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "numeric", hour12: false, weekday: "short" }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value || 0) % 24;
      const wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.find((p) => p.type === "weekday")?.value || "Mon");
      const { open, close } = b.hours;
      const isOpen = close > open ? h >= open && h < close : h >= open || h < close;
      setS({ open: isOpen, day: wd });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [b]);
  return s;
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
