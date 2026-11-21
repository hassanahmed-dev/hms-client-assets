"use client";
import { useEffect } from "react";
import { heroSet, img, photoFor, SCENES, SZ } from "@/lib/photos";
import { useSite } from "./Providers";

type Job = { src: string; srcset?: string };

/**
 * Fetches photos into the browser cache ahead of time, in the same sizes the page uses,
 * most important first and only a few at a time, so it never slows down what is on screen.
 */
export function Warmup() {
  const { b } = useSite();
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!conn && (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || ""));
    const all = b.cats.flatMap((c) => c.items);
    const sig = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as typeof all;
    const sc = SCENES[b.slug];
    const marquee = b.marquee.map((m) => all.find((i) => i.n === m || m.includes(i.n) || i.n.includes(m))).filter(Boolean) as typeof all;

    const q: Job[] = [];
    const seen = new Set<string>();
    const push = (src: string, srcset?: string) => { if (!seen.has(src)) { seen.add(src); q.push({ src, srcset }); } };

    // first screen
    sc.hero.slice(1).forEach((id) => push(img(id, SZ.hero[0]), heroSet(id)));
    sig.forEach((it) => push(photoFor(it.n, it.t, ...SZ.pick)));
    marquee.forEach((it) => push(photoFor(it.n, it.t, ...SZ.thumb)));
    if (!slow) {
      // next screens, in page order
      push(img(sc.story[0], 900, 1150)); push(img(sc.story[1], 600, 600));
      sig.forEach((it) => push(photoFor(it.n, it.t, ...SZ.story)));
      all.slice(0, 12).forEach((it) => push(photoFor(it.n, it.t, ...SZ.reel)));
      b.cats.forEach((c) => c.items.slice(0, 4).forEach((it) => push(photoFor(it.n, it.t, ...SZ.card))));
      all.forEach((it) => push(photoFor(it.n, it.t, ...SZ.card)));
      push(img(sc.stats, ...SZ.wide)); push(img(sc.cta, ...SZ.wide));
    }

    let alive = true;
    let running = 0;
    const MAX = 4;
    const next = () => {
      while (alive && running < MAX && q.length) {
        const j = q.shift()!;
        running++;
        const i = new Image();
        i.decoding = "async";
        if (j.srcset) { i.sizes = "100vw"; i.srcset = j.srcset; }
        i.onload = i.onerror = () => { running--; next(); };
        i.src = j.src;
      }
    };
    // wait for the page (and its first hero photo) to finish, then start quietly
    const start = () => setTimeout(next, 300);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => { alive = false; window.removeEventListener("load", start); };
  }, [b]);
  return null;
}
