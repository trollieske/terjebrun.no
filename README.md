# terjebrun.no

Nettside for **TBP Music Management** — Terje Brun-Pedersen, agent, arrangør og
produsent i Drammen.

Ny utgave av den gamle Wix-siden: rask, enkel, og med artistene i fokus.
Ren HTML/CSS/JS uten rammeverk og uten tredjeparter i det kritiske løpet.

> **Designversjoner:** `design-v1` og `design-v2` ligger som tagger og brancher.
> v1 = stor helt med «Først artisten. Så rommet.» og artistrutenett.
> v2 = lav helt, TBP-logo, artistkarusell med bilder.
> `main` = dagens: artistene først — ingen helt og ingen navnestripe, bare
> artistrutenettet — med TBP-merket i toppmenyen og Apple-aktig typografi. Hent en eldre versjon med `git checkout design-v1`.

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
  bilder.json         bildene i galleriet (fil, bildetekst, hvor de vises)
src/
  index.html          innholdet på forsiden (uten hode/bunn)
  bilder.html         innholdet på billedsiden
  produksjoner.html   innholdet på produksjonssiden
scripts/
  build.mjs           bygger alle sider
  sjekk-lenker.py     sjekker at ingen lokale lenker eller bilder er døde
css/style.css         all styling
js/site.js            fargetema + YouTube-avspilling på klikk
assets/
  artister/           portretter i 400 og 800 px (webp)
  bilder/             scene- og produksjonsbilder i 900 og 1600 px (webp)
  video/              miniatyrbilder til videoene (webp)
  fonts/              Inter (selvhostet, latin, vanlig + kursiv)
  logo/               tbp-merke.svg (merket i toppmenyen), favicon, apple-touch-icon
