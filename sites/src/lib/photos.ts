/**
 * Representative food, drink and venue photography from Unsplash (free licence, hotlinked from
 * images.unsplash.com). These stand in until each cafe sends its own shoots.
 */
export const img = (id: string, w = 900, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${w}${h ? `&h=${h}` : ""}`;

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
  karahi: ["1694579740719-0e601c5d2437", "1603496987351-f84a3ba5ec85", "1652545296892-3787063f8b4d"],
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
  steak: ["1600891964092-4316c288032e", "1615937657715-bc7b4b7962c1", "1546964124-0cce460f38ef"],
  salad: ["1607532941433-304659e8198a", "1546793665-c74683f339c1", "1550304943-4f24f54ddde9"],
  fruit: ["1519996529931-28324d5a630e", "1641642400143-6be68f1a0918", "1641642399576-487909d0ddbc"],
  naan: ["1697155406014-04dc649b0953", "1640625314547-aee9a7696589", "1655979284091-eea0e93405ee"],
  soup: ["1665593998976-d957f2827fe7", "1665594051407-7385d281ad76"],
  hookah: ["1685345729575-7f059204c0cd", "1630175772812-3368aad7982d", "1574238752695-675b86d49267", "1635547821500-77542481940c", "1562581146-d7000f1318d4", "1701086732201-533370d341f4"],
  game: ["1493711662062-fa541adb3fc8", "1542751371-adc38448a05e", "1774105416309-088a6205c974"],
  neon: ["1607857530433-585362935ff9", "1785765904806-0d687601b0d5", "1558273246-57d22047406d", "1556035511-3168381ea4d4", "1762553901129-588842051ea0"],
  water: ["1559496417-e7f25cb247f3"],
};

const RULES: [RegExp, string][] = [
  [/water/i, "water"],
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
  [/prawn|whole fish/i, "prawn"],
  [/sandwich|club/i, "club"],
  [/karahi|handi/i, "karahi"],
  [/seekh|reshmi|kabab/i, "kebab"],
  [/tikka|boti|angara/i, "tikka"],
  [/chops|hunzei/i, "steak"],
  [/wings|chicken/i, "wings"],
  [/fruit/i, "fruit"],
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

/** A photo id for a menu item, picked by its name first, then by its type. */
export function photoId(name: string, type: string) {
  const key = RULES.find(([r]) => r.test(name))?.[1] || TYPE[type] || "hot";
  const pool = P[key];
  return pool[hash(name) % pool.length];
}

export const photoFor = (name: string, type: string, w = 800, h?: number) => img(photoId(name, type), w, h);

/** Big atmosphere shots per brand, for the hero, story and CTA. */
export const SCENES: Record<"vox" | "barasti" | "miami", { hero: string[]; story: string[]; cta: string; stats: string }> = {
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
};
