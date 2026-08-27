(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveals() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(t => observer.observe(t));
  }

  function initProgressThread() {
    const fill = document.getElementById('progress-fill');
    if (!fill || prefersReducedMotion) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      fill.style.height = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Highlights the matching identity tab while its section is on screen.
     Purely cosmetic — the tabs are plain <a href="#..."> links underneath,
     so jump-to-section navigation works even if this never runs. */
  function initIdentityNavSpy() {
    const tabs = document.querySelectorAll('.identity-tab');
    if (!tabs.length || !('IntersectionObserver' in window)) return;

    const tabsByTarget = {};
    tabs.forEach(tab => { tabsByTarget[tab.dataset.target] = tab; });

    const sections = Array.from(tabs)
      .map(t => document.getElementById(t.dataset.target))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const tab = tabsByTarget[entry.target.id];
        if (!tab) return;
        if (entry.isIntersecting) {
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
        }
      });
    }, { threshold: 0, rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  document.addEventListener('content-rendered', () => {
    initReveals();
    initProgressThread();
    initIdentityNavSpy();
  });

  // Fallback in case content-rendered never fires (e.g. fetch blocked)
  window.addEventListener('load', () => {
    if (!document.querySelector('[data-reveal].is-visible') && document.querySelector('[data-reveal]')) {
      initReveals();
      initProgressThread();
      initIdentityNavSpy();
    }
  });
})();