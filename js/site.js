/* terjebrun.no — lite og avhengighetsfritt.

   1) Videoene i videoseksjonen lastes som bilde. YouTube-spilleren kobles inn
      først når man klikker — uten JavaScript går klikket til YouTube.
   2) Heltevideoen lastes etter at siden ellers er ferdig, og bare når
      nettverket og brukerens innstillinger tåler det. Posterbildet ligger
      under, så første bilde på skjermen er alltid der med en gang. */
(function () {
  'use strict';

  /* --- video i videoseksjonen ----------------------------------------- */
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

  /* --- heltevideo ------------------------------------------------------ */
  var heltevideo = document.querySelector('.helt-video');
  if (!heltevideo) return;

  var roligeInnstillinger = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nett = navigator.connection || {};
  var sparerData = nett.saveData === true || /^(slow-2g|2g|3g)$/.test(nett.effectiveType || '');

  if (roligeInnstillinger || sparerData) {
    heltevideo.remove();
    return;
  }

  function startVideo() {
    var webm = document.createElement('source');
    webm.src = heltevideo.dataset.webm;
    webm.type = 'video/webm';
    var mp4 = document.createElement('source');
    mp4.src = heltevideo.dataset.mp4;
    mp4.type = 'video/mp4';
    heltevideo.appendChild(mp4); // mp4 først i DOM, webm velges hvis den støttes
    heltevideo.insertBefore(webm, mp4);
    heltevideo.addEventListener('playing', function () {
      heltevideo.classList.add('spiller');
    });
    var spill = heltevideo.play();
    if (spill && spill.catch) {
      spill.catch(function () {
        heltevideo.remove(); // nettleseren ville ikke — posterbildet står igjen
      });
    }
    // Ikke bruk batteri på en fane ingen ser på
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        heltevideo.pause();
      } else {
        var igjen = heltevideo.play();
        if (igjen && igjen.catch) igjen.catch(function () {});
      }
    });
  }

  if (document.readyState === 'complete') {
    startVideo();
  } else {
    window.addEventListener('load', startVideo);
  }
})();