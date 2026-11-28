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
import { mamu } from "./mamu";
import { mykarachi } from "./mykarachi";
import { majestic } from "./majestic";
import { kebabmore } from "./kebabmore";
import { mamachai } from "./mamachai";
import { raya } from "./raya";
import { central } from "./central";
import { bhaijaan } from "./bhaijaan";
import { dawatinn } from "./dawatinn";
import { bhaiya } from "./bhaiya";
import { hotpot } from "./hotpot";
import { karamkhan } from "./karamkhan";
import type { Brand } from "./types";

export const brands = { vox, barasti, miami, marina, ember, delights, lafuma, amour, cafe1947, sugarfix, glitch, steamy, lalounge, dejavu, chailounge, cupshup, roofyard, hawaii, terrace, mamu, mykarachi, majestic, kebabmore, mamachai, raya, central, bhaijaan, dawatinn, bhaiya, hotpot, karamkhan };

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
  if (h.includes("mamu")) return mamu;
  if (h.includes("mykarachi")) return mykarachi;
  if (h.includes("majestic")) return majestic;
  if (h.includes("kebabmore")) return kebabmore;
  if (h.includes("mamachai")) return mamachai;
  if (h.includes("raya")) return raya;
  if (h.includes("central")) return central;
  if (h.includes("bhaijaan")) return bhaijaan;
  if (h.includes("dawatinn")) return dawatinn;
  if (h.includes("bhaiya")) return bhaiya;
  if (h.includes("hotpot")) return hotpot;
  if (h.includes("karamkhan")) return karamkhan;
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

/** Price label. 0 means the cafe has not published a price: shown as "Ask price", never invented. */
export const rs = (n: number) => (n > 0 ? "Rs. " + Math.round(n).toLocaleString("en-US") : "Ask price");
export type { Brand };
