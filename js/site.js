/* terjebrun.no — lite og avhengighetsfritt.
   1) Videoene lastes som bilde, og YouTube-spilleren kobles inn først når man
      klikker. Uten JavaScript går klikket til YouTube i stedet.
   2) Artistkarusellen får piler, teller og tastaturnavigasjon. Selve
      sidelengs-scrollingen virker også uten JavaScript. */
(function () {
  'use strict';

  /* --- video på klikk ------------------------------------------------- */
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

  /* --- artistkarusell ------------------------------------------------- */
  var bane = document.querySelector('.stripe-bane');
  if (!bane) return;

  var spor = bane.querySelector('.stripe-spor');
  var kort = spor ? Array.prototype.slice.call(spor.children) : [];
  var teller = document.querySelector('[data-teller]');
  var piler = Array.prototype.slice.call(document.querySelectorAll('.pil'));
  if (!kort.length) return;

  function steg() {
    var b = kort[0].getBoundingClientRect().width;
    var gap = parseFloat(getComputedStyle(spor).columnGap || '12') || 12;
    return b + gap;
  }

  function oppdater() {
    var x = bane.scrollLeft;
    var venstre = bane.getBoundingClientRect().left;
    var indeks = 0;

    kort.forEach(function (k, i) {
      var pos = k.getBoundingClientRect().left - venstre + x;
      if (pos <= x + 8) indeks = i;
    });

    if (teller) teller.textContent = String(indeks + 1).padStart(2, '0');

    var maks = bane.scrollWidth - bane.clientWidth - 2;
    piler.forEach(function (p) {
      var retning = Number(p.dataset.retning);
      p.disabled = retning < 0 ? x <= 2 : x >= maks;
    });
  }

  var planlagt = false;
  bane.addEventListener(
    'scroll',
    function () {
      if (planlagt) return;
      planlagt = true;
      requestAnimationFrame(function () {
        planlagt = false;
        oppdater();
      });
    },
    { passive: true }
  );

  piler.forEach(function (p) {
    p.addEventListener('click', function () {
      bane.scrollBy({ left: Number(p.dataset.retning) * steg() * 2, behavior: 'smooth' });
    });
  });

  bane.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    bane.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * steg(), behavior: 'smooth' });
  });

  window.addEventListener('resize', oppdater);
  oppdater();
})();