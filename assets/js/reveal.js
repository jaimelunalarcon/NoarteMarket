// assets/js/reveal.js
(() => {
  const SELECTOR = '#productos .card, #blog .card';

  // Aplica clase .reveal y un pequeño stagger basado en el índice
  function seedRevealTargets() {
    const targets = document.querySelectorAll(SELECTOR);
    targets.forEach((el, i) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-visible')) {
        el.classList.add('reveal');
        // Stagger: 0ms, 70ms, 140ms, 210ms, ...
        el.style.setProperty('--reveal-delay', `${(i % 8) * 70}ms`);
      }
    });
    return targets;
  }

  // Observador: cuando entra al viewport, se muestra y dejamos de observar
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px' // dispara un poco antes
  });

  document.addEventListener('DOMContentLoaded', () => {
    seedRevealTargets().forEach(el => io.observe(el));
  });

  // Por si más adelante agregas cards dinámicamente, expón un helper:
  window.NOARTE = window.NOARTE || {};
  window.NOARTE.reveal = {
    refresh() {
      seedRevealTargets().forEach(el => io.observe(el));
    }
  };
})();
