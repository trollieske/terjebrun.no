# terjebrun.no

Nettside for **TBP Music Management** — Terje Brun-Pedersen, agent, arrangør og
produsent i Drammen.

Ny utgave av den gamle Wix-siden: rask, enkel, og med artistene i fokus.
Ren HTML/CSS/JS uten rammeverk og uten tredjeparter i det kritiske løpet.

> **Designversjoner:** `design-v1` og `design-v2` ligger som tagger og brancher.
> v1 = stor helt med «Først artisten. Så rommet.» og artistrutenett.
> v2 = lav helt, TBP-logo, artistkarusell med bilder.
> `main` = dagens: heltevideo, navnestripe som ruller, artistrutenett og
> Apple-aktig typografi. Hent en eldre versjon med `git checkout design-v1`.

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
  video/helt-av1.webm heltevideo (AV1, 737 kB) + helt.mp4 (H.264, 1,1 MB)
  fonts/              Inter (selvhostet, latin, vanlig + kursiv)
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

## Skrift

`-apple-system` først: på Mac og iPhone får besøkende Apples egen SF Pro, som er
nøyaktig den looken vi er ute etter (den er en del av operativsystemet, ikke noe
vi låner). Alle andre får **Inter**, den nærmeste frie slektningen — selvhostet
i `assets/fonts/` (71 kB, variabel vekt 300–700, pluss kursiv som bare lastes på
artistsidene der det finnes sitater). Ingen Google-kall.

Vil man bytte skrift senere, holder det å endre `--skrift` og `@font-face` i
`css/style.css`.

## Heltevideoen

Videoen bak overskriften er klippet av Terjes egen YouTube-video
(«Gryting, far og sønner», N-RyQVjLWyY). Originalen blir liggende på YouTube —
vi bruker bare et kort, lydløst utsnitt.

- 12 sekunder, 1280×720, 25 fps, uten lyd, satt sammen i loop med en
  ett sekunds overtoning til sitt eget opphav, så den går i ett uten hopp.
- To formater: `helt-av1.webm` (737 kB) og `helt.mp4` som reserve for Safari
  (1,1 MB). Nettleseren velger selv det minste den støtter.
- `helt-poster-1600.webp` (66 kB) ligger under og er det første bildet på
  skjermen. Videoen lastes først etter `load`, og hoppes helt over hvis
  brukeren har «reduser bevegelse» eller datasparemodus på.

Slik lages den på nytt (bytt tidskoden `-ss` for et annet utsnitt):

```bash
yt-dlp -f 136 -o kilde.mp4 "https://www.youtube.com/watch?v=N-RyQVjLWyY"
# 13 sekunder inn, 12 ut, med ett sekunds overtoning til sitt eget opphav:
ffmpeg -ss 94 -t 13 -i kilde.mp4 -filter_complex \
 "[0:v]split[a][b];[a]trim=0:12,setpts=PTS-STARTPTS,fps=25[main];\
  [b]trim=0:1,setpts=PTS-STARTPTS,fps=25[head];\
  [main][head]xfade=transition=fade:duration=1:offset=11,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 -preset medium loop.mp4
ffmpeg -i loop.mp4 -an -c:v libsvtav1 -crf 42 -preset 6 helt-av1.webm
ffmpeg -i loop.mp4 -an -c:v libx264 -crf 30 -preset slow -movflags +faststart helt.mp4
ffmpeg -i loop.mp4 -frames:v 1 -y poster.png
```

## Navnestripa

Under helten ruller artistnavnene forbi av seg selv (ren CSS-animasjon på
`transform`, som går på grafikkortet). Listen ligger to ganger i markupen, slik
at den går i ett uten hopp; den andre kopien er `aria-hidden`. Den stopper når
man holder musen over eller tabber inn i den, og står helt stille for dem som
har «reduser bevegelse» på.

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