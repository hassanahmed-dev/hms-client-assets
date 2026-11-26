/**
 * Runs before every build (npm "prebuild").
 *
 * 1. Cafe's own photos: anything in public/<brand>/hero, public/<brand>/menu or
 *    public/<brand>/gallery is resized to WebP. Menu photos are matched to items by file
 *    name: "Malai Boti" -> malai-boti.jpg (any of jpg, jpeg, png, webp).
 * 2. Stock photos: every Unsplash photo the pages use is downloaded at the exact sizes needed.
 *
 * Everything lands in public/stock/ and is listed in src/lib/assets.generated.json.
 * Nothing here can fail the build: a photo that cannot be prepared falls back to Vercel's
 * image optimiser at runtime.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "stock");
const GEN = path.join(ROOT, "src/lib/assets.generated.json");
const SLUGS = ["vox", "barasti", "miami", "marina", "ember", "delights", "lafuma", "amour", "cafe1947", "sugarfix", "glitch", "steamy", "lalounge", "dejavu", "chailounge", "cupshup"] as const;
const EXT = /\.(jpe?g|png|webp|avif)$/i;

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function list(dir: string) {
  if (!existsSync(dir)) return [];
  return (await readdir(dir)).filter((f) => EXT.test(f)).sort();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const ownSrc = new Map<string, string>(); // own photo id -> source file
  const own: Record<string, { hero?: string[]; menu?: Record<string, string>; gallery?: string[] }> = {};

  for (const b of SLUGS) {
    const o: (typeof own)[string] = {};
    for (const kind of ["hero", "menu", "gallery"] as const) {
      const files = await list(path.join(PUB, b, kind));
      for (const f of files) {
        const name = slugify(f.replace(EXT, ""));
        const id = `own-${b}-${kind}-${name}`;
        ownSrc.set(id, path.join(PUB, b, kind, f));
        if (kind === "menu") (o.menu ||= {})[name] = id;
        else (o[kind] ||= []).push(id);
      }
    }
    if (Object.keys(o).length) own[b] = o;
  }
  // write the own-photo map first: photos.ts reads it when we import it below
  await writeFile(GEN, JSON.stringify({ stock: {}, own }, null, 1));

  const { plan, vkey, tkey } = await import("../src/lib/photos");
  const { brands } = await import("../src/brands");

  const only = (() => { try { const env = process.env.NEXT_PUBLIC_BRAND || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || ""; return SLUGS.find((s) => env.includes(s)); } catch { return undefined; } })();
  const jobs = new Map<string, { id: string; w: number; h: number }>();
  for (const b of SLUGS.filter((s) => !only || s === only)) for (const [id, w, h] of plan(brands[b])) {
    jobs.set(vkey(id, w, h), { id, w, h });
    jobs.set(tkey(id), { id, w: 48, h: 48 });
  }
  for (const id of ownSrc.keys()) if (id.includes("-gallery-")) { jobs.set(vkey(id, 1200, 0), { id, w: 1200, h: 0 }); jobs.set(tkey(id), { id, w: 48, h: 48 }); }

  const ok: Record<string, 1> = {};
  let fail = 0;
  const entries = [...jobs.entries()];
  const work = async ([key, j]: (typeof entries)[number]) => {
    const file = path.join(OUT, `${key}.webp`);
    const isTiny = key.endsWith("_t");
    try {
      if (existsSync(file)) { ok[key] = 1; return; }
      const src = ownSrc.get(j.id);
      if (src) {
        let p = sharp(src).rotate().resize(j.w, j.h || undefined, { fit: "cover", withoutEnlargement: !isTiny });
        if (isTiny) p = p.blur(6);
        await p.webp({ quality: isTiny ? 30 : 68 }).toFile(file);
      } else {
        const url = `https://images.unsplash.com/photo-${j.id}?fit=crop&fm=webp&q=${isTiny ? 30 : 60}&w=${j.w}${j.h ? `&h=${j.h}` : ""}${isTiny ? "&blur=60" : ""}`;
        let buf: Buffer | null = null;
        for (let a = 0; a < 3 && !buf; a++) {
          try {
            const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
            if (r.ok) buf = Buffer.from(await r.arrayBuffer());
          } catch { /* retry */ }
        }
        if (!buf) throw new Error("download failed");
        await writeFile(file, buf);
      }
      ok[key] = 1;
    } catch (e) {
      fail++;
      console.warn(`[assets] skipped ${key}: ${(e as Error).message}`);
    }
  };
  const N = 24;
  let i = 0;
  await Promise.all(Array.from({ length: N }, async () => { while (i < entries.length) await work(entries[i++]); }));

  await writeFile(GEN, JSON.stringify({ stock: ok, own }, null, 1));
  console.log(`[assets] ${Object.keys(ok).length} photos ready in public/stock, ${fail} skipped, own photos: ${ownSrc.size}`);
}

main().catch((e) => { console.warn("[assets] failed, photos will use the image optimiser:", e); });
