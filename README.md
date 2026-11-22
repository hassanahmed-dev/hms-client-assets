# hms-client-assets
Owner-approved brand assets for client websites (Vox Coffee, Barasti, Miami Nights). Used with the owners permission.

## Cafe ki apni photos lagana (automatic)

Photo ko sahi folder mein daalo, commit + push karo, phir deploy. Build khud WebP bana kar site par laga dega.

| Folder | Kya hota hai |
|---|---|
| `sites/public/<brand>/hero/` | Hero ki badi photos (stock hero ki jagah). Landscape, kam se kam 1600px chaudi |
| `sites/public/<brand>/menu/` | Menu item ki photo. File ka naam item ke naam se: "Malai Boti" -> `malai-boti.jpg`, "Fish & Chips" -> `fish-and-chips.jpg` |
| `sites/public/<brand>/gallery/` | "A look inside" gallery mein jud jaati hain |

`<brand>` = `vox`, `barasti` ya `miami`. jpg, jpeg, png, webp sab chalti hain.
Stock photos bhi build ke waqt `public/stock/` mein download hoti hain (git mein nahi jaati).
