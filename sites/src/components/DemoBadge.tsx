"use client";
import { useSite } from "./Providers";

/** Shown on previews the cafe has not approved yet, so nobody mistakes it for their official site. */
export function DemoBadge() {
  const { b } = useSite();
  if (!b.demo) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 left-4 z-40 max-w-[70vw] rounded-full border border-white/15 bg-black/75 px-4 py-2 text-[0.68rem] font-semibold text-white/85 backdrop-blur sm:left-5 sm:text-xs">
      Sample design by HMS for {b.name}. Not the official website.
    </div>
  );
}
