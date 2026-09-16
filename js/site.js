/* terjebrun.no — lite og avhengighetsfritt.
   Videoene lastes som et bilde, og YouTube-spilleren kobles først inn når
   man klikker. Da slipper forsiden å hente noe fra YouTube.
   Uten JavaScript går klikket til YouTube i stedet. */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var lenke = e.target.closest ? e.target.closest('a.video[data-video]') : null;
    if (!lenke) return;
    e.preventDefault();

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + lenke.dataset.video + '?autoplay=1&rel=0';
    iframe.title = lenke.querySelector('.video-tittel')?.textContent || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    lenke.replaceWith(iframe);
  });
})();