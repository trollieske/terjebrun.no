# terjebrun.no

Nettside for **TBP Music Management** — Terje Brun-Pedersen, agent, arrangør og
produsent i Drammen.

Ny utgave av den gamle Wix-siden: rask, enkel, og med artistene i fokus.
Ren HTML/CSS/JS uten rammeverk og uten tredjeparter i det kritiske løpet.

> **Designversjoner:** `design-v1` (tag og branch) er første versjon slik kunden
> godkjente den — stor helt med «Først artisten. Så rommet.» og artistrutenett.
> `main` har dagens versjon: lav helt, TBP-logo og artistkarusell.
> Hent den gamle tilbake med `git checkout design-v1` (eller se på GitHub).

## Kom i gang

```bash
npm run build     # bygger HTML fra data/ og src/
npm run serve     # serverer på http://localhost:8000
```

Det er ingen avhengigheter å installere. Node brukes bare til byggeskriptet.

## Slik henger det sammen

```
data/
  artister.json       alle artister: navn, rolle, bilder, bio, lenker
  produksjoner.json   utvalgte produksjoner med tekst og bilde
  video.json          YouTube-videoer (id, tittel, år, hvor de vises)
src/
  index.html          innholdet på forsiden (uten hode/bunn)
  produksjoner.html   innholdet på produksjonssiden
scripts/
  build.mjs           bygger alle sider
  sjekk-lenker.py     sjekker at ingen lokale lenker eller bilder er døde
css/style.css         all styling
js/site.js            karusell + YouTube-avspilling på klikk (ca. 90 linjer)
assets/
  artister/           portretter i 400 og 800 px (webp)
  bilder/             scene- og produksjonsbilder i 900 og 1600 px (webp)
  video/              miniatyrbilder til videoene (webp)
  fonts/              Fraunces + Schibsted Grotesk (selvhostet, latin)
  logo/               merket, favicon, apple-touch-icon
dev/merke.html        forslagsside for logoen (noindex, ikke del av siden)
```

**Genererte filer:** `index.html`, `produksjoner.html`, `artister/*.html` og
`sitemap.xml` skrives av `npm run build`. Ikke rediger dem direkte — endre
`data/*.json` eller `src/*.html` og bygg på nytt.

## Legge til eller endre en artist

1. Legg bildet i `assets/artister/` i to størrelser: `<filnavn>-800.webp` og
   `<filnavn>-400.webp` (kvadratisk utsnitt, webp).
2. Legg artisten inn i `data/artister.json` med `slug`, `navn`, `rolle`,
   `bilde`, `kort` (én setning), `bio` (avsnitt) og `lenker`.
3. Kjør `npm run build`.

Nytt innhold i en eksisterende bio kan skrives rett inn i `bio`-lista.
Rekkefølgen i fila er rekkefølgen på nettsiden.

## Karusellen med artister

Artistene ligger rett under toppen som en sidelengs karusell: 20 kort i 4:5
med navn og rolle over bildet. Den kan brukes med piler, piltaster, musescroll,
styrefelt og sveip, og telleren viser hvor langt man har kommet.

Karusellen er ren CSS-pluss litt JavaScript (`js/site.js`). Uten JavaScript
fungerer den fortsatt — da bare uten piler og teller. Vil man i stedet ha et
rutenett på hele stallen, ligger den varianten i `design-v1`.

## Bilder

Alle bilder er hentet fra den gamle nettsiden og er pressbilder fra artistene.
Konsertfoto er tatt av **Børre Erik Helgerud**. Enkeltkrediteringer står på
artistsidene der de er kjent.

Bildene optimaliseres med ImageMagick:

```bash
magick inn.jpg -auto-orient -resize '1600x1600^' -gravity north -extent 1:1 \
  -resize 800x800 -strip -quality 80 ut-800.webp
```

## Logo og navn

Navnet i låsningen er **TBP Music Management** (som på den gamle siden), med
Terje Brun-Pedersen som undertittel. Det er bare tekst — skal han heller bruke
«TBP Kultur», endrer vi `MERKE_NAVN` i `scripts/build.mjs`.

Merket ligger i `assets/logo/` og vises på `dev/merke.html` (åpne filen i
nettleseren). Det er geometrisk — scene, stativ og en tone — og fungerer ned
til 16 px uten egen skrift.

## Ytelse og tilgjengelighet

- Egenhostede variable fonter (114 kB til sammen), ingen tredjepartsforespørsler.
- Alle bilder i webp med `srcset`, faste mål og `loading="lazy"` (unntatt hero).
- YouTube lastes som bilde; spilleren kobles først inn ved klikk
  (`youtube-nocookie.com`). Uten JavaScript går lenken til YouTube.
- Ett stilkark, ca. 20 linjer JavaScript. Ingen rammeverk.
- Semantisk HTML, `alt`-tekster, `aria-current`, hopp-til-innhold, fokusringer
  og `prefers-reduced-motion`.
- Mørkt tema følger systemvalget.
- Kommentarfelt for lesbarhet er holdt til et minimum for å holde filene små.

## Publisering

Siden er helt statisk og kan lastes opp hvor som helst (webhotell via FTP,
Cloudflare Pages, Netlify, GitHub Pages). Ingen byggesteg kreves på serveren
hvis de genererte filene sjekkes inn — noe de er.

Husk å endre `NETTSTED` i `scripts/build.mjs` hvis domenet blir et annet.

## Ting som bør avklares med Terje

- Portrettbildet i «Om»-seksjonen er hentet fra den gamle siden — er det ham,
  eller skal vi bruke et nyere bilde?
- Bildet av Kjetil Bjerkestrand & Mathias Eick var et trebilde på den gamle
  siden (tre ulike portretter). Vi bruker de to siste. Stemmer det?
- Noen pressbilder har lav oppløsning (Hedvig Mollestad, Gryting). Nye bilder
  vil gjøre størst forskjell der.
- CV-en lå som PDF på den gamle siden og er ikke med. Legg den i
  `assets/` og si ifra, så lenker vi til den.
- Artister som hadde egen side på den gamle siden, men ikke står i stallen i
  dag: Frode Kjekstad og Eli Kristin Hanssveen. Skal de inn?