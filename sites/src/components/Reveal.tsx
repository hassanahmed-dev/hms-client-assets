"use client";
/**
 * Scroll-reveal helpers built on Framer Motion `whileInView`.
 *  <Reveal>          — single element fades/slides in
 *  <Stagger> + <StaggerItem> — children animate one after another
 * Reduced motion is respected globally via <MotionConfig reducedMotion="user">.
 */
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "down" | "left" | "right" | "pop" | "none";

const offset = (dir: Dir) => {
  switch (dir) {
    case "up": return { y: 40 };
    case "down": return { y: -40 };
    case "left": return { x: 50 };
    case "right": return { x: -50 };
    case "pop": return { scale: 0.85, y: 24 };
    default: return {};
  }
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Start animating ~200px before an element scrolls into view, so content is
 *  already visible when it reaches the screen (important on iOS momentum scroll). */
export const EARLY = "0px 0px 200px 0px";

export function Reveal({
  children, dir = "up", delay = 0, className, as = "div", amount = 0.2,
}: { children: ReactNode; dir?: Dir; delay?: number; className?: string; as?: "div" | "li" | "section" | "span"; amount?: number }) {
  const M = motion[as];
  return (
    <M
      data-reveal=""
      className={className}
      initial={{ opacity: 0, ...offset(dir) }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: EARLY }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </M>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.1) => ({ transition: { staggerChildren: stagger } }),
};

export function Stagger({
  children, className, stagger = 0.1, as = "div", amount = 0.15,
}: { children: ReactNode; className?: string; stagger?: number; as?: "div" | "ul" | "ol"; amount?: number }) {
  const M = motion[as];
  return (
    <M className={className} variants={container} custom={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount, margin: EARLY }}>
      {children}
    </M>
  );
}

export function StaggerItem({
  children, className, dir = "up", as = "div",
}: { children: ReactNode; className?: string; dir?: Dir; as?: "div" | "li" | "article" }) {
  const M = motion[as];
  const v: Variants = {
    hidden: { opacity: 0, ...offset(dir) },
    show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.6, ease } },
  };
  return <M data-reveal="" className={className} variants={v}>{children}</M>;
}
