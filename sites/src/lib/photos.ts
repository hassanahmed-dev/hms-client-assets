import type { Brand, Item } from "@/brands/types";
import gen from "./assets.generated.json";
import { brands } from "@/brands";

/**
 * Photos for the sites. Two sources, both served as plain static files from this site's own
 * domain (Vercel CDN):
 *  1. The cafe's own photos, dropped into public/<brand>/hero, /menu or /gallery. The build
 *     (scripts/assets.ts) resizes them to WebP automatically and they take priority.
 *  2. Representative Unsplash stock (free licence), downloaded by the build into public/stock.
 * If a file is missing for any reason, the URL falls back to Vercel's image optimiser.
 */
type Slug = Brand["slug"];
type Gen = { stock: Record<string, 1>; own: Partial<Record<Slug, { hero?: string[]; menu?: Record<string, string>; gallery?: string[] }>> };
const G = gen as Gen;

const raw = (id: string, w: number, h?: number, extra = "") =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}${extra}`;
const via = (src: string, w: number, q: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;

export const vkey = (id: string, w: number, h?: number) => `${id}_${w}x${h || 0}`;
export const tkey = (id: string) => `${id}_t`;

/** remembers which photo each URL belongs to, so lqip() can find its blurred preview */
const ID_OF = new Map<string, string>();

export const img = (id: string, w = 900, h?: number) => {
  const k = vkey(id, w, h);
  const url = G.stock[k] ? `/stock/${k}.webp` : via(raw(id, w, h), w, 60);
  ID_OF.set(url, id);
  return url;
};

/** A ~1 KB blurred preview of the same photo, shown instantly while the real one loads. */
export const tiny = (url: string) => {
  const id = ID_OF.get(url);
  if (!id) return "";
  return G.stock[tkey(id)] ? `/stock/${tkey(id)}.webp` : id.startsWith("own-") ? "" : via(raw(id, 40, 40, "&blur=60"), 40, 30);
};

/** Inline style that paints the blurred preview behind an <img>. */
export const lqip = (url: string) => {
  const t = tiny(url);
  return t ? { backgroundImage: `url("${t}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined;
};

/** Each Vercel project serves one cafe; Providers tells us which one. */
let CUR: Slug = "vox";
export const setBrand = (s: Slug) => { CUR = s; };

/** "Malai Boti" -> "malai-boti", the file name an owner uses in public/<brand>/menu/ */
export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Fixed sizes, so every place that shows a photo shares one cached file. */
export const SZ = {
  hero: [1600, 0], heroSm: [820, 0], pick: [640, 360], story: [1200, 900], reel: [700, 900], card: [640, 520], thumb: [160, 160], wide: [1400, 800],
} as const;
export const heroSet = (id: string) => `${img(id, SZ.heroSm[0])} ${SZ.heroSm[0]}w, ${img(id, SZ.hero[0])} ${SZ.hero[0]}w`;

const P: Record<string, string[]> = {
  burger: ["1568901346375-23c9450c58cd", "1572802419224-296b0aeee0d9", "1607013251379-e6eecfffe234", "1713330801172-03f8d1c0dde7", "1586190848861-99aa4a171e90", "1610440042657-612c34d95e9f"],
  zinger: ["1606755962773-d324e0a13086", "1549611016-3a70d82b5040", "1571091718767-18b5b1457add"],
  fries: ["1630384060421-cb20d0e0649d", "1768252452214-38f555002147", "1598679253544-2c97992403ea"],
  loaded: ["1666304752980-678d5c35c911", "1639744210631-209fce3e256c", "1768252688649-13d169feadc0"],
  nachos: ["1582169296194-e4d644c48063", "1570466199120-80bba1eabad7"],
  iced: ["1517701550927-30cf4ba1dba5", "1761673930163-8d3d6d73cd7a", "1764298490445-6add12301888", "1592663527359-cf6642f54cff", "1778430397340-2ca8a57675b3", "1461023058943-07fcbe16d735", "1770299258214-2f2f44f4c336"],
  hot: ["1593443320739-77f74939d0da", "1541167760496-1628856ab772", "1760163178873-7644a924519e", "1760175445000-0e01e193d1cd", "1761783768352-e7f42bfa9988", "1760306081298-93e10f2be897", "1512568400610-62da28bc8a13"],
  espresso: ["1559496417-e7f25cb247f3", "1772134141698-c47b78663c55", "1514066558159-fc8c737ef259"],
  chocolate: ["1637572815755-c4b80092dce1", "1517578239113-b03992dcdd25", "1607196707151-2db8b71294ba"],
  frappe: ["1637178035575-b0dcbd28a09b", "1718267050202-9b1b6bfb8545", "1696487773677-c0c8061fe3d2", "1653122025451-ec76a73f8a08", "1781003925936-29fd97bbefa5"],
  icedtea: ["1556679343-c7306c1976bc", "1499638673689-79a0b5115d87", "1781663904565-cfdf6a21a9d9"],
  mocktail: ["1654074517750-f854f7c27d62", "1595977514600-72cbc8376c38", "1595981267035-7b04ca84a82d", "1608962994022-8f18c30a7c8c", "1786366562970-0fdd109196d0"],
  shake: ["1572490122747-3968b75cc699", "1553787499-6f9133860278", "1577805947697-89e18249d767", "1775708838877-a3b8d7383c31"],
  smoothie: ["1757597738356-11d378869593", "1662130187270-a4d52c700eb6", "1759428981568-9748d27b85c7"],
  karahi: ["1603496987351-f84a3ba5ec85", "1694579740719-0e601c5d2437"],
  kebab: ["1599487488170-d11ec9c172f0", "1708782341231-426344114ace", "1781332143834-19a40f746cd9"],
  bbq: ["1632158930341-46604b637a0f", "1632158929962-a929c9e87570", "1680206893968-01fe5583f6b5", "1705359573325-f2006d5e459f"],
  tikka: ["1727280376746-b89107a5b0df", "1765360024331-25b63e85272e", "1555939594-58d7cb561ad1", "1781332146555-5507a0fc9bc9"],
  club: ["1553909489-cd47e0907980", "1665233272941-ae681d11fc06", "1712746784291-e29d5d2694d4", "1567234669003-dce7a7a88821"],
  pasta: ["1621996346565-e3dbc646d9a9", "1611270629569-8b357cb88da9", "1556761223-4c4282c73f77", "1608897013039-887f21d8c804"],
  alfredo: ["1781086917723-dbe2d7ef85dc", "1662197480393-2a82030b7b83", "1645112411341-6c4fd023714a"],
  mac: ["1779915008727-23722d1927a5", "1708184528301-b0dad28dded5"],
  prawn: ["1559742811-822873691df8", "1723325697529-6e2679650b39", "1688084468401-4938b073aef2", "1514944288352-fffac99f0bdf"],
  fishchips: ["1579208030886-b937da0925dc", "1706711053549-f52f73a8960c", "1576777647209-e8733d7b851d"],
  wings: ["1567620832903-9fc6debc209f", "1608039755401-742074f0548d", "1650939986300-ce9609921fa7", "1767065703745-f3c33524605a"],
  steak: ["1600891964092-4316c288032e", "1615937657715-bc7b4b7962c1", "1546964124-0cce460f38ef", "1594041680534-e8c8cdebd659", "1602216475919-37336ceb4ad3", "1676300185292-e23bb3db50fa", "1740804989167-123b29d1a34b"],
  salad: ["1607532941433-304659e8198a", "1546793665-c74683f339c1", "1550304943-4f24f54ddde9"],
  fruit: ["1519996529931-28324d5a630e", "1641642400143-6be68f1a0918", "1641642399576-487909d0ddbc"],
  naan: ["1697155406014-04dc649b0953", "1640625314547-aee9a7696589", "1655979284091-eea0e93405ee"],
  soup: ["1665593998976-d957f2827fe7", "1665594051407-7385d281ad76"],
  hookah: ["1685345729575-7f059204c0cd", "1630175772812-3368aad7982d", "1574238752695-675b86d49267", "1635547821500-77542481940c", "1562581146-d7000f1318d4", "1701086732201-533370d341f4"],
  game: ["1493711662062-fa541adb3fc8", "1542751371-adc38448a05e", "1774105416309-088a6205c974"],
  neon: ["1607857530433-585362935ff9", "1785765904806-0d687601b0d5", "1558273246-57d22047406d", "1556035511-3168381ea4d4", "1762553901129-588842051ea0"],
  water: ["1559496417-e7f25cb247f3"],
  chowmein: ["1634864572865-1cf8ff8bd23d", "1634864572872-a01c21e388d4", "1585032226651-759b368d7246"],
  chinese: ["1623689048105-a17b1e1936b8", "1572363644253-3daacc7acd0d", "1710508774177-7ac2f3492675"],
  pancake: ["1528207776546-365bb710ee93", "1757635964104-67218db55bca", "1587339144367-f1cacbecac82"],
  cake: ["1700448293876-07dca826c161", "1722673353577-350697f89b31", "1607257882338-70f7dd2ae344", "1713274785893-8879f807aff6", "1775388243590-569a3b50435c", "1588685723157-4bcbf57fba57"],
  cheesecake: ["1524351199678-941a58a3df50", "1774988867972-98caecc776d8", "1708175313856-8573b2bf8a3a"],
  brownie: ["1780148686706-4af0349a6003", "1624353365286-3f8d62daad51"],
  wrap: ["1626700051175-6818013e1d4f", "1666819615040-eff5e52c778a", "1760888548893-bc2f7e09e972"],
  lasagna: ["1709429790175-b02bb1b19207", "1762631883229-95cfb6a063ad"],
  quesadilla: ["1618040996337-56904b7850b9", "1628838233717-be047a0b54fb", "1719957770167-bb66133ba808"],
  mozz: ["1734774924912-dcbb467f8599", "1778449665117-2c607bbc7415"],
  grilled: ["1598515214211-89d3c73ae83b", "1532550907401-a500c9a57435", "1703219342277-1a78d6b4a27f", "1432139555190-58524dae6a55", "1677051707481-d0d4447ccd6c", "1792974553104-83c9ff7991a2", "1670398564097-0762e1b30b3a", "1668838195568-6a336797587f", "1689774187968-0e6c29a1d82e"],
  fajita: ["1666025954339-97a97468de17", "1546906067-0e3c85626d56", "1612888328032-d12cccaa61b7", "1520720303147-80e4538f2327"],
  fishfinger: ["1678969406337-1869bb0c0dc4", "1604331654916-540f76d082bd"],
  chai: ["1544787219-7f47ccb76574", "1619581073186-5b4ae1b0caad"],
  toast: ["1766981725120-4d39e6c9ad05", "1595044643502-616eeebbdff3", "1788462613181-3d3c2b62e710"],
  pizza: ["1513104890138-7c749659a591", "1769458313988-2cd932ab2777", "1776810250102-7459c4e0edc9"],
  bread: ["1608198093002-ad4e005484ec", "1612539466296-4ecf1db303e3", "1568254183919-78a4f43a2877"],
  cookie: ["1499636136210-6f4ee915583e", "1571165841024-2ce92069301d"],
  biscuit: ["1584847801423-852691e41bc7", "1639678112667-328681eadd9b"],
  croissant: ["1623334044303-241021148842", "1691480162735-9b91238080f6", "1763207291761-e27bb059d851", "1693422662973-fcdd4285c546"],
  tart: ["1653491887846-781545ef38da", "1670819916757-e8d5935a6c65", "1614174486496-344ef3e9d870", "1628838617281-065549dd37fe"],
  pastry: ["1517427294546-5aa121f68e8a", "1582716401301-b2407dc7563d", "1602663491496-73f07481dbea", "1682596044365-eb5c3bc51555"],
  puff: ["1682263167429-0dbcf2c1e127", "1778489926852-b14c57bab23a", "1600521853186-93b88b3a07b0", "1622941367239-8acd68fa946d"],
  eclair: ["1582217308209-2207886c55bd", "1613992258436-7d744cb20893"],
  pudding: ["1702728109878-c61a98d80491", "1752245055475-8b7c3b4756ac"],
  biryani: ["1589302168068-964664d93dc0", "1563379091339-03b21ab4a4f8", "1633945274405-b6c8069047b0", "1697155406055-2db32d47ca07"],
  rice: ["1778634304493-23531df07739", "1719239885399-f87d992e0f18"],
  hummus: ["1637949385162-e416fb15b2ce", "1697126248437-db26a30024c5", "1637949385133-3de79e927ef3"],
  pita: ["1778449752873-5faa2f8fbf16", "1733507100601-323ca84d7277", "1699728088621-38d201c24ac3"],
  friedchicken: ["1764018292116-003fd7d1a0ba", "1426869981800-95ebf51ce900", "1569058242253-92a9c755a0ec"],
  stew: ["1664741662725-bd131742b7b7", "1764314108477-f026172e32a9", "1608500218987-0f2b3be34b47"],
  halwa: ["1638690239774-2fcf6ad3db02", "1659653928215-d71150ba99c5"],
  lassi: ["1546173159-315724a31696"],

};

