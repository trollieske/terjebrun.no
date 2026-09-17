#!/usr/bin/env node
/**
 * Bygger terjebrun.no.
 *
 *   node scripts/build.mjs
 *
 * Leser data/artister.json, data/produksjoner.json og data/video.json og
 * skriver ferdige HTML-filer i rot og artister/. Sidene index.html og
 * produksjoner.html settes sammen av delene i src/.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..');
const les = (p) => readFileSync(join(ROT, p), 'utf8');
const skriv = (p, innhold) => {
  mkdirSync(dirname(join(ROT, p)), { recursive: true });
  writeFileSync(join(ROT, p), innhold);
  console.log('  skrev', p);
};

const artister = JSON.parse(les('data/artister.json'));
const produksjoner = JSON.parse(les('data/produksjoner.json'));
const video = JSON.parse(les('data/video.json'));
const bilder = JSON.parse(les('data/bilder.json')).bilder;

const NETTSTED = 'https://terjebrun.no';
const EPOST = 'tbrun-pe@online.no';
const TELEFON = '+4792604030';
const TELEFON_TEKST = '+47 926 04 030';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MERKE_NAVN = 'TBP Music Management';
const MERKE_UNDER = 'Terje Brun-Pedersen · Drammen';

/* ---------------------------------------------------------------- deler */

const IKON = {
  hjem: '<path d="M3 10.5 12 3l9 7.5V21H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  artister:
    '<circle cx="12" cy="8.2" r="3.7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.6 20.2c0-3.7 3.3-6.4 7.4-6.4s7.4 2.7 7.4 6.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  produksjoner:
    '<rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 6V4h8v2M3 12h18" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  kontakt:
    '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h1.2c.6 0 1.1.4 1.2 1l.5 2.6c.1.5-.1 1-.5 1.3l-1 .7a11 11 0 0 0 4.5 4.5l.7-1c.3-.4.8-.6 1.3-.5l2.6.5c.6.1 1 .6 1 1.2V17a2.5 2.5 0 0 1-2.5 2.5C8.6 19.5 4 14.9 4 8.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  bilder:
    '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8.6" cy="10" r="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.4 17.5 9 12.6l3.4 3 3-2.4 5.2 4.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};

/* Merket er en egen SVG-fil (notekløver, ansiktsprofil og lydbølger) som settes
   rett inn i markupen. Det farges med currentColor og følger derfor temaet.
   Bokstavene «TBP Music Management» står som tekst ved siden av, ikke inne i
   fila: i en meny på 72 px ville «MUSIC MANAGEMENT»-linja blitt et par piksler. */
const MERKE_SVG = les('assets/logo/tbp-merke.svg')
  .replace(/^<!--[\s\S]*?-->\s*/, '')
  .replace('<svg ', '<svg class="merke-ikon" aria-hidden="true" ')
  .trim()
  .split('\n')
  .map((linje) => (linje ? '        ' + linje : linje))
  .join('\n');

function merke(p = '') {
  return `<a class="merke" href="${p}index.html" aria-label="Terje Brun-Pedersen – til forsiden">
${MERKE_SVG}
        <span class="merke-tekst">
          <span class="merke-navn">${MERKE_NAVN}</span>
          <span class="merke-rolle">${MERKE_UNDER}</span>
        </span>
      </a>`;
}

function hode(aktiv, p = '') {
  const lenker = [
    [`${p}index.html#artister`, 'Artister', 'artister'],
    [`${p}bilder.html`, 'Bilder', 'bilder'],
    [`${p}index.html#video`, 'Video', 'video'],
    [`${p}produksjoner.html`, 'Produksjoner', 'produksjoner'],
    [`${p}index.html#om`, 'Om', 'om'],
  ];
  return `<header class="hode">
  <div class="hode-inn">
    ${merke(p)}
    <nav class="meny" aria-label="Hovedmeny">
      ${lenker
        .map(
          ([href, tekst, navn]) =>
            `<a href="${href}"${aktiv === navn ? ' aria-current="page"' : ''}>${tekst}</a>`
        )
        .join('\n      ')}
      <a class="knapp" href="mailto:${EPOST}?subject=Booking">Ta kontakt</a>
    </nav>
  </div>
</header>`;
}

function bunnavigasjon(aktiv, p = '') {
  const punkter = [
    [`${p}index.html`, 'Hjem', 'hjem'],
    [`${p}index.html#artister`, 'Artister', 'artister'],
    [`${p}bilder.html`, 'Bilder', 'bilder'],
    [`${p}produksjoner.html`, 'Produksjoner', 'produksjoner'],
    [`${p}index.html#kontakt`, 'Kontakt', 'kontakt'],
  ];
  return `<nav class="bunnav" aria-label="Hurtigmeny">
  <ul>
    ${punkter
      .map(
        ([href, tekst, navn]) => `<li><a href="${href}"${aktiv === navn ? ' aria-current="page"' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true">${IKON[navn]}</svg>${tekst}</a></li>`
      )
      .join('\n    ')}
  </ul>
</nav>`;
}

function bunn(aktiv = '', p = '') {
  return `<footer class="bunn">
  <div class="wrap bunn-inn">
    <p>${MERKE_NAVN} · Terje Brun-Pedersen · Drammen</p>
    <p>Konsertfoto: Børre Erik Helgerud. Enkeltbilder: se kreditering på artistsidene.</p>
  </div>
</footer>
${bunnavigasjon(aktiv, p)}`;
}

function layout({ tittel, beskrivelse, innhold, aktiv = '', kanonisk = '', bilde = '', struktur = '', p = '' }) {
  return `<!DOCTYPE html>
<!-- Bygget fra src/ og data/ av scripts/build.mjs — kjør «npm run build» etter endringer i kildene. -->
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tittel)}</title>
<meta name="description" content="${esc(beskrivelse)}">
${kanonisk ? `<link rel="canonical" href="${NETTSTED}${kanonisk}">` : ''}
<meta name="theme-color" content="#f7f4ef">
<link rel="icon" href="${p}assets/logo/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${p}assets/logo/apple-touch-icon.png">
<link rel="preload" href="${p}assets/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${p}css/style.css">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Terje Brun-Pedersen">
<meta property="og:title" content="${esc(tittel)}">
<meta property="og:description" content="${esc(beskrivelse)}">
<meta property="og:url" content="${NETTSTED}${kanonisk}">
<meta property="og:image" content="${NETTSTED}/${bilde || 'assets/bilder/og-bilde.jpg'}">
<meta property="og:locale" content="nb_NO">
<meta name="twitter:card" content="summary_large_image">
${struktur ? `<script type="application/ld+json">${struktur}</script>` : ''}
</head>
<body>
<a class="skjul" href="#innhold">Til innholdet</a>
${hode(aktiv, p)}
<main id="innhold">
${innhold}
</main>
${bunn(aktiv, p)}
<script src="${p}js/site.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------- biter */

