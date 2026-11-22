"use client";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { brands, type Brand } from "@/brands";
import { setBrand } from "@/lib/photos";

type Cart = Record<string, number>;
type Ctx = {
  b: Brand;
  cart: Cart;
  add: (name: string, d?: number) => void;
  clear: () => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  price: (name: string) => number;
};

const C = createContext<Ctx | null>(null);
export const useSite = () => useContext(C)!;

declare global { interface Window { __lenis?: Lenis } }

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
}

export function Providers({ slug, children }: { slug: keyof typeof brands; children: ReactNode }) {
  const b = brands[slug];
  setBrand(slug);
  const prices = useMemo(() => {
    const m: Record<string, number> = {};
    b.cats.forEach((c) => c.items.forEach((i) => (m[i.n] = i.p)));
    return m;
  }, [b]);
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const add = useCallback((name: string, d = 1) => {
    setCart((c) => {
      const n = { ...c, [name]: (c[name] || 0) + d };
      if (n[name] <= 0) delete n[name];
      return n;
    });
  }, []);
  const clear = useCallback(() => setCart({}), []);
  const count = Object.values(cart).reduce((a, x) => a + x, 0);
  const total = Object.entries(cart).reduce((a, [k, q]) => a + q * (prices[k] || 0), 0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a || !a.hash || a.origin !== location.origin) return;
      const id = a.hash.slice(1);
      if (document.getElementById(id)) { e.preventDefault(); scrollToId(id); }
    };
    document.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onClick); lenis.destroy(); window.__lenis = undefined; };
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
  }, [open]);

  return (
    <C.Provider value={{ b, cart, add, clear, count, total, open, setOpen, price: (n) => prices[n] || 0 }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </C.Provider>
  );
}
