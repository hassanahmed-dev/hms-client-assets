import { vox } from "./vox";
import { barasti } from "./barasti";
import { miami } from "./miami";
import { marina } from "./marina";
import { ember } from "./ember";
import { delights } from "./delights";
import { lafuma } from "./lafuma";
import { amour } from "./amour";
import { cafe1947 } from "./cafe1947";
import { sugarfix } from "./sugarfix";
import { glitch } from "./glitch";
import { steamy } from "./steamy";
import { lalounge } from "./lalounge";
import { dejavu } from "./dejavu";
import { chailounge } from "./chailounge";
import { cupshup } from "./cupshup";
import { roofyard } from "./roofyard";
import { hawaii } from "./hawaii";
import { terrace } from "./terrace";
import type { Brand } from "./types";

export const brands = { vox, barasti, miami, marina, ember, delights, lafuma, amour, cafe1947, sugarfix, glitch, steamy, lalounge, dejavu, chailounge, cupshup, roofyard, hawaii, terrace };

/** Pick the brand from the host name (hms-demo-barasti..., barasti.com, ...) or ?brand= in dev. */
export function brandFromHost(host: string | null | undefined): Brand {
  const h = (host || "").toLowerCase();
  if (h.includes("barasti")) return barasti;
  if (h.includes("miami")) return miami;
  if (h.includes("vox")) return vox;
  if (h.includes("marina")) return marina;
  if (h.includes("ember")) return ember;
  if (h.includes("delights")) return delights;
  if (h.includes("lafuma")) return lafuma;
  if (h.includes("amour")) return amour;
  if (h.includes("cafe1947")) return cafe1947;
  if (h.includes("sugarfix")) return sugarfix;
  if (h.includes("glitch")) return glitch;
  if (h.includes("steamy")) return steamy;
  if (h.includes("lalounge")) return lalounge;
  if (h.includes("dejavu")) return dejavu;
  if (h.includes("chailounge")) return chailounge;
  if (h.includes("cupshup")) return cupshup;
  if (h.includes("roofyard")) return roofyard;
  if (h.includes("hawaii")) return hawaii;
  if (h.includes("terrace")) return terrace;
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