function artistkort(a, forst = false) {
  // Første kort står øverst på forsiden og er det første bildet på skjermen,
  // så det hentes med én gang og med høy prioritet. Resten lastes når de nærmer seg.
  const lasting = forst ? 'fetchpriority="high"' : 'loading="lazy"';
  return `      <li>
        <a class="kort" href="artister/${a.slug}.html">
          <span class="kort-bilde">
            <img src="assets/artister/${a.bilde}-400.webp"
                 srcset="assets/artister/${a.bilde}-400.webp 400w, assets/artister/${a.bilde}-800.webp 800w"
                 sizes="(min-width:1024px) 22vw, (min-width:700px) 30vw, 45vw"
                 alt="${esc(a.navn)}" width="400" height="400" ${lasting} decoding="async">
          </span>
          <span class="kort-navn">${esc(a.navn)}</span>
          <span class="kort-rolle">${esc(a.rolle)}</span>
          ${a.merke ? `<span class="kort-merke">${esc(a.merke)}</span>` : ''}
        </a>
      </li>`;
}

/* Bildene er 16:9 i to bredder. Klikket går til 1600 px-fila, så man kan se
   bildet i full størrelse uten noe lysbilde-script. */
function bildekort(b) {
  return `      <li>
        <figure>
          <a href="assets/bilder/${b.fil}-1600.webp">
            <img src="assets/bilder/${b.fil}-900.webp"
                 srcset="assets/bilder/${b.fil}-900.webp 900w, assets/bilder/${b.fil}-1600.webp 1600w"
                 sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 92vw"
                 alt="" width="1600" height="900" loading="lazy" decoding="async">
          </a>
          <figcaption>${esc(b.tekst)}</figcaption>
        </figure>
      </li>`;
}

const AVSPILL = `<span class="video-avspill"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span></span>`;

function videokort(v) {
  return `      <li>
        <a class="video" href="https://www.youtube.com/watch?v=${v.id}" data-video="${v.id}" target="_blank" rel="noopener">
          <img src="assets/video/${v.id}.webp" alt="" width="640" height="360" loading="lazy" decoding="async">
          ${AVSPILL}
          <span class="video-tittel">${esc(v.tittel)}</span>
        </a>
      </li>`;
}

function produksjonskort(p) {
  return `      <li>
        <a class="prod" href="produksjoner.html#${p.slug}">
          <span class="prod-bilde">
            <img src="assets/bilder/${p.bilde}-900.webp" alt="${esc(p.tittel)}" width="900" height="506" loading="lazy" decoding="async">
          </span>
          <span class="prod-meta">
            <span class="prod-tittel">${esc(p.tittel)}</span>
            <span class="prod-aar">${esc(p.aar)}</span>
          </span>
          <span class="prod-rolle">${esc(p.rolle)}</span>
        </a>
      </li>`;
}

function produksjonsdel(p) {
  return `<article class="prod-side" id="${p.slug}">
    <div class="prod-side-bilde">
      <img src="assets/bilder/${p.bilde}-1600.webp" alt="${esc(p.tittel)}" loading="lazy" decoding="async">
    </div>
    <div>
      <p class="eyebrow">${esc(p.rolle)}</p>
      <h2>${esc(p.tittel)}</h2>
      <p class="prod-side-meta">${esc(p.sted)} · ${esc(p.aar)}</p>
      ${p.tekst.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
      ${
        p.lenker
          ? `<div class="artist-lenker">${p.lenker
              .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.tekst)}</a>`)
              .join('')}</div>`
          : ''
      }
    </div>
  </article>`;
}

/* --------------------------------------------------------- artistsider */

function artistmal(a, forrige, neste) {
  const p = '../';
  // Første avsnitt i bioen brukes som ingress, resten står i brødteksten —
  // da gjentar ikke kortversjonen seg når man kommer inn på siden.
  const ingress = a.bio[0] || a.kort;
  const resten = a.bio.slice(1);
  const innhold = `  <div class="wrap">
    <article class="artist">
      <div class="artist-foto">
        <img src="${p}assets/artister/${a.bilde}-800.webp" alt="${esc(a.navn)}" width="800" height="800" fetchpriority="high" decoding="async">
      </div>
      <div class="artist-tekst">
        <p class="eyebrow"><a class="tekstlenke" href="../index.html#artister">Artister</a></p>
        <h1>${esc(a.navn)}</h1>
        <div class="artist-topp">
          <span class="artist-rolle">${esc(a.rolle)}</span>
          ${a.merke ? `<span class="artist-merke">${esc(a.merke)}</span>` : ''}
        </div>
        <p class="lede artist-kort">${esc(ingress)}</p>
        ${a.sitat ? `<blockquote class="artist-sitat">${esc(a.sitat.tekst)}<cite>${esc(a.sitat.kilde)}</cite></blockquote>` : ''}
        <div class="artist-bio">
          ${resten.map((t) => `<p>${esc(t)}</p>`).join('\n          ')}
        </div>
        ${
          a.lenker?.length
            ? `<div class="artist-lenker">${(a.lenker || [])
                .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.tekst)}</a>`)
                .join('')}</div>`
            : ''
        }
        <div class="artist-handling">
          <a class="knapp" href="mailto:${EPOST}?subject=${encodeURIComponent('Booking: ' + a.navn)}&body=${encodeURIComponent(
            'Hei Terje,\n\nvi ønsker ' + a.navn + ' til:\n\nSted:\nDato:\nFormat:\n\nMvh\n'
          )}">Be om ledig dato</a>
        </div>
        ${a.kreditt ? `<p class="artist-kreditt">${esc(a.kreditt)}</p>` : ''}
      </div>
    </article>
    <nav class="artist-nav" aria-label="Flere artister">
      ${forrige ? `<a href="${forrige.slug}.html"><span>Forrige</span><b>${esc(forrige.navn)}</b></a>` : '<span></span>'}
      ${neste ? `<a href="${neste.slug}.html" style="text-align:right"><span>Neste</span><b>${esc(neste.navn)}</b></a>` : '<span></span>'}
    </nav>
  </div>`;

  const struktur = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: a.navn,
    description: a.kort,
    image: `${NETTSTED}/assets/artister/${a.bilde}-800.webp`,
    url: `${NETTSTED}/artister/${a.slug}.html`,
    genre: a.rolle,
  });

  return layout({
    tittel: `${a.navn} – booking | ${MERKE_NAVN}`,
    beskrivelse: a.kort,
    innhold,
    aktiv: 'artister',
    kanonisk: `/artister/${a.slug}.html`,
    struktur,
    p,
  });
}

