// This file is auto-loaded. To update site content, edit content.json — not this file.
let SITE_CONTENT = null;

/**
 * Fetches and loads the site content from content.json.
 * @async
 * @returns {Promise<Object>} The parsed content data object.
 */
async function loadContent() {
  const res = await fetch('content.json', { cache: 'no-store' });
  SITE_CONTENT = await res.json();
  return SITE_CONTENT;
}
