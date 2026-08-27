// This file is auto-loaded. To update site content, edit content.json — not this file.
let SITE_CONTENT = null;

async function loadContent() {
  const res = await fetch('content.json', { cache: 'no-store' });
  SITE_CONTENT = await res.json();
  return SITE_CONTENT;
}
