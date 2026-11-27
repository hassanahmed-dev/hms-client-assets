"use client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check, ChevronDown, Clock, Instagram, MapPin, MessageCircle, Minus, Navigation, Phone, Plus, Quote, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { rs } from "@/brands";
import { cn, initials } from "@/lib/utils";
import { Marquee } from "./Marquee";
import { Counter } from "./Counter";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { img, lqip, ownGallery, photoFor, reelItems, SCENES, SZ } from "@/lib/photos";
import { RevealPhoto } from "./Showcase";
import { useSite } from "./Providers";
import { Btn, Heading, Stars, TiltCard, ease, useOpen, waLink } from "./ui";

export function Strip() {
  const { b } = useSite();
  return (
    <section aria-label="Signature items" className="relative border-y border-line/60 bg-surface/50 py-6">
      <Marquee duration={38}>
        {b.marquee.map((m) => {
          const it = b.cats.flatMap((c) => c.items).find((i) => i.n === m || m.includes(i.n) || i.n.includes(m));
          return (
            <span key={m} className="mx-5 flex items-center gap-5 font-display text-2xl text-foreground/85 sm:text-4xl">
              {it && <img src={photoFor(it.n, it.t, ...SZ.thumb)} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/50 sm:h-14 sm:w-14" />}
              {m}<Sparkles className="h-5 w-5 text-primary" />
            </span>
          );
        })}
      </Marquee>
      <Marquee duration={46} reverse className="mt-3">
        {b.services.concat([b.hours.text, b.areaLine, `${b.rating}★ on Google`]).map((m) => (
          <span key={m} className="mx-3 rounded-full border border-line bg-card/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{m}</span>
        ))}
      </Marquee>
    </section>
  );
}

export function About() {
  const { b } = useSite();
  const ph = b.photos;
  return (
    <section id="about" className="section">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <div className="relative mx-auto grid max-w-xl grid-cols-6 grid-rows-6 gap-4" style={{ aspectRatio: "1 / 1.05" }}>
            <RevealPhoto src={img(SCENES[b.slug].story[0], 900, 1150)} alt={b.name} from="left" className="col-span-4 row-span-6 rounded-[2rem]" />
            <RevealPhoto src={img(SCENES[b.slug].story[1], 600, 600)} alt={b.name} from="right" className="col-span-2 row-span-3 rounded-[1.5rem]" />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8, ease }}
              className="card col-span-2 row-span-3 grid place-items-center p-3 text-center">
              <div>
                <p className="font-display text-5xl text-gradient">{b.rating}</p>
                <Stars value={b.rating} className="mt-2 justify-center [&_svg]:h-3.5 [&_svg]:w-3.5" />
                <p className="mt-2 text-xs text-muted">{b.reviewsCount} Google reviews</p>
              </div>
            </motion.div>
          </div>
          {ph[0] && <motion.img initial={{ opacity: 0, y: 30, rotate: -8 }} whileInView={{ opacity: 1, y: 0, rotate: -6 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.9, ease }}
            src={ph[0]} alt={`${b.name}, from Instagram`} className="absolute -bottom-6 -left-2 h-28 w-28 rounded-2xl border-4 border-background object-cover shadow-2xl sm:h-36 sm:w-36" />}
          <div aria-hidden className="absolute -bottom-6 -right-2 -z-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        </div>
        <div>
          <Heading center={false} eyebrow={`About ${b.short}`} title={b.about.title} sub={b.about.body} />
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
            {b.about.points.map(([t, d]) => (
              <StaggerItem key={t}>
                <div className="card h-full p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-ink"><Check className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-sans text-base font-bold">{t}</h3>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function ItemCard({ it, big }: { it: import("@/brands/types").Item; big?: boolean }) {
  const { b, cart, add } = useSite();
  const q = cart[it.n] || 0;
  return (
    <TiltCard className="overflow-hidden" max={5}>
      <div className={cn("relative overflow-hidden rounded-t-[inherit]", big ? "h-72" : "h-52")}>
        <img src={photoFor(it.n, it.t, ...SZ.card)} alt={it.n} style={lqip(photoFor(it.n, it.t, ...SZ.card))} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
        {it.tag && <span className="absolute left-4 top-4 rounded-full bg-brand-gradient px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">{it.tag}</span>}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 font-display text-base text-white backdrop-blur">{rs(it.p)}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("font-sans font-bold leading-snug", big ? "text-xl" : "text-base")}>{it.n}</h3>
        </div>
        <p className="mt-1.5 min-h-[2.5rem] text-sm text-muted">{it.d}</p>
        <div className="mt-4 flex items-center justify-between">
          {q > 0 ? (
            <div className="flex items-center gap-3 rounded-full border border-primary/60 p-1">
              <button onClick={() => add(it.n, -1)} className="grid h-8 w-8 place-items-center rounded-full bg-card" aria-label={`Remove one ${it.n}`}><Minus className="h-4 w-4" /></button>
              <motion.span key={q} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="w-4 text-center font-bold">{q}</motion.span>
              <button onClick={() => add(it.n, 1)} className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-ink" aria-label={`Add one ${it.n}`}><Plus className="h-4 w-4" /></button>
            </div>
          ) : (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => add(it.n, 1)} className="inline-flex items-center gap-2 rounded-full border border-primary/70 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-ink">
              <Plus className="h-4 w-4" />Add
            </motion.button>
          )}
          <span className="text-[0.7rem] uppercase tracking-wider text-muted">{it.t === "game" ? "per booking" : b.slug === "vox" ? "fresh" : "made to order"}</span>
        </div>
      </div>
    </TiltCard>
  );
}

export function Signature() {
  const { b } = useSite();
  const all = b.cats.flatMap((c) => c.items);
  const sig = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as typeof all;
  return (
    <section className="section bg-surface/40">
      <div className="container-x">
        <Heading eyebrow="Signature picks" title={<>Start with the <span className="text-gradient">favourites</span></>} sub="The ones our guests come back for again and again." />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {sig.map((it) => <StaggerItem key={it.n}><ItemCard it={it} big /></StaggerItem>)}
        </Stagger>
      </div>
    </section>
  );
}

export function MenuSection() {
  const { b } = useSite();
  const [cat, setCat] = useState(0);
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s) return b.cats.flatMap((c) => c.items).filter((i) => i.n.toLowerCase().includes(s) || i.d.toLowerCase().includes(s));
    return b.cats[cat].items;
  }, [b, cat, q]);
  return (
    <section id="menu" className="section">
      <div className="container-x">
        <Heading eyebrow="Full menu" title={<>Our <span className="text-gradient">menu</span></>} sub={b.menuNote} />
        <p className="mt-4 text-center text-xs text-muted/70">Photos are for illustration.</p>
        {b.sampleMenu && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-accent/50 bg-accent/10 px-4 py-3 text-center text-sm text-accent">Sample items and prices shown for preview. The real menu goes here.</p>
        )}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the menu" className="field rounded-full pl-11" aria-label="Search the menu" />
          </div>
          {!q && (
            <LayoutGroup>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2" data-lenis-prevent>
                {b.cats.map((c, i) => (
                  <button key={c.name} onClick={() => setCat(i)} className={cn("relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition", i === cat ? "text-ink" : "text-muted hover:text-foreground")}>
                    {i === cat && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-brand-gradient" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                    <span className="relative">{c.name} <span className="opacity-60">{c.items.length}</span></span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          )}
        </div>
        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((it, i) => (
              <motion.div key={it.n} layout initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease }}>
                <ItemCard it={it} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {items.length === 0 && <p className="mt-10 text-center text-muted">Nothing found. Try another word.</p>}
      </div>
    </section>
  );
}

export function Stats() {
  const { b } = useSite();
  const items = b.cats.reduce((a, c) => a + c.items.length, 0);
  const c = b.hours.close;
  const close = Math.floor(c) % 12 === 0 ? 12 : Math.floor(c) % 12;
  const ampm = c >= 12 && c < 24 ? " PM" : " AM";
  const data: [number, string, string, number?][] = [
    [Math.round(b.rating * 10), "", "Google rating", 10],
    [b.reviewsCount, "+", "Google reviews"],
    [items, "+", b.scene === "neon" ? "Ways to play & eat" : "Items on the menu"],
    b.hours.allDay ? [24, "/7", "Open around the clock"] : b.hours.late ? [Math.floor(b.hours.open) % 12 || 12, " PM", "Opens every evening"] : [close, ampm, "Open until, every night"],
  ];
  return (
    <section className="relative py-16">
      <div className="container-x">
        <div className="noise relative grid gap-8 overflow-hidden rounded-[2rem] border border-line/70 p-8 sm:grid-cols-2 sm:p-14 lg:grid-cols-4">
          <RevealPhoto src={img(SCENES[b.slug].stats, ...SZ.wide)} alt="" className="!absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-black/70" />
          {data.map(([v, suf, label, div]) => (
            <Reveal key={label} className="relative text-center">
              <p className="font-display text-5xl text-gradient sm:text-6xl">{div ? b.rating.toFixed(1) : <Counter value={v} suffix={suf} />}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted">{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  const { b } = useSite();
  const own = [...b.photos, ...ownGallery(b.slug)];
  const sample = !own.length;
  const photos = sample ? reelItems(b).slice(0, 6).map((it) => photoFor(it.n, it.t, ...SZ.card)) : own;
  const [open, setOpen] = useState<number | null>(null);
  const many = photos.length > 3;
  return (
    <section id="gallery" className="section bg-surface/40">
      <div className="container-x">
        <Heading eyebrow="Gallery" title={<>A look <span className="text-gradient">inside</span></>} sub={sample ? "Sample photos for this preview. Your own photos of the cafe and food go here." : b.instagram ? `Real moments from @${b.instagram}.` : "Real moments from our counter and our guests."} />
        <div className={cn("mx-auto mt-14 grid gap-3", many ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : "max-w-xl grid-cols-2")}>
          {photos.map((p, i) => (
            <Reveal key={p} dir="pop" delay={(i % 6) * 0.05}>
              <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl" aria-label="Open photo">
                <img src={p} alt={`${b.name} photo ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 translate-y-3 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">View</span>
              </button>
            </Reveal>
          ))}
        </div>
        {b.instagram && (
          <div className="mt-10 text-center"><Btn href={`https://www.instagram.com/${b.instagram}/`} external variant="ghost"><span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" />Follow @{b.instagram}</span></Btn></div>
        )}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-6">
            <motion.img key={open} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={photos[open]} alt="" className="max-h-[85vh] w-[min(90vw,32rem)] rounded-2xl object-contain" />
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Close"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Reviews() {
  const { b } = useSite();
  const card = (r: (typeof b.reviews)[number]) => (
    <figure key={r.name} className="card mx-3 w-[22rem] shrink-0 p-6">
      <Quote className="h-7 w-7 text-primary" />
      <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-foreground/90">“{r.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-ink">{initials(r.name) || "G"}</span>
        <span><span className="block text-sm font-bold">{r.name}</span><span className="flex items-center gap-2 text-xs text-muted"><Stars value={5} className="[&_svg]:h-3 [&_svg]:w-3" />{r.when}</span></span>
      </figcaption>
    </figure>
  );
  return (
    <section id="reviews" className="section">
      <div className="container-x">
        <Heading eyebrow="Guest reviews" title={<>Loved by <span className="text-gradient">{b.reviewsCount}+</span> guests</>} sub={`Rated ${b.rating} out of 5 on Google. Here is what people say, in their own words.`} />
      </div>
      <div className="mt-14 space-y-6">
        <Marquee duration={55}>{b.reviews.map(card)}</Marquee>
        {b.reviews.length > 3 && <Marquee duration={62} reverse>{[...b.reviews].reverse().map(card)}</Marquee>}
      </div>
    </section>
  );
}

export function HowTo() {
  const { b } = useSite();
  const steps = [
    ["Pick your favourites", "Browse the menu and tap Add on what you want."],
    ["Review your order", "Change quantities and see your total, live."],
    ["Send on WhatsApp", `Your order goes straight to ${b.short} on WhatsApp.`],
    [b.scene === "neon" ? "Walk in and play" : "Enjoy it fresh", "We confirm on WhatsApp and get it ready for you."],
  ];
  return (
    <section className="section bg-surface/40">
      <div className="container-x">
        <Heading eyebrow="How it works" title={<>Order in <span className="text-gradient">4 taps</span></>} />
        <Stagger className="relative mt-14 grid gap-6 md:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent md:block" />
          {steps.map(([t, d], i) => (
            <StaggerItem key={t} className="relative text-center">
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient font-display text-2xl text-ink shadow-[0_10px_40px_-10px_rgb(var(--c-primary))]">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl border-2 border-primary" />{i + 1}
              </span>
              <h3 className="mt-5 font-sans text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Faq() {
  const { b } = useSite();
  const [o, setO] = useState<number | null>(0);
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2"><Heading center={false} eyebrow="FAQ" title={<>Good to <span className="text-gradient">know</span></>} sub="Still have a question? Message us on WhatsApp and we reply fast." /></div>
        <div className="space-y-3 lg:col-span-3">
          {b.faq.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.05}>
              <div className="card overflow-hidden">
                <button onClick={() => setO(o === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" aria-expanded={o === i}>
                  {q}<ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform duration-300", o === i && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {o === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  const { b } = useSite();
  const st = useOpen();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const fmt = (h: number) => {
    const hh = Math.floor(h), m = Math.round((h - hh) * 60), t = hh % 12 === 0 ? 12 : hh % 12;
    return `${t}${m ? `:${String(m).padStart(2, "0")}` : ""} ${hh >= 12 && hh < 24 ? "PM" : "AM"}`;
  };
  const dir = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`;
  return (
    <section id="visit" className="section bg-surface/40">
      <div className="container-x">
        <Heading eyebrow="Visit us" title={<>Come say <span className="text-gradient">hi</span></>} sub={b.address} />
        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal dir="right" className="lg:col-span-3">
            <div className="card h-full min-h-[22rem] overflow-hidden p-2">
              <iframe title={`${b.name} on Google Maps`} src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&output=embed`} loading="lazy"
                className="h-full min-h-[22rem] w-full rounded-[1.25rem] grayscale-[30%] invert-[90%] hue-rotate-180" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </Reveal>
          <Reveal dir="left" className="lg:col-span-2">
            <div className="card h-full p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-sans text-lg font-bold"><Clock className="h-5 w-5 text-primary" />Opening hours</h3>
                {st && <span className={cn("rounded-full px-3 py-1 text-xs font-bold", st.open ? "bg-success/15 text-success" : "bg-line text-muted")}>{st.open ? "Open now" : "Closed now"}</span>}
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {days.map((d, i) => (
                  <li key={d} className={cn("flex justify-between rounded-xl px-3 py-2", st?.day === i ? "bg-primary/15 font-bold text-foreground" : "text-muted")}>
                    <span>{d}</span><span>{b.hours.allDay ? "Open 24 hours" : <>{fmt(b.hours.open)} – {b.hours.late ? "late" : fmt(b.hours.close)}</>}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{b.address}</p>
                <p className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={`tel:+${b.wa}`} className="hover:text-primary">{b.phone}</a></p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn href={dir} external arrow={false}><span className="inline-flex items-center gap-2"><Navigation className="h-4 w-4" />Directions</span></Btn>
                <Btn href={waLink(b.wa, `Hi ${b.short}! I have a question.`)} external variant="ghost" arrow={false}><span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" />WhatsApp</span></Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  const { b } = useSite();
  return (
    <section className="section">
      <div className="container-x">
        <Reveal dir="pop">
          <div className="noise relative overflow-hidden rounded-[2.5rem] border border-line/70 p-10 sm:p-16 lg:p-20">
            <RevealPhoto src={img(SCENES[b.slug].cta, ...SZ.wide)} alt="" className="!absolute inset-0" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />
            <div aria-hidden className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/40 blur-[100px]" />
            <img src={b.logo} alt="" className="relative h-16 w-16 rounded-full object-cover ring-2 ring-white/30" />
            <h2 className="relative mt-6 max-w-2xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] text-white">{b.cta.title}</h2>
            <p className="relative mt-4 max-w-xl text-base font-medium text-white/75 sm:text-lg">{b.cta.sub}</p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-full bg-brand-gradient px-7 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5">Start your order</a>
              <a href={waLink(b.wa, `Hi ${b.short}!`)} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">WhatsApp {b.phone}</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { b } = useSite();
  return (
    <footer className="border-t border-line/70 pb-28 pt-14">
      <div className="container-x grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3"><img src={b.logo} alt="" className="h-12 w-12 rounded-full object-cover" /><span className="font-display text-2xl">{b.short}</span></div>
          <p className="mt-4 max-w-xs text-sm text-muted">{b.tagline}. {b.hours.text}.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">{["about", "menu", "gallery", "reviews", "visit"].map((h) => <li key={h}><a href={`#${h}`} className="capitalize hover:text-primary">{h}</a></li>)}</ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{b.address}</li>
            <li><a href={`tel:+${b.wa}`} className="hover:text-primary">{b.phone}</a></li>
            {b.instagram && <li><a href={`https://www.instagram.com/${b.instagram}/`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">@{b.instagram}</a></li>}
            {b.extraLink && <li><a href={b.extraLink.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{b.extraLink.label}</a></li>}
          </ul>
        </div>
      </div>
      <p className="container-x mt-12 text-xs text-muted">© {new Date().getFullYear()} {b.name}, Karachi.{b.sampleMenu ? " Menu and prices shown are samples." : " Prices may change."} Food photos are for illustration.</p>
    </footer>
  );
}

export function Cart() {
  const { b, cart, add, clear, count, total, open, setOpen, price } = useSite();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const modes = b.orderModes || (b.scene === "neon" ? ["Walk-in / booking", "Takeaway"] : b.slug === "barasti" ? ["Dine-in", "Pickup", "Delivery"] : ["Pickup", "Dine-in"]);
  const [mode, setMode] = useState(modes[0]);
  const send = () => {
    const ask = Object.keys(cart).some((n) => !price(n));
    const lines = Object.entries(cart).map(([n, q]) => `• ${q} x ${n}${price(n) ? ` = ${rs(q * price(n))}` : " (price please)"}`).join("\n");
    const tot = total ? `${rs(total)}${ask ? " + items to confirm" : ""}` : "please confirm";
    const msg = `Hi ${b.short}! I'd like to place an order:\n\n${lines}\n\nTotal: ${tot}\nType: ${mode}${name ? `\nName: ${name}` : ""}${note ? `\nNote: ${note}` : ""}`;
    window.open(waLink(b.wa, msg), "_blank");
  };
  return (
    <>
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} onClick={() => setOpen(true)}
            className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-brand-gradient py-3 pl-4 pr-6 font-bold text-ink shadow-[0_20px_50px_-10px_rgb(var(--c-primary))]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm text-foreground">{count}</span>View order{total ? ` · ${rs(total)}` : ""}
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed bottom-0 right-0 top-0 z-[71] flex w-full max-w-md flex-col border-l border-line bg-background" data-lenis-prevent>
              <div className="flex items-center justify-between border-b border-line p-5">
                <h3 className="flex items-center gap-2 font-sans text-lg font-bold"><ShoppingBag className="h-5 w-5 text-primary" />Your order</h3>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {count === 0 ? (
                  <div className="grid h-full place-items-center text-center text-muted"><div><ShoppingBag className="mx-auto h-12 w-12 opacity-40" /><p className="mt-4">Your order is empty.</p><a href="#menu" onClick={() => setOpen(false)} className="mt-4 inline-block font-bold text-primary">Browse the menu</a></div></div>
                ) : (
                  <ul className="space-y-3">
                    {Object.entries(cart).map(([n, q]) => {
                      const it = b.cats.flatMap((c) => c.items).find((i) => i.n === n)!;
                      return (
                        <motion.li layout key={n} className="card flex items-center gap-3 p-3">
                          <img src={photoFor(it.n, it.t, ...SZ.thumb)} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{n}</p><p className="text-xs text-muted">{rs(price(n))}</p></div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => add(n, -1)} className="grid h-7 w-7 place-items-center rounded-full border border-line" aria-label="Less"><Minus className="h-3 w-3" /></button>
                            <span className="w-4 text-center text-sm font-bold">{q}</span>
                            <button onClick={() => add(n, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-ink" aria-label="More"><Plus className="h-3 w-3" /></button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
                {count > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex gap-2">{modes.map((m) => <button key={m} onClick={() => setMode(m)} className={cn("flex-1 rounded-full border px-3 py-2 text-xs font-bold", mode === m ? "border-primary bg-primary/15 text-primary" : "border-line text-muted")}>{m}</button>)}</div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field" />
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={mode === "Delivery" ? "Delivery address" : "Any note (less sugar, time, etc.)"} rows={2} className="field" />
                  </div>
                )}
              </div>
              {count > 0 && (
                <div className="border-t border-line p-5">
                  <div className="flex items-center justify-between text-lg font-bold"><span>Total</span><span className="font-display text-2xl text-gradient">{total ? rs(total) : "On WhatsApp"}</span></div>
                  <button onClick={send} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 font-bold text-[#06210f] transition hover:brightness-110"><MessageCircle className="h-5 w-5" />Send order on WhatsApp</button>
                  <button onClick={clear} className="mt-3 w-full text-xs text-muted underline">Clear order</button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function WhatsAppFloat() {
  const { b, count } = useSite();
  return (
    <a href={waLink(b.wa, `Hi ${b.short}!`)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className={cn("fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110", count > 0 && "hidden sm:grid")}>
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
