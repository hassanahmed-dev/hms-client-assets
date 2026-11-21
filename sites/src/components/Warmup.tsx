"use client";
import { useEffect } from "react";
import { heroSet, img, photoFor, SCENES, SZ } from "@/lib/photos";
import { useSite } from "./Providers";

/**
 * Fetches photos into the browser cache ahead of time, in the same sizes the page uses,
 * so sections, menu tabs and the hero slideshow show their pictures straight away.
 */
export function Warmup() {
  const { b } = useSite();
  useEffect(() => {
    const done = new Set<string>();
    const get = (src: string, low = false, srcset?: string) => {
      if (!src || done.has(src)) return;
      done.add(src);
      const i = new Image();
      i.decoding = "async";
      (i as HTMLImageElement & { fetchPriority?: string }).fetchPriority = low ? "low" : "high";
      if (srcset) { i.sizes = "100vw"; i.srcset = srcset; }
      i.src = src;
    };
    const all = b.cats.flatMap((c) => c.items);
    const sig = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as typeof all;
    const sc = SCENES[b.slug];

    // 1. right away (during the loading screen): hero slides and the floating pick card
    sc.hero.forEach((id) => get(img(id, SZ.hero[0]), false, heroSet(id)));
    sig.forEach((it) => get(photoFor(it.n, it.t, ...SZ.pick)));

    // 2. shortly after: the next screens down
    const t1 = setTimeout(() => {
      get(img(sc.story[0], 900, 1150)); get(img(sc.story[1], 600, 600));
      sig.forEach((it) => get(photoFor(it.n, it.t, ...SZ.story)));
      all.forEach((it) => get(photoFor(it.n, it.t, ...SZ.thumb), true));
      all.slice(0, 16).forEach((it) => get(photoFor(it.n, it.t, ...SZ.reel), true));
      b.cats[0].items.forEach((it) => get(photoFor(it.n, it.t, ...SZ.card), true));
    }, 900);

    // 3. when the browser is idle: every menu card and the background shots
    const t2 = setTimeout(() => {
      all.forEach((it) => get(photoFor(it.n, it.t, ...SZ.card), true));
      get(img(sc.stats, ...SZ.wide), true); get(img(sc.cta, ...SZ.wide), true);
    }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [b]);
  return null;
}
