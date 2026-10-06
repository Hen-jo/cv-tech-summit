/* No external packages, network requests, analytics or storage. Works with file://. */
(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const mobile = window.matchMedia('(max-width: 700px)');
  function closeMenu(returnFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', '메뉴 열기');
    navigation.classList.remove('is-open');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const opening = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(opening));
    menu.setAttribute('aria-label', opening ? '메뉴 닫기' : '메뉴 열기');
    navigation.classList.toggle('is-open', opening);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  if (mobile.addEventListener) mobile.addEventListener('change', () => closeMenu());

})();
