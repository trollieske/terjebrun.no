/* terjebrun.no — lite og avhengighetsfritt.

   1) Videoene i videoseksjonen lastes som bilde. YouTube-spilleren kobles inn
      først når man klikker — uten JavaScript går klikket til YouTube.
   2) Fargetemaet følger operativsystemet, men kan overstyres med bryteren i
      toppmenyen. Valget huskes i localStorage. */
(function () {
  'use strict';

  /* --- fargetema -------------------------------------------------------- */
  var rot = document.documentElement;
  var systemet = window.matchMedia('(prefers-color-scheme: dark)');
  var bryter = document.querySelector('.tema-bryter');

  function lagret() {
    try { return localStorage.getItem('tema'); } catch (e) { return null; }
  }

  function gjeldende() {
    return lagret() || (systemet.matches ? 'mork' : 'lys');
  }

  function settTema(tema, husk) {
    rot.dataset.tema = tema === 'mork' ? 'mork' : 'lys';
    // Nettleserens egen linje (theme-color) skal også følge temaet
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', tema === 'mork' ? '#14120e' : '#f7f4ef');
    if (husk) {
      try { localStorage.setItem('tema', tema); } catch (e) {}
    }
    visTema();
  }

  function visTema() {
    if (!bryter) return;
    var mork = gjeldende() === 'mork';
    bryter.setAttribute('aria-checked', mork ? 'true' : 'false');
    // aria-label beskriver innstillingen, title sier hva klikket gjør
    bryter.title = mork ? 'Bytt til lyst tema' : 'Bytt til mørkt tema';
  }

  if (bryter) {
    bryter.addEventListener('click', function () {
      settTema(gjeldende() === 'mork' ? 'lys' : 'mork', true);
    });
  }

  // Følg systemet videre hvis brukeren ikke har valgt selv
  if (systemet.addEventListener) {
    systemet.addEventListener('change', function () {
      if (!lagret()) settTema(gjeldende(), false);
    });
  }

  // Sett tema én gang ved start, så bryteren stemmer med det som faktisk vises
  // (uten dette ville knotten stått på sol i et mørkt tema når systemet er mørkt)
  settTema(gjeldende(), false);

  document.addEventListener('click', function (e) {
    var lenke = e.target.closest ? e.target.closest('a.video[data-video]') : null;
    if (!lenke) return;
    e.preventDefault();

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + lenke.dataset.video + '?autoplay=1&rel=0';
    var tittel = lenke.querySelector('.video-tittel');
    iframe.title = tittel ? tittel.textContent : 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    lenke.replaceWith(iframe);
  });
})();
