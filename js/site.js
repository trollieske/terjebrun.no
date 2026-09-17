/* terjebrun.no — lite og avhengighetsfritt.

   Videoene i videoseksjonen lastes som bilde. YouTube-spilleren kobles inn
   først når man klikker — uten JavaScript går klikket til YouTube. */
(function () {
  'use strict';

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