/* ------------------------------------------------------------- bygging */

console.log('Bygger artister …');
artister.forEach((a, i) => {
  const forrige = i > 0 ? artister[i - 1] : null;
  const neste = i < artister.length - 1 ? artister[i + 1] : null;
  skriv(`artister/${a.slug}.html`, artistmal(a, forrige, neste));
});

console.log('Bygger forsiden …');
let forside = les('src/index.html');
forside = forside.replace('<!-- ARTISTER -->', artister.map((a, i) => artistkort(a, i === 0)).join('\n'));
forside = forside.replace(
  '<!-- ARTISTER_TELLING -->',
  `${artister.length} artister og ensembler`
);
forside = forside.replace(
  '<!-- FORSIDEBILDER -->',
  bilder.filter((b) => b.forside).map(bildekort).join('\n')
);
forside = forside.replace('<!-- VIDEOER -->', video.videoer.filter((v) => v.forside).map(videokort).join('\n'));
forside = forside.replace(
  '<!-- PRODUKSJONER -->',
  ['bokmesse-frankfurt', 'festforestilling-17-mai', 'secret-garden', 'kulturens-festaften']
    .map((s) => produksjoner.find((p) => p.slug === s))
    .filter(Boolean)
    .map(produksjonskort)
    .join('\n')
);
forside = forside.replace('<!-- YT_KANAL -->', video.kanal);
skriv(
  'index.html',
  layout({
    tittel: `${MERKE_NAVN} – agent for norske og internasjonale artister`,
    beskrivelse:
      'TBP Music Management ved Terje Brun-Pedersen formidler norske og internasjonale artister til kulturhus, festivaler, klubber og private arrangementer. Booking av jazz, klassisk, kor, rock og soul.',
    innhold: forside,
    aktiv: 'hjem',
    kanonisk: '/',
    struktur: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MusicAgent',
      name: MERKE_NAVN,
      alternateName: 'Terje Brun-Pedersen',
      url: NETTSTED,
      email: EPOST,
      telephone: '+47 926 04 40 30',
      areaServed: 'NO',
      address: { '@type': 'PostalAddress', addressLocality: 'Drammen', addressCountry: 'NO' },
      employee: artister.map((a) => ({ '@type': 'MusicGroup', name: a.navn })),
    }),
  })
);

console.log('Bygger produksjoner …');
let prod = les('src/produksjoner.html');
prod = prod.replace('<!-- PRODUKSJONER -->', produksjoner.map(produksjonsdel).join('\n'));
prod = prod.replace('<!-- PRODUKSJONSVIDEOER -->', video.videoer.filter((v) => v.produksjon).map(videokort).join('\n'));
skriv(
  'produksjoner.html',
  layout({
    tittel: `Utvalgte produksjoner | ${MERKE_NAVN}`,
    beskrivelse:
      'Festforestillinger, kirkekonserter, festivaler og internasjonale gjestespill – utvalgte produksjoner fra TBP Music Management i Drammen.',
    innhold: prod,
    aktiv: 'produksjoner',
    kanonisk: '/produksjoner.html',
  })
);

console.log('Bygger bildesiden …');
let bildeSide = les('src/bilder.html');
bildeSide = bildeSide.replace('<!-- BILDER -->', bilder.map(bildekort).join('\n'));
bildeSide = bildeSide.replace('<!-- BILDER_TELLING -->', `${bilder.length} bilder`);
skriv(
  'bilder.html',
  layout({
    tittel: `Bilder | ${MERKE_NAVN}`,
    beskrivelse:
      'Bilder fra konserter, festivaler og produksjoner med TBP Music Management og Terje Brun-Pedersen i Drammen — fra Drammen Teater og Bragernes kirke til bokmessa i Frankfurt.',
    innhold: bildeSide,
    aktiv: 'bilder',
    kanonisk: '/bilder.html',
  })
);

console.log('Bygger sitemap …');
const sider = ['/', '/bilder.html', '/produksjoner.html', ...artister.map((a) => `/artister/${a.slug}.html`)];
skriv(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sider.map((s) => `  <url><loc>${NETTSTED}${s}</loc></url>`).join('\n')}
</urlset>
`
);
console.log('Ferdig.');