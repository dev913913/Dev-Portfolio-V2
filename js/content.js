// This file is auto-loaded. To update site content, edit content.json — not this file.
let SITE_CONTENT = null;

/**
 * Fetches and loads the site content from content.json.
 * Uses the normal HTTP cache (Vercel revalidates it on each deploy), and
 * throws a readable error if the file is missing or malformed.
 * @async
 * @returns {Promise<Object>} The parsed content data object.
 */
async function loadContent() {
  const res = await fetch('content.json');
  if (!res.ok) throw new Error(`content.json returned ${res.status}`);
  SITE_CONTENT = await res.json();
  return SITE_CONTENT;
}
