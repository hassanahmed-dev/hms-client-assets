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
  karahi: ["1603496987351-f84a3ba5ec85", "1694579740719-0e601c5d2437", "1708782340793-ec5f2159a689", "1572265045111-69a78b458fa6", "1631292784640-2b24be784d5d", "1708782344490-9026aaa5eec7", "1764304733301-3a9f335f0c67", "1696950168808-0ccf6ae6882d"],
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
  chai: ["1544787219-7f47ccb76574", "1619581073186-5b4ae1b0caad", "1720355340824-cd9f183ab0e3", "1580600160741-4556fe4413b5", "1636920272028-c27f1ae474c3"],
  toast: ["1766981725120-4d39e6c9ad05", "1595044643502-616eeebbdff3", "1788462613181-3d3c2b62e710"],
  pizza: ["1513104890138-7c749659a591", "1769458313988-2cd932ab2777", "1776810250102-7459c4e0edc9"],
  bread: ["1608198093002-ad4e005484ec", "1612539466296-4ecf1db303e3", "1568254183919-78a4f43a2877"],
  cookie: ["1499636136210-6f4ee915583e", "1571165841024-2ce92069301d"],
  biscuit: ["1584847801423-852691e41bc7", "1639678112667-328681eadd9b"],
  croissant: ["1623334044303-241021148842", "1691480162735-9b91238080f6", "1763207291761-e27bb059d851", "1693422662973-fcdd4285c546"],
  tart: ["1653491887846-781545ef38da", "1670819916757-e8d5935a6c65", "1614174486496-344ef3e9d870", "1628838617281-065549dd37fe"],
  pastry: ["1517427294546-5aa121f68e8a", "1582716401301-b2407dc7563d", "1602663491496-73f07481dbea", "1682596044365-eb5c3bc51555"],
  puff: ["1682263167429-0dbcf2c1e127", "1778489926852-b14c57bab23a", "1600521853186-93b88b3a07b0", "1622941367239-8acd68fa946d"],
  daal: ["1727018742095-14c9a05aa71a", "1630409351211-d62ab2d24da4", "1727018953313-403d17215a1b", "1546833999-b9f581a1996d"],
  paratha: ["1668357530437-72a12c660f94", "1580064003296-29deb3521370", "1708782343717-be4ea260249a", "1683533743190-89c9b19f9ea6", "1683533761804-5fc12be0f684"],
  benedict: ["1608039829572-78524f79c4c7", "1674315604997-bc5fcaa1ac32", "1779332500302-c0830964b9b2", "1720357146728-2c7544cdbda2"],
  shakshuka: ["1590412200988-a436970781fa", "1614570218825-c2a3be79b0fd", "1520218576172-c1a2df3fa5fc", "1697546307745-c05002aa1c1e"],
  omelette: ["1646579933415-92109f9805df", "1709754521379-00166805eea4", "1677137261161-0095c10418ef", "1639669794539-952631b44515"],
  grillfish: ["1665401015549-712c0dc5ef85", "1666437469803-c6d5ba853a50", "1792460238294-130ac0a0a47e", "1785567773155-c673cf8297ec", "1700760933394-976f1d27dff2"],
  waffle: ["1734772045171-2af52aea78af", "1683040146484-a1f241a7c409", "1739907283389-2a2c05deb680", "1737700088850-d0b53f9d39ec", "1613483515012-8879be29b578"],
  kunafa: ["1778447812923-88a9e3e6b567", "1778447830669-8fe9626ed738"],
  dough: ["1649634437312-c005a922d448", "1592173376801-185310a68dea", "1634188023615-7e08901193b6", "1639678114484-fc09b70cad42"],
  gelato: ["1648971413826-8377e3c65039", "1780444122216-dad92e90090f", "1628815870980-f416105d89b3", "1580915411954-282cb1b0d780", "1638212291123-8d20f5353333"],
  lava: ["1673551490812-eaee2e9bf0ef", "1600326145308-d7d5a04f4ce6", "1641424795072-a108a63c4b1c", "1766413580427-88906bbd722d", "1617305855058-336d24456869"],
  matcha: ["1515823064-d6e0c04616a7", "1766426910014-63a302fa137e", "1582785513054-8d1bf9d69c1a", "1717603545586-208c9d67fcbe", "1727850005779-1e24cac382d4"],
  bits: ["1613435392903-f28f66534cf3", "1756652242630-5a90c89a99cd", "1699865580838-8347da7f218c", "1589199750869-334ae4187406"],
  dessertcup: ["1710106519622-8c49d0bcff2f", "1586040140378-b5634cb4c8fc", "1763585055859-a1fffe9cb8f0", "1782503708390-4e5fff098d57"],
  dumpling: ["1543198432-a20fa3055570", "1523905330026-b8bd1f5f320e", "1664138218128-2dcf791a9d27", "1626322751504-930506dd41ca"],
  gyoza: ["1738681336104-608b4e7dc3b0", "1788603378122-1c3708b1a26a", "1638502521795-89107ac5e246", "1703080173985-936514c7c8bd", "1612432505109-f28e7a5c351a"],
  rawdump: ["1589047133481-02b4a5327d89", "1780375578701-80a4b979c323"],
  soupdump: ["1602273660127-a0000560a4c1"],
  ramen: ["1612929633738-8fe44f7ec841", "1591814468924-caf88d1232e1", "1588001291548-948f55922bfd", "1695389189682-bab675486f83", "1720873913894-43141d6f4359"],
  kfc: ["1586793783658-261cddf883ef", "1771384552858-feb0574f958d", "1687966699414-095ca9c35593", "1566918214014-a3b3e0132267", "1624726175512-19b9baf9fbd1"],
  gaming: ["1758410473735-c76baff30a79", "1758410473607-e78a23fd6e57", "1758410473598-ef957adbf57b", "1583749022465-23f4fc800957"],
  eclair: ["1582217308209-2207886c55bd", "1613992258436-7d744cb20893"],
  hotpot: ["1784429611794-aecb6ebaef48", "1703945530505-2f06e3e1cf97", "1614104030967-5ca61a54247b", "1663559147132-8138438ef2a9", "1662655552348-4ad26f9d4e75", "1682496178113-6275890f1fd7"],
  hotdog: ["1638368593249-7cadb261e8b3", "1599599810694-b5b37304c041", "1721648373511-fb220d7f043f", "1776260486395-2173d61e344c", "1627054248949-21f77275a15f"],
  samosa: ["1601050690597-df0568f70950", "1772729996007-40bad08b3c40", "1601050690294-397f3c324515", "1732519970445-8f2d6998961f"],
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
  [/solo gamer|arcade racer|ultimate house special|duo battle|wrap & drift|pro gamer|platter party|chinese & smash|squad hangout|friends catchup/i, "gaming"],
  [/fire dog|cheese dog|bun n dog|hot ?dog/i, "hotdog"],
  [/samosa/i, "samosa"],
  [/^(gur wali chai|chai \(|chai without)/i, "chai"],
  [/anda gh(o|u)tala/i, "omelette"],
  [/katakut/i, "karahi"],
  [/mexican zinger/i, "zinger"],
  [/^crispy chicken$|crumby chicken/i, "friedchicken"],
  [/chargha|chargah|cheesy angry chicken|tornados chicken/i, "grilled"],
  [/ice cream$/i, "gelato"],
  [/cashewnut chicken|korean (beef|chicken)|thai asian beef/i, "chinese"],
  [/signature fish/i, "grillfish"],
  [/\bpide$/i, "pizza"],
  [/fried platter/i, "fishfinger"],
  [/hotpot|^sausages$|mushrooms & broccoli|noodles \(rice|sesame sauce/i, "hotpot"],
  [/surmai|dangri|white kund|pomfret|pangash/i, "grillfish"],
  [/daal chawal|prawn rice/i, "rice"],
  [/^chicken grill$|half chicken grill|^chicken bihari$/i, "grilled"],
  [/\bdaal\b|\bchana\b|bhindi|sabzi/i, "daal"],
  [/boiled egg/i, "omelette"],
  [/^(?!.*fried chicken).*\bplatter$/i, "bbq"],
  [/kahwa|kawah|sulemani|cardamom tea|shilajit chai/i, "chai"],
  [/shashlik boti/i, "tikka"],
  [/chili dry|schezwan chicken|garlic chicken|oyster chicken/i, "chinese"],
  [/bbq paratha/i, "paratha"],
  [/kebab cheese roll/i, "wrap"],
  [/ wave$|belgium delight/i, "pancake"],
  [/elaichi chai|kashmiri chai/i, "chai"],
  [/^kehwa/i, "chai"],
  [/french kiss latte/i, "iced"],
  [/butter pan cake/i, "pancake"],
  [/singaporean rice/i, "rice"],
  [/beef mexican/i, "steak"],
  [/family platter|bbq rice platter/i, "bbq"],
  [/stuff cheese burger|crunchy fire chicken|stuffed beef burger|chicken bombastic/i, "burger"],
  [/mexican sandwich/i, "club"],
  [/sizzling brownie/i, "brownie"],
  [/sizzling boti|^green chicken$/i, "tikka"],
  [/paratha$/i, "paratha"],
  [/broast/i, "friedchicken"],
  [/mongolian|garlic chilli beef|dry chilli/i, "chinese"],
  [/fish sriracha|tandoori fish/i, "grillfish"],
  [/doodh pati/i, "chai"],
  [/benedict|steak and eggs/i, "benedict"],
  [/stuffed mushroom chicken|tuscany chicken/i, "grilled"],
  [/shakshuka|turkish breakfast/i, "shakshuka"],
  [/omelette/i, "omelette"],
  [/snapper|sole|fish tikka/i, "grillfish"],
  [/chipotle platter|glitch special platter|bbq platter/i, "bbq"],
  [/ pizza$/i, "pizza"],
  [/lahori fried chicken/i, "friedchicken"],
  [/soup dumpling/i, "soupdump"],
  [/uncooked dumpling/i, "rawdump"],
  [/steamed dumpling/i, "dumpling"],
  [/gyoza|dumpling/i, "gyoza"],
  [/numbing noodle|cheesy crush|ramen/i, "ramen"],
  [/old school chow/i, "chowmein"],
  [/korean fried chicken|honey mustard chicken/i, "kfc"],
  [/waffle/i, "waffle"],
  [/kunafa$/i, "kunafa"],
  [/cookie dough|brownie dough|toffee date/i, "dough"],
  [/gelato slice/i, "gelato"],
  [/lava cake/i, "lava"],
  [/dough bits/i, "bits"],
  [/milk bowl|tiramisu bowl|pod$/i, "dessertcup"],
  [/matcha/i, "matcha"],
  [/coffee sundae/i, "frappe"],
  [/skillet cookie|chunk cookie/i, "cookie"],
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

export function poolKey(name: string, type: string) {
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
  sugarfix: {
    hero: ["1734772045171-2af52aea78af", "1649634437312-c005a922d448", "1673551490812-eaee2e9bf0ef", "1648971413826-8377e3c65039"],
    story: ["1601205741712-b261aff33a7d", "1710106519622-8c49d0bcff2f", "1683040146484-a1f241a7c409"],
    cta: "1641424795072-a108a63c4b1c",
    stats: "1739907283389-2a2c05deb680",
  },
  glitch: {
    hero: ["1758410473735-c76baff30a79", "1572802419224-296b0aeee0d9", "1758410473607-e78a23fd6e57", "1513104890138-7c749659a591"],
    story: ["1758410473598-ef957adbf57b", "1632158930341-46604b637a0f", "1583749022465-23f4fc800957"],
    cta: "1758410473735-c76baff30a79",
    stats: "1621996346565-e3dbc646d9a9",
  },
  steamy: {
    hero: ["1523905330026-b8bd1f5f320e", "1612929633738-8fe44f7ec841", "1738681336104-608b4e7dc3b0", "1586793783658-261cddf883ef"],
    story: ["1543198432-a20fa3055570", "1591814468924-caf88d1232e1", "1788603378122-1c3708b1a26a"],
    cta: "1695389189682-bab675486f83",
    stats: "1638502521795-89107ac5e246",
  },
  lalounge: {
    hero: ["1558368417-57d31049c609", "1600891964092-4316c288032e", "1592494804071-faea15d93a8a", "1559742811-822873691df8"],
    story: ["1773738214145-60c47b5f317d", "1615937657715-bc7b4b7962c1", "1766589758356-587980dff91d"],
    cta: "1517957096399-3a4e3d34d95e",
    stats: "1546964124-0cce460f38ef",
  },
  dejavu: {
    hero: ["1632158930341-46604b637a0f", "1603496987351-f84a3ba5ec85", "1600891964092-4316c288032e", "1589302168068-964664d93dc0"],
    story: ["1705359573325-f2006d5e459f", "1694579740719-0e601c5d2437", "1615937657715-bc7b4b7962c1"],
    cta: "1632158929962-a929c9e87570",
    stats: "1599487488170-d11ec9c172f0",
  },
  chailounge: {
    hero: ["1720355340824-cd9f183ab0e3", "1772993628956-3655daf77d93", "1680206893968-01fe5583f6b5", "1636920272028-c27f1ae474c3"],
    story: ["1765646772320-51e13b03f479", "1580600160741-4556fe4413b5", "1694579740719-0e601c5d2437"],
    cta: "1719445096577-bc9b39ada75d",
    stats: "1643553016671-5bbdd79e9265",
  },
  cupshup: {
    hero: ["1765646772320-51e13b03f479", "1668357530437-72a12c660f94", "1606755962773-d324e0a13086", "1632158929962-a929c9e87570"],
    story: ["1770820050126-7841295722b5", "1683533761804-5fc12be0f684", "1720355340824-cd9f183ab0e3"],
    cta: "1772993628956-3655daf77d93",
    stats: "1580064003296-29deb3521370",
  },
  roofyard: {
    hero: ["1765646772320-51e13b03f479", "1680206893968-01fe5583f6b5", "1694579740719-0e601c5d2437", "1632158930341-46604b637a0f"],
    story: ["1719445096577-bc9b39ada75d", "1603496987351-f84a3ba5ec85", "1705359573325-f2006d5e459f"],
    cta: "1772993628956-3655daf77d93",
    stats: "1632158929962-a929c9e87570",
  },
  hawaii: {
    hero: ["1558368417-57d31049c609", "1600891964092-4316c288032e", "1592494804071-faea15d93a8a", "1559742811-822873691df8"],
    story: ["1776639068934-81726875a011", "1615937657715-bc7b4b7962c1", "1766589758356-587980dff91d"],
    cta: "1517957096399-3a4e3d34d95e",
    stats: "1546964124-0cce460f38ef",
  },
  terrace: {
    hero: ["1720355340824-cd9f183ab0e3", "1765646772320-51e13b03f479", "1593068654099-10ad31300e45", "1636920272028-c27f1ae474c3"],
    story: ["1772993628956-3655daf77d93", "1580600160741-4556fe4413b5", "1719445096577-bc9b39ada75d"],
    cta: "1770820050126-7841295722b5",
    stats: "1643553016671-5bbdd79e9265",
  },
  mamu: {
    hero: ["1665401015549-712c0dc5ef85", "1559742811-822873691df8", "1666437469803-c6d5ba853a50", "1723325697529-6e2679650b39"],
    story: ["1792460238294-130ac0a0a47e", "1688084468401-4938b073aef2", "1785567773155-c673cf8297ec"],
    cta: "1700760933394-976f1d27dff2",
    stats: "1514944288352-fffac99f0bdf",
  },
  mykarachi: {
    hero: ["1720355340824-cd9f183ab0e3", "1668357530437-72a12c660f94", "1765646772320-51e13b03f479", "1636920272028-c27f1ae474c3"],
    story: ["1772993628956-3655daf77d93", "1580600160741-4556fe4413b5", "1683533761804-5fc12be0f684"],
    cta: "1719445096577-bc9b39ada75d",
    stats: "1643553016671-5bbdd79e9265",
  },
  majestic: {
    hero: ["1708782340793-ec5f2159a689", "1603496987351-f84a3ba5ec85", "1631292784640-2b24be784d5d", "1694579740719-0e601c5d2437"],
    story: ["1572265045111-69a78b458fa6", "1544787219-7f47ccb76574", "1708782344490-9026aaa5eec7"],
    cta: "1764304733301-3a9f335f0c67",
    stats: "1696950168808-0ccf6ae6882d",
  },
  kebabmore: {
    hero: ["1632158930341-46604b637a0f", "1680206893968-01fe5583f6b5", "1694579740719-0e601c5d2437", "1600891964092-4316c288032e"],
    story: ["1705359573325-f2006d5e459f", "1599487488170-d11ec9c172f0", "1615937657715-bc7b4b7962c1"],
    cta: "1632158929962-a929c9e87570",
    stats: "1572265045111-69a78b458fa6",
  },
  mamachai: {
    hero: ["1720355340824-cd9f183ab0e3", "1765646772320-51e13b03f479", "1593068654099-10ad31300e45", "1668357530437-72a12c660f94"],
    story: ["1772993628956-3655daf77d93", "1636920272028-c27f1ae474c3", "1719445096577-bc9b39ada75d"],
    cta: "1770820050126-7841295722b5",
    stats: "1643553016671-5bbdd79e9265",
  },
  raya: {
    hero: ["1765646772320-51e13b03f479", "1719445096577-bc9b39ada75d", "1720355340824-cd9f183ab0e3", "1772993628956-3655daf77d93"],
    story: ["1770820050126-7841295722b5", "1580600160741-4556fe4413b5", "1636920272028-c27f1ae474c3"],
    cta: "1776639068934-81726875a011",
    stats: "1643553016671-5bbdd79e9265",
  },
  central: {
    hero: ["1668357530437-72a12c660f94", "1632158930341-46604b637a0f", "1580064003296-29deb3521370", "1765646772320-51e13b03f479"],
    story: ["1683533761804-5fc12be0f684", "1705359573325-f2006d5e459f", "1720355340824-cd9f183ab0e3"],
    cta: "1632158929962-a929c9e87570",
    stats: "1708782343717-be4ea260249a",
  },
  bhaijaan: {
    hero: ["1720355340824-cd9f183ab0e3", "1668357530437-72a12c660f94", "1632158930341-46604b637a0f", "1626700051175-6818013e1d4f"],
    story: ["1636920272028-c27f1ae474c3", "1580064003296-29deb3521370", "1727280376746-b89107a5b0df"],
    cta: "1544787219-7f47ccb76574",
    stats: "1683533743190-89c9b19f9ea6",
  },
  dawatinn: {
    hero: ["1708782340793-ec5f2159a689", "1603496987351-f84a3ba5ec85", "1680206893968-01fe5583f6b5", "1631292784640-2b24be784d5d"],
    story: ["1572265045111-69a78b458fa6", "1765360024331-25b63e85272e", "1697155406014-04dc649b0953"],
    cta: "1694579740719-0e601c5d2437",
    stats: "1632158929962-a929c9e87570",
  },
  bhaiya: {
    hero: ["1568901346375-23c9450c58cd", "1572802419224-296b0aeee0d9", "1606755962773-d324e0a13086", "1607013251379-e6eecfffe234"],
    story: ["1567620832903-9fc6debc209f", "1630384060421-cb20d0e0649d", "1666304752980-678d5c35c911"],
    cta: "1586190848861-99aa4a171e90",
    stats: "1713330801172-03f8d1c0dde7",
  },
  hotpot: {
    hero: ["1784429611794-aecb6ebaef48", "1703945530505-2f06e3e1cf97", "1614104030967-5ca61a54247b", "1611345157614-26d3bdd10c93"],
    story: ["1777113310299-c3e41dec4e0f", "1663559147132-8138438ef2a9", "1543198432-a20fa3055570"],
    cta: "1662655552348-4ad26f9d4e75",
    stats: "1568901346375-23c9450c58cd",
  },
  karamkhan: {
    hero: ["1544787219-7f47ccb76574", "1619581073186-5b4ae1b0caad", "1708782343717-be4ea260249a", "1727018742095-14c9a05aa71a"],
    story: ["1580600160741-4556fe4413b5", "1630409351211-d62ab2d24da4", "1683533761804-5fc12be0f684"],
    cta: "1720355340824-cd9f183ab0e3",
    stats: "1636920272028-c27f1ae474c3",
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
