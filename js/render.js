function el(tag, opts = {}) {
  const e = document.createElement(tag);
  if (opts.text) e.textContent = opts.text;
  if (opts.html) e.innerHTML = opts.html;
  if (opts.class) e.className = opts.class;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function safeHide(imgEl) {
  imgEl.addEventListener('error', () => { imgEl.style.display = 'none'; });
}

/* Falls back to a styled placeholder instead of collapsing to nothing.
   placeholderClass adds a marker class to the parent so CSS can show
   an icon/initial in place of the missing image. */
function safeFallback(imgEl, parentEl, placeholderClass) {
  imgEl.addEventListener('error', () => {
    imgEl.style.display = 'none';
    if (parentEl) parentEl.classList.add(placeholderClass);
  });
}

function setMarginNote(sectionEl, text) {
  if (!text) return;
  const note = sectionEl.querySelector('[data-margin]');
  if (note) note.textContent = text;
}

/* ---------- Click-to-expand YouTube card ----------
   Renders a thumbnail with a play affordance. On click, swaps the
   thumbnail for a real iframe embed (autoplay=1) so nothing loads
   or plays until the person actually asks for it. Works identically
   on touch and pointer devices since it's click-based, not hover-based. */
function buildVideoCard({ youtubeId, label, title, description, size = 'large' }) {
  if (!youtubeId) return null;
  const wrap = el('div', { class: `video-card video-card--${size}` });

  if (label) wrap.appendChild(el('span', { class: 'video-card-label', text: label }));

  const frame = el('div', { class: 'video-card-frame' });
  const thumb = el('button', {
    class: 'video-thumb',
    attrs: {
      type: 'button',
      'aria-label': `Play video: ${title || 'YouTube video'}`,
      style: `background-image:url('https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg')`
    }
  });
  const playBtn = el('span', { class: 'play-badge', html: playIconSVG() });
  thumb.appendChild(playBtn);
  frame.appendChild(thumb);

  thumb.addEventListener('click', () => {
    const iframe = el('iframe', {
      attrs: {
        src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
        title: title || 'YouTube video player',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: 'true'
      }
    });
    frame.innerHTML = '';
    frame.appendChild(iframe);
  }, { once: true });

  wrap.appendChild(frame);

  if (title) wrap.appendChild(el('h3', { text: title }));
  if (description) wrap.appendChild(el('p', { text: description }));

  return wrap;
}

function playIconSVG() {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}

/* ---------- Shorts card — vertical aspect, click-to-play ----------
   Uses the /shorts/ embed path so YouTube renders its native vertical
   player instead of letterboxing a 9:16 video inside a 16:9 frame. */
function buildShortCard({ youtubeId, title, topic }) {
  if (!youtubeId) return null;
  const wrap = el('div', { class: 'short-card' });

  if (topic) wrap.appendChild(el('span', { class: 'video-card-label', text: topic }));

  const frame = el('div', { class: 'short-card-frame' });
  const thumb = el('button', {
    class: 'video-thumb short-thumb',
    attrs: {
      type: 'button',
      'aria-label': `Play short: ${title || 'YouTube Short'}`,
      style: `background-image:url('https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg')`
    }
  });
  thumb.appendChild(el('span', { class: 'play-badge', html: playIconSVG() }));
  frame.appendChild(thumb);

  thumb.addEventListener('click', () => {
    const iframe = el('iframe', {
      attrs: {
        src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
        title: title || 'YouTube Short player',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: 'true'
      }
    });
    frame.innerHTML = '';
    frame.appendChild(iframe);
  }, { once: true });

  wrap.appendChild(frame);
  if (title) wrap.appendChild(el('h4', { text: title }));
  return wrap;
}

/* ---------- Click-to-load Blog embed ----------
   Blogger pages don't offer a lightweight oEmbed feed, so this shows
   an inviting preview panel and swaps in a live iframe of the blog
   itself on click — same "nothing loads until asked" pattern as video. */
function buildBlogCard({ label, title, description, link }) {
  if (!link) return null;
  const wrap = el('div', { class: 'blog-card' });

  if (label) wrap.appendChild(el('span', { class: 'video-card-label', text: label }));

  const frame = el('div', { class: 'blog-card-frame' });
  const openBtn = el('button', {
    class: 'blog-open-btn',
    attrs: { type: 'button', 'aria-label': `Open the blog: ${title || link}` }
  });
  openBtn.appendChild(el('span', { class: 'blog-open-icon', html: bookIconSVG() }));
  openBtn.appendChild(el('span', { class: 'blog-open-text', text: 'Open the blog' }));
  frame.appendChild(openBtn);

  openBtn.addEventListener('click', () => {
    const iframe = el('iframe', {
      class: 'blog-embed-iframe',
      attrs: { src: link, title: title || 'Educational blog', loading: 'lazy' }
    });
    frame.innerHTML = '';
    frame.appendChild(iframe);
  }, { once: true });

  wrap.appendChild(frame);
  if (title) wrap.appendChild(el('h3', { text: title }));
  if (description) wrap.appendChild(el('p', { text: description }));
  wrap.appendChild(el('a', { text: 'Visit blog directly', class: 'card-link', attrs: { href: link, target: '_blank', rel: 'noopener' } }));

  return wrap;
}

function bookIconSVG() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z"/><path d="M20 5.5C20 4.67 19.33 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13z"/></svg>`;
}

