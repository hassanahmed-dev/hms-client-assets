import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite CSS marquee (GPU-accelerated transform, zero JS).
 * Content is rendered twice; the track moves -50% for a seamless loop.
 * Pauses on hover.
 */
export function Marquee({
  children, reverse = false, duration = 40, className,
}: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div
      className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]", className)}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className={cn("flex w-max shrink-0 items-center will-change-transform group-hover:[animation-play-state:paused]", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