dev/merke.html        forslagsside for logoen (noindex, ikke del av siden)
```

**Genererte filer:** `index.html`, `bilder.html`, `produksjoner.html`,
`artister/*.html` og
`sitemap.xml` skrives av `npm run build`. Ikke rediger dem direkte — endre
`data/*.json` eller `src/*.html` og bygg på nytt.

**Forhåndsvisning:** `FORHÅNDSVISNING = true` i `scripts/build.mjs` legger inn
`<meta name="robots" content="noindex, nofollow">` på alle sider, slik at
forslaget på GitHub Pages ikke havner i søkemotorene. Sett den til `false` og
bygg på nytt når domenet er koblet på.

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

Grunnvekten er satt til **450** i stedet for 400 (`body` i `css/style.css`).
Både SF Pro og Inter er variable, så 450 er en ekte mellomvekt og ikke en
avrunding. Det gir brødtekst, menylenker og de små rollenlappene («VOKAL · JAZZ»)
litt mer tyngde uten at noe blir halvfet. Vil man ha det tynnere eller tyngre,
er det tallet som skal justeres.

## Bilder

Alle bilder er hentet fra den gamle nettsiden og er pressbilder fra artistene.
Konsertfoto er tatt av **Børre Erik Helgerud**. Enkeltkrediteringer står på
artistsidene der de er kjent.

Bildene optimaliseres med ImageMagick:

```bash
magick inn.jpg -auto-orient -resize '1600x1600^' -gravity north -extent 1:1 \
  -resize 800x800 -strip -quality 80 ut-800.webp
```

### Bildegalleriet

Alle bildene står i `data/bilder.json`: `fil` viser til
`assets/bilder/<fil>-900.webp` og `<fil>-1600.webp` (16:9), og `tekst` er
bildeteksten under. Rekkefølgen i fila er rekkefølgen på siden.

```json
{ "fil": "festaften", "tekst": "Kulturens festaften · Drammen Teater 2016", "forside": true }
```

- **Forsiden** viser bare de som har `"forside": true` — en liten, kuratert
  smakebit i tre kolonner, med lenke til hele galleriet. Uten den ville
  billedseksjonen blitt mange skjermhøyder å scrolle.
- **`bilder.html`** viser alle, i fire kolonner (tre på nettbrett, to på
  telefon).

Hvert bilde lenker til 1600 px-fila, så man kan se det i full størrelse uten
noe lysbilde-script. Nye bilder legges i `assets/bilder/` i 900 og 1600 px
bredde (webp), med samme navn pluss `-900`/`-1600`.


## Logo og navn

Merket er `assets/logo/tbp-merke.svg`: notekløver, ansiktsprofil og lydbølger.
`scripts/build.mjs` leser fila og setter den inn i toppmenyen på alle sider.
Det farges med `currentColor`, så det blir blekk på papir i lyst tema og papir
på blekk i mørkt — uten en egen fil for mørk modus.

SVG-en er skåret til merkets egne mål (`viewBox="71 451 448 600"`, altså 448×600)
og koordinatene er rundet av til to desimaler. Det er kontrollert ved å rendre
før og etter: ingen ulike piksler, men fila går fra 4,7 kB til 3,3 kB.

Bokstaverne i den opprinnelige logofila («TBP» og «MUSIC MANAGEMENT») er **ikke**
med i SVG-en. I en meny på 72 px ville den lille linja blitt 2–3 px høy og
uleselig. Navnet settes i stedet som tekst ved siden av merket, med samme skrift
som resten av siden:

- `MERKE_NAVN` = **TBP Music Management** (16–17 px, halvfet)
- `MERKE_UNDER` = Terje Brun-Pedersen · Drammen (10 px, sperret, aksentfarge)

Vil han heller bruke «TBP Kultur», endrer vi `MERKE_NAVN` i `scripts/build.mjs`.

`favicon.svg`, `favicon.ico` og `apple-touch-icon.png` er en forenklet utgave
(bare T-en) som tåler 16 px. `dev/merke.html` viser det forrige merkeforslaget
og er ikke en del av siden.

### Båndet øverst på forsiden

Der står hele logoen (med bokstaver) på et uskarpt scenebilde — en bokeh av
lyskilder fra salen:

- `assets/logo/tbp-logo-hvit.svg` — den hvite logoen, alltid (båndet er mørkt
  i begge temaer, så den svarte varianten brukes ikke på nett)
- `assets/bilder/topp-bokeh.webp` — 1100×619, bare ~8 kB, fordi uskarpheten er
  bakt inn i fila. Nettleseren slipper da å gjøre en dyr blur på mobil.
- `assets/logo/tbp-logo-svart.svg` beholdes for lys bakgrunn (dokumenter, trykk).

Bildet er laget fra `assets/bilder/galla-1600.webp`. Slik lages det på nytt
(bytt kildefil for et annet motiv — `festforestilling`, `festaften`,
`vinterfestivalen` og `ute` er prøvd, `galla` ga den fineste bokehen):

```bash
magick assets/bilder/galla-1600.webp -resize 1100x -blur 0x5 \
  -modulate 84,105 -sigmoidal-contrast 3,55% -quality 82 \
  assets/bilder/topp-bokeh.webp
```

`-blur 0x5` er nok til at lysene flyter sammen, men lite nok til at det fortsatt
ser ut som et fotografi. `-modulate 84,105` er lysstyrke 84 % og metning 105 %.
Mer blur eller mer metning enn dette, og båndet begynner å konkurrere med logoen
om oppmerksomheten (det ble prøvd — det så ut som en rød suppe).

## Fargetema

Siden følger operativsystemet. I tillegg kan den som ser på designet velge selv
med bryteren helt til høyre i toppmenyen — det er nyttig på desktop, der man
ikke vil endre systeminnstillingen for å se begge temaene.

- Valget lagres i `localStorage` under nøkkelen `tema` (`lys` eller `mork`).
- Et lite script i `<head>` (`scripts/build.mjs`) leser valget *før* første
  tegning, så det ikke blinker i feil tema.
- Uten valg følger siden systemet videre, også om man bytter mens siden står
  åpen (`matchMedia`-lytteren i `js/site.js`).
- Uten JavaScript gjelder `@media (prefers-color-scheme: dark)` i CSS-en som
  før; da virker ikke bryteren, men temaet gjør det.

Fargene ligger i `:root` (lyst) og i to blokker med mørke verdier — én for
systemvalget (`@media`) og én for det egne valget (`:root[data-tema='mork']`).

## Ytelse og tilgjengelighet

- Egenhostede variable fonter (114 kB til sammen), ingen tredjepartsforespørsler.
- Alle bilder i webp med `srcset`, faste mål og `loading="lazy"`. Det første
  artistbildet hentes med én gang (`fetchpriority="high"`), siden det er det
  første man ser.
- YouTube lastes som bilde; spilleren kobles først inn ved klikk
  (`youtube-nocookie.com`). Uten JavaScript går lenken til YouTube.
- Ett stilkark, 22 linjer JavaScript. Ingen rammeverk.
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