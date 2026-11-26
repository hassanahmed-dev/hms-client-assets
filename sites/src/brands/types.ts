export type Art =
  | "hot" | "iced" | "frappe" | "tea" | "mocktail" | "shake" | "burger" | "sandwich" | "fries"
  | "curry" | "bbq" | "pasta" | "bread" | "salad" | "soup" | "seafood" | "chicken" | "sheesha" | "game";

export type Slug = "vox" | "barasti" | "miami" | "marina" | "ember" | "delights" | "lafuma" | "amour" | "cafe1947" | "sugarfix" | "glitch" | "steamy" | "lalounge" | "dejavu" | "chailounge" | "cupshup" | "roofyard" | "hawaii" | "terrace";

export type Item = { n: string; p: number; d: string; t: Art; c: string; tag?: string };
export type Category = { name: string; items: Item[] };
export type Review = { name: string; text: string; when: string };

export type Brand = {
  slug: Slug;
  /** true until the owner approves: shows a "sample design" badge and uses stock photos only */
  demo?: boolean;
  orderModes?: string[];
  name: string;
  short: string;
  tagline: string;
  logo: string;
  cupLogo: string;
  font: "playfair" | "bebas" | "cormorant";
  theme: Record<"background" | "surface" | "card" | "line" | "foreground" | "muted" | "primary" | "secondary" | "accent" | "ink" | "success", string>;
  scene: "coffee" | "grill" | "neon";
  hero: { eyebrow: string; start: string; rotating: string[]; end: string; sub: string };
  wa: string;
  phone: string;
  address: string;
  areaLine: string;
  mapQuery: string;
  /** late: closing time is not published, shown as "late" */
  hours: { open: number; close: number; text: string; late?: boolean };
  rating: number;
  reviewsCount: number;
  priceRange: string;
  instagram?: string;
  extraLink?: { label: string; href: string };
  photos: string[];
  marquee: string[];
  about: { title: string; body: string; points: [string, string][] };
  signature: string[];
  sampleMenu?: boolean;
  menuNote: string;
  cats: Category[];
  reviews: Review[];
  faq: [string, string][];
  services: string[];
  cta: { title: string; sub: string };
};