const RULES: [RegExp, string][] = [
  [/^still water$|^water$/i, "water"],
  [/pita/i, "pita"],
  [/biryani/i, "biryani"],
  [/pillaw|pilaf|pulao|chello|ruz ma|fried rice|saffron rice/i, "rice"],
  [/hummus/i, "hummus"],
  [/halwah|^puri$/i, "halwa"],
  [/rosh|fesenj|stroganov|braised|nargisi|kofte|paya/i, "stew"],
  [/kiev|m'sakhan|^baked chicken$|tawa chicken/i, "grilled"],
  [/^fried chicken$|fried chicken platter/i, "friedchicken"],
  [/kebab|koobideh|chapli|galawati|namkeen boti/i, "kebab"],
  [/\blassi\b/i, "lassi"],
  [/thandai/i, "shake"],
  [/& mango|& banana/i, "smoothie"],
  [/masala chai/i, "chai"],
  [/pizza roll/i, "pizza"],
  [/patties|patty|sausage roll|bread roll|\bpie\b|puff|danish|\bbuns?\b/i, "puff"],
  [/eclair/i, "eclair"],
  [/croissant/i, "croissant"],
  [/rusk|biscuit/i, "biscuit"],
  [/cookies?$/i, "cookie"],
  [/\btarts?\b/i, "tart"],
  [/pudding/i, "pudding"],
  [/basbusa|cake pops/i, "cake"],
  [/pastry/i, "pastry"],
  [/pasta salad/i, "salad"],
  [/(bread|banana bread)$/i, "bread"],
  [/roll|paratha|wrap/i, "wrap"],
  [/pizza fries|peri peri bites/i, "loaded"],
  [/pizza/i, "pizza"],
  [/fajita|sizzling/i, "fajita"],
  [/chow ?mein/i, "chowmein"],
  [/manchurian|chilli dry|shashlik/i, "chinese"],
  [/pancake/i, "pancake"],
  [/french toast/i, "toast"],
  [/cheesecake/i, "cheesecake"],
  [/brownie/i, "brownie"],
  [/cake/i, "cake"],
  [/lasagna/i, "lasagna"],
  [/quesadilla/i, "quesadilla"],
  [/mozzarella|mix platter/i, "mozz"],
  [/soup/i, "soup"],
  [/caesar|russian salad|special salad/i, "salad"],
  [/fish (strips|finger)|finger|chicken strips|stuff/i, "fishfinger"],
  [/karak|doodh patti|green tea/i, "chai"],
  [/ice tea/i, "icedtea"],
  [/lemonade|cooler|colada|lime|glacier|peach|shooting star|blue wolf|boba|slush|peace on the beach|juice/i, "mocktail"],
  [/daal|dal |vegetable handi|paneer handi/i, "karahi"],
  [/steak|tenderloin/i, "steak"],
  [/moroccan|mexican|tarragon|parmesan|mascava|italian|sicilian|fajita|chef's special|mushroom chicken|chicken mushroom/i, "grilled"],
  [/penne|arrabiata/i, "pasta"],
  [/sheesha|shisha|hookah/i, "hookah"],
  [/frappe|cold coffee|affogato/i, "frappe"],
  [/iced tea|tea orange|tea peach/i, "icedtea"],
  [/fizz|mocktail|mojito|margarita|lagoon/i, "mocktail"],
  [/smoothie/i, "smoothie"],
  [/shake/i, "shake"],
  [/chocolate|cocoa/i, "chocolate"],
  [/iced|ice |shaken|stroopwafel|cookie latte/i, "iced"],
  [/espresso|cortado|americano/i, "espresso"],
  [/latte|cappuccino|mocha|tiramisu|^tea$/i, "hot"],
  [/zinger|crispy chicken|tender/i, "zinger"],
  [/burger/i, "burger"],
  [/nachos/i, "nachos"],
  [/loaded/i, "loaded"],
  [/fries/i, "fries"],
  [/fish & chips|fish and chips/i, "fishchips"],
  [/alfredo/i, "alfredo"],
  [/mac/i, "mac"],
  [/pasta|linguine/i, "pasta"],
  [/prawn|whole fish|grilled fish/i, "prawn"],
  [/sandwich|club/i, "club"],
  [/karahi|handi/i, "karahi"],
  [/seekh|reshmi|kabab/i, "kebab"],
  [/tikka|boti|angara/i, "tikka"],
  [/chops|hunzei/i, "steak"],
  [/wings|chicken/i, "wings"],
  [/fruit salad/i, "fruit"],
  [/fish/i, "fishchips"],
  [/salad/i, "salad"],
  [/naan|chapati/i, "naan"],
  [/soup/i, "soup"],
  [/sheesha|shisha|hookah/i, "hookah"],
  [/ps5|vip|gaming|squad/i, "game"],
];

const TYPE: Record<string, string> = {
  hot: "hot", iced: "iced", frappe: "frappe", tea: "icedtea", mocktail: "mocktail", shake: "shake", burger: "burger",
  sandwich: "club", fries: "fries", curry: "karahi", bbq: "bbq", pasta: "pasta", bread: "naan", salad: "salad", soup: "soup",
  seafood: "prawn", chicken: "wings", sheesha: "hookah", game: "game",
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function poolKey(name: string, type: string) {
  return RULES.find(([r]) => r.test(name))?.[1] || TYPE[type] || "hot";
}

/** Per brand, hand out each pool's photos in turn down the menu, so neighbouring cards never repeat a photo. */
const ASSIGN: Partial<Record<Slug, Map<string, string>>> = {};
function assigned(slug: Slug) {
  let m = ASSIGN[slug];
  if (!m) {
    m = new Map();
    const next: Record<string, number> = {};
    for (const c of brands[slug].cats) for (const it of c.items) {
      const key = poolKey(it.n, it.t);
      const pool = P[key];
      const i = (next[key] ??= hash(slug + key) % pool.length);
      m.set(it.n, pool[i % pool.length]);
      next[key] = i + 1;
    }
    ASSIGN[slug] = m;
  }
  return m;
}

/** A photo id for a menu item: the cafe's own photo if it sent one, otherwise stock picked by name, then type. */
export function photoId(name: string, type: string) {
  const own = G.own[CUR]?.menu?.[slugify(name)];
  if (own) return own;
  const a = assigned(CUR).get(name);
  if (a) return a;
  const pool = P[poolKey(name, type)];
  return pool[hash(name) % pool.length];
}

export const photoFor = (name: string, type: string, w = 800, h?: number) => img(photoId(name, type), w, h);

/** Big atmosphere shots per brand, for the hero, story and CTA. */
export const SCENES: Record<Slug, { hero: string[]; story: string[]; cta: string; stats: string }> = {
  vox: {
    hero: ["1586011066531-f3a64f20d51d", "1772134141698-c47b78663c55", "1517701550927-30cf4ba1dba5", "1593443320739-77f74939d0da"],
    story: ["1520460095596-52dcd38c5f20", "1517701928392-16651ac1e944", "1783926014847-748a8074eb38"],
    cta: "1709364980707-5d75dad5e0f3",
    stats: "1783926014847-748a8074eb38",
  },
  barasti: {
    hero: ["1621275471769-e6aa344546d5", "1632158930341-46604b637a0f", "1694579740719-0e601c5d2437", "1655140026236-9292f2d3d3c6"],
    story: ["1680206893968-01fe5583f6b5", "1603496987351-f84a3ba5ec85", "1599487488170-d11ec9c172f0"],
    cta: "1632158929962-a929c9e87570",
    stats: "1705359573325-f2006d5e459f",
  },
  miami: {
    hero: ["1685345729575-7f059204c0cd", "1607857530433-585362935ff9", "1493711662062-fa541adb3fc8", "1762553901129-588842051ea0"],
    story: ["1562581146-d7000f1318d4", "1542751371-adc38448a05e", "1556035511-3168381ea4d4"],
    cta: "1558273246-57d22047406d",
    stats: "1785765904806-0d687601b0d5",
  },
  marina: {
    hero: ["1568901346375-23c9450c58cd", "1600891964092-4316c288032e", "1574238752695-675b86d49267", "1590846406792-0adc7f938f1d"],
    story: ["1726873800099-53f5496281e0", "1630175772812-3368aad7982d", "1546964124-0cce460f38ef"],
    cta: "1590846406792-0adc7f938f1d",
    stats: "1600891964092-4316c288032e",
  },
  ember: {
    hero: ["1701086732201-533370d341f4", "1567620832903-9fc6debc209f", "1635547821500-77542481940c", "1624583338957-4d155ca886dc"],
    story: ["1624583338957-4d155ca886dc", "1562581146-d7000f1318d4", "1650939986300-ce9609921fa7"],
    cta: "1562581146-d7000f1318d4",
    stats: "1650939986300-ce9609921fa7",
  },
  delights: {
    hero: ["1546964124-0cce460f38ef", "1513104890138-7c749659a591", "1603496987351-f84a3ba5ec85", "1632158930341-46604b637a0f"],
    story: ["1726873800099-53f5496281e0", "1776810250102-7459c4e0edc9", "1632158929962-a929c9e87570"],
    cta: "1632158929962-a929c9e87570",
    stats: "1615937657715-bc7b4b7962c1",
  },
  lafuma: {
    hero: ["1600891964092-4316c288032e", "1572802419224-296b0aeee0d9", "1595977514600-72cbc8376c38", "1621996346565-e3dbc646d9a9"],
    story: ["1615937657715-bc7b4b7962c1", "1654074517750-f854f7c27d62", "1546964124-0cce460f38ef"],
    cta: "1594041680534-e8c8cdebd659",
    stats: "1607013251379-e6eecfffe234",
  },
  amour: {
    hero: ["1711672284661-bd70e38f31b2", "1763207291761-e27bb059d851", "1517427294546-5aa121f68e8a", "1568254183919-78a4f43a2877"],
    story: ["1705972018470-a89eda1c6ce4", "1499636136210-6f4ee915583e", "1653491887846-781545ef38da"],
    cta: "1546237769-6f84ec1a512a",
    stats: "1571942948809-74637bfc59b9",
  },
  cafe1947: {
    hero: ["1599487488170-d11ec9c172f0", "1589302168068-964664d93dc0", "1697126248437-db26a30024c5", "1778634304493-23531df07739"],
    story: ["1633945274405-b6c8069047b0", "1555939594-58d7cb561ad1", "1544787219-7f47ccb76574"],
    cta: "1563379091339-03b21ab4a4f8",
    stats: "1708782341231-426344114ace",
  },
};

/** Hero slides: the cafe's own hero photos if it has sent any, otherwise the stock set. */
export const heroIds = (slug: Slug) => (G.own[slug]?.hero?.length ? G.own[slug]!.hero! : SCENES[slug].hero);
/** Extra gallery photos the cafe dropped into public/<brand>/gallery. */
export const ownGallery = (slug: Slug) => (G.own[slug]?.gallery || []).map((id) => img(id, 1200));

/** The dish reel: signature items first, then one from each category in turn, no repeated photo. */
export function reelItems(b: Brand): Item[] {
  const all = b.cats.flatMap((c) => c.items);
  const order: Item[] = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as Item[];
  const longest = Math.max(...b.cats.map((c) => c.items.length));
  for (let r = 0; r < longest; r++) for (const c of b.cats) if (c.items[r]) order.push(c.items[r]);
  const seen = new Set<string>();
  return order.filter((it) => { const k = photoId(it.n, it.t); if (seen.has(k) || it.n === "Still Water") return false; seen.add(k); return true; }).slice(0, 10);
}

/** Every [photo id, width, height] a brand's page shows, for the build to prepare. */
export function plan(b: Brand): [string, number, number][] {
  setBrand(b.slug);
  const out: [string, number, number][] = [];
  const add = (id: string, s: readonly [number, number]) => out.push([id, s[0], s[1]]);
  const all = b.cats.flatMap((c) => c.items);
  const sig = b.signature.map((n) => all.find((i) => i.n === n)).filter(Boolean) as Item[];
  all.forEach((it) => { add(photoId(it.n, it.t), SZ.card); add(photoId(it.n, it.t), SZ.thumb); });
  reelItems(b).forEach((it) => add(photoId(it.n, it.t), SZ.reel));
  sig.forEach((it) => { add(photoId(it.n, it.t), SZ.story); add(photoId(it.n, it.t), SZ.pick); });
  const sc = SCENES[b.slug];
  heroIds(b.slug).forEach((id) => { add(id, SZ.hero); add(id, SZ.heroSm); });
  add(sc.story[0], [900, 1150]); add(sc.story[1], [600, 600]); add(sc.stats, SZ.wide); add(sc.cta, SZ.wide);
  return out;
}
