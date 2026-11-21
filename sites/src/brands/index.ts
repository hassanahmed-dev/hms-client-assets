import { vox } from "./vox";
import { barasti } from "./barasti";
import { miami } from "./miami";
import type { Brand } from "./types";

export const brands = { vox, barasti, miami };

/** Pick the brand from the host name (hms-demo-barasti..., barasti.com, ...) or ?brand= in dev. */
export function brandFromHost(host: string | null | undefined): Brand {
  const h = (host || "").toLowerCase();
  if (h.includes("barasti")) return barasti;
  if (h.includes("miami")) return miami;
  if (h.includes("vox")) return vox;
  const env = process.env.NEXT_PUBLIC_BRAND as keyof typeof brands | undefined;
  return (env && brands[env]) || vox;
}

export const rs = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-US");
export type { Brand };
