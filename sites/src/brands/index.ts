import { vox } from "./vox";
import { barasti } from "./barasti";
import { miami } from "./miami";
import { marina } from "./marina";
import { ember } from "./ember";
import { delights } from "./delights";
import type { Brand } from "./types";

export const brands = { vox, barasti, miami, marina, ember, delights };

/** Pick the brand from the host name (hms-demo-barasti..., barasti.com, ...) or ?brand= in dev. */
export function brandFromHost(host: string | null | undefined): Brand {
  const h = (host || "").toLowerCase();
  if (h.includes("barasti")) return barasti;
  if (h.includes("miami")) return miami;
  if (h.includes("vox")) return vox;
  if (h.includes("marina")) return marina;
  if (h.includes("ember")) return ember;
  if (h.includes("delights")) return delights;
  const env = process.env.NEXT_PUBLIC_BRAND as keyof typeof brands | undefined;
  return (env && brands[env]) || vox;
}

/**
 * The brand this deployment serves, fixed at build time. Each Vercel project builds its own copy,
 * so the page can be pre-rendered once and served from the CDN instead of rendered per request.
 */
export function buildBrand(): Brand {
  const env = process.env.NEXT_PUBLIC_BRAND as keyof typeof brands | undefined;
  if (env && brands[env]) return brands[env];
  return brandFromHost(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.VERCEL_GIT_REPO_SLUG);
}

export const rs = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-US");
export type { Brand };