async function render() {
  const data = await loadContent();
  if (!data) return;

  document.title = data.site?.title || 'Portfolio';

  // Profile
  const p = data.profile || {};
  document.getElementById('profile-eyebrow').textContent = p.eyebrow || '';
  document.getElementById('profile-name').textContent = p.name || '';
  document.getElementById('profile-tagline').textContent = p.tagline || '';
  document.getElementById('profile-bio').textContent = p.bio || '';
  const photo = document.getElementById('profile-photo');
  const photoWrap = document.getElementById('profile-photo-wrap');
  if (p.photo) { photo.src = p.photo; safeFallback(photo, photoWrap, 'photo-fallback'); }

  const socialsWrap = document.getElementById('profile-socials');
  (p.socials || []).forEach(s => {
    if (!s.url) return;
    const a = el('a', { text: s.label, attrs: { href: s.url, target: '_blank', rel: 'noopener' } });
    socialsWrap.appendChild(a);
  });

  // Teaching
  const t = data.teaching || {};
  document.getElementById('teach-heading').textContent = t.heading || 'Teaches';
  document.getElementById('teach-note').textContent = t.note || '';
  setMarginNote(document.getElementById('teach'), t.marginNote);

  const subjWrap = document.getElementById('teach-subjects');
  (t.subjects || []).forEach(s => subjWrap.appendChild(el('span', { text: s })));

  const teachContentWrap = document.getElementById('teach-content');
  (t.content || []).forEach(item => {
    const card = el('div', { class: 'card', attrs: { 'data-type': item.type || '' } });
    card.appendChild(el('h3', { text: item.title }));
    card.appendChild(el('p', { text: item.description }));
    if (item.link) {
      card.appendChild(el('a', { text: 'Visit', class: 'card-link', attrs: { href: item.link, target: '_blank', rel: 'noopener' } }));
    }
    teachContentWrap.appendChild(card);
  });

  // Featured English lesson video
  const engShowcase = document.getElementById('teach-video-showcase');
  if (t.videoFeature) {
    const card = buildVideoCard({ ...t.videoFeature, size: 'large' });
    if (card) engShowcase.appendChild(card);
  }

  // Blog embed — click to load
  const blogShowcase = document.getElementById('teach-blog-showcase');
  if (t.blogFeature) {
    const card = buildBlogCard(t.blogFeature);
    if (card) blogShowcase.appendChild(card);
  }

  // Featured CS/programming tutorial video
  const csShowcase = document.getElementById('teach-cs-showcase');
  if (t.csFeature) {
    const card = buildVideoCard({ ...t.csFeature, size: 'large' });
    if (card) csShowcase.appendChild(card);
  }

  // Office tutorial row — smaller cards, same click-to-expand pattern
  const officeWrap = document.getElementById('teach-office-row');
  if (t.officeTutorials && t.officeTutorials.items && t.officeTutorials.items.length) {
    if (t.officeTutorials.note) {
      officeWrap.appendChild(el('p', { class: 'office-row-note', text: t.officeTutorials.note }));
    }
    const row = el('div', { class: 'office-row-grid' });
    t.officeTutorials.items.forEach(item => {
      const card = buildVideoCard({
        youtubeId: item.youtubeId,
        title: item.title,
        description: item.note || '',
        size: 'small'
      });
      if (card) row.appendChild(card);
    });
    officeWrap.appendChild(row);
  }

  // Shorts strip — vertical cards, skipped entirely until real IDs are filled in
  const shortsWrap = document.getElementById('teach-shorts-row');
  if (t.shorts && t.shorts.items && t.shorts.items.length) {
    const realItems = t.shorts.items.filter(s => s.youtubeId && !s.youtubeId.startsWith('REPLACE'));
    if (realItems.length) {
      if (t.shorts.note) {
        shortsWrap.appendChild(el('p', { class: 'office-row-note', text: t.shorts.note }));
      }
      const row = el('div', { class: 'shorts-row-grid' });
      realItems.forEach(item => {
        const card = buildShortCard(item);
        if (card) row.appendChild(card);
      });
      shortsWrap.appendChild(row);
    }
  }

  // Confidence-building video — framed separately, it's mentorship not a tutorial
  const confWrap = document.getElementById('teach-confidence');
  if (t.confidenceFeature) {
    const card = buildVideoCard({ ...t.confidenceFeature, size: 'wide' });
    if (card) confWrap.appendChild(card);
  }

  const adminWrap = document.getElementById('teach-admin');
  (t.administrative || []).forEach(line => adminWrap.appendChild(el('li', { text: line })));

  // Building
  const b = data.building || {};
  document.getElementById('build-heading').textContent = b.heading || 'Builds';
  document.getElementById('build-note').textContent = b.note || '';
  setMarginNote(document.getElementById('build'), b.marginNote);

  const projWrap = document.getElementById('build-projects');
  (b.projects || []).forEach(proj => {
    const cardClass = proj.featured ? 'project-card is-featured' : 'project-card';
    const card = el('div', { class: cardClass });
    const bar = el('div', { class: 'term-bar' });
    bar.appendChild(el('span')); bar.appendChild(el('span')); bar.appendChild(el('span'));
    card.appendChild(bar);

    if (proj.image) {
      const shot = el('div', { class: 'project-shot' });
      const img = el('img', { attrs: { src: proj.image, alt: proj.name || '', loading: 'lazy' } });
      safeFallback(img, shot, 'shot-fallback');
      shot.appendChild(img);

      if (proj.liveEmbed && proj.link) {
        const openBtn = el('button', {
          class: 'live-preview-btn',
          text: 'Open live preview',
          attrs: { type: 'button', 'aria-label': `Open a live preview of ${proj.name}` }
        });
        openBtn.addEventListener('click', () => {
          const iframe = el('iframe', {
            class: 'project-live-iframe',
            attrs: {
              src: proj.link,
              title: `${proj.name} — live preview`,
              loading: 'lazy'
            }
          });
          shot.innerHTML = '';
          shot.appendChild(iframe);
        }, { once: true });
        shot.appendChild(openBtn);
      }

      card.appendChild(shot);
    }

    const body = el('div', { class: 'term-body' });
    body.appendChild(el('h3', { text: proj.name }));
    body.appendChild(el('p', { text: proj.description }));

    if (proj.tech && proj.tech.length) {
      const tags = el('div', { class: 'tech-tags' });
      proj.tech.forEach(tag => tags.appendChild(el('span', { text: tag })));
      body.appendChild(tags);
    }

    if (proj.link) {
      body.appendChild(el('a', { text: 'View live', class: 'card-link', attrs: { href: proj.link, target: '_blank', rel: 'noopener' } }));
    }

    card.appendChild(body);
    projWrap.appendChild(card);
  });

  const skillsWrap = document.getElementById('build-skills');
  Object.entries(b.skills || {}).forEach(([group, items]) => {
    const g = el('div', { class: 'skill-group' });
    g.appendChild(el('h4', { text: group }));
    g.appendChild(el('p', { text: items.join(' · ') }));
    skillsWrap.appendChild(g);
  });

  // Certificates
  const c = data.certificates || {};
  document.getElementById('certs-heading').textContent = c.heading || 'Credentials';
  document.getElementById('certs-note').textContent = c.note || '';
  setMarginNote(document.getElementById('certificates'), c.marginNote);

  const certGrid = document.getElementById('certs-grid');
  const certItems = c.items || [];
  if (!certItems.length) {
    const certSection = document.getElementById('certificates');
    if (certSection) certSection.style.display = 'none';
  }
  certItems.forEach(cert => {
    const card = el('div', { class: 'cert-card' });
    if (cert.image) {
      const img = el('img', { attrs: { src: cert.image, alt: cert.title || '' } });
      safeFallback(img, card, 'cert-fallback');
      card.appendChild(img);
    }
    const info = el('div', { class: 'cert-info' });
    info.appendChild(el('h4', { text: cert.title }));
    info.appendChild(el('p', { text: [cert.issuer, cert.date].filter(Boolean).join(' — ') }));
    card.appendChild(info);
    certGrid.appendChild(card);
  });

  // Writing
  const w = data.writing || {};
  document.getElementById('writing-heading').textContent = w.heading || 'Writing';
  document.getElementById('writing-note').textContent = w.note || '';
  setMarginNote(document.getElementById('writing'), w.marginNote);

  const writingWrap = document.getElementById('writing-showcase');

  if (w.substack) {
    const sub = el('div', { class: 'substack-card' });
    sub.appendChild(el('span', { class: 'video-card-label', text: 'Substack' }));
    sub.appendChild(el('h3', { text: w.substack.publicationName || 'Substack' }));
    if (w.substack.description) {
      sub.appendChild(el('p', { text: w.substack.description }));
    }
    if (w.substack.link) {
      const cta = el('a', {
        class: 'substack-cta',
        attrs: { href: w.substack.link, target: '_blank', rel: 'noopener' }
      });
      cta.appendChild(el('span', { text: 'Read on Substack' }));
      cta.appendChild(el('span', { class: 'substack-cta-arrow', html: '&rarr;' }));
      sub.appendChild(cta);
    }
    writingWrap.appendChild(sub);
  }

  if (w.instagram) {
    const insta = el('div', { class: 'card instagram-card', attrs: { 'data-type': 'Instagram' } });
    insta.appendChild(el('h3', { text: w.instagram.handle || 'Instagram' }));
    insta.appendChild(el('p', { text: 'Reflective and educational writing, in shorter form.' }));
    if (w.instagram.link) {
      insta.appendChild(el('a', { text: 'View profile', class: 'card-link', attrs: { href: w.instagram.link, target: '_blank', rel: 'noopener' } }));
    }
    writingWrap.appendChild(insta);
  }

  // motion.js hooks into freshly rendered [data-reveal] sections after this fires
  document.dispatchEvent(new Event('content-rendered'));
}

document.addEventListener('DOMContentLoaded', render);