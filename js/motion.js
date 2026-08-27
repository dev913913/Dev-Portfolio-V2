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
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

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

  document.addEventListener('content-rendered', () => {
    initReveals();
    initProgressThread();
  });

  // Fallback in case content-rendered never fires (e.g. fetch blocked)
  window.addEventListener('load', () => {
    if (!document.querySelector('[data-reveal].is-visible') && document.querySelector('[data-reveal]')) {
      initReveals();
      initProgressThread();
    }
  });
})();
