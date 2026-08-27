# Dev Kumar — Portfolio

Live site for Dev Kumar: educator (English & Computer Applications) and web developer.
Static site, no build step, no framework — everything renders from one JSON file.

---

## How this is structured

```
index.html          the page skeleton — empty containers, no content of its own
content.json         ← ALL text, links, videos, and project data live here
css/style.css        every visual style (layout, motion, colors, fonts)
js/
  content.js          fetches content.json
  render.js           reads content.json and builds every section's HTML
  motion.js           scroll reveals + reading progress bar
images/               your photo + project screenshots
certificates/         certificate images
```

**The rule that makes this easy to maintain: you almost never touch HTML, CSS, or JS.**
Nearly everything you'd want to update — new project, new video, new certificate, changed
bio — is a `content.json` edit only. Save the file, commit, push. Vercel redeploys
automatically. No `npm install`, no build command, nothing to break.

You only need to touch the JS/CSS if you want a genuinely new *kind* of section (not more
of an existing kind). Adding your 6th project is a JSON edit. Adding a totally new "Talks"
section with its own layout would need code.

---

## Adding a new project

Open `content.json`, find `"building" → "projects"`, and add a new object to the array:

```json
{
  "name": "New Project Name",
  "description": "One or two sentences — what it does and who it's for.",
  "tech": ["React", "Supabase"],
  "link": "https://your-project.vercel.app",
  "image": "images/new-project.jpg"
}
```

Then drop the matching screenshot into `images/` with that exact filename. That's the
whole process — no other file changes.

Optional flags on any project:
- `"featured": true` — adds the gold "currently teaching with this" badge
- `"liveEmbed": true` — adds an "Open live preview" button that loads the real site in
  an iframe on click (only use this if the site doesn't block iframe embedding — most
  Vercel-hosted sites are fine by default)

## Adding a new video (tutorial, lesson, etc.)

Find the relevant spot in `"teaching"` — `videoFeature`, `csFeature`, `confidenceFeature`,
or add to the `officeTutorials.items` / `shorts.items` arrays. You only need the YouTube
video ID (the part after `youtu.be/` or `v=`), not the full URL:

```json
{ "title": "New tutorial title", "youtubeId": "abc123XYZ", "note": "optional caption" }
```

## Adding a certificate

Add to `"certificates" → "items"`:

```json
{
  "title": "Certificate Name",
  "issuer": "Issuing Body",
  "date": "2026",
  "image": "certificates/cert-name.jpg"
}
```

## Editing the intro / bio / links

All under `"profile"` at the top of `content.json` — `eyebrow`, `tagline`, `bio`,
`socials`. Plain text and links, no formatting needed.

---

## Capturing project screenshots

For consistent, clean screenshots that won't need re-cropping later:

1. Open the project in Chrome, then open DevTools (`F12` or `Cmd/Ctrl+Opt+I`)
2. Toggle **device toolbar** (`Cmd/Ctrl+Shift+M`), set a custom size of **1280 × 720**
   (matches the card's 16:9 aspect ratio, so nothing gets cropped oddly)
3. Navigate to a state that actually shows the product — a quiz mid-question, a
   dashboard with real content — not a blank landing screen or login page
4. `Cmd/Ctrl+Shift+P` → type "screenshot" → **Capture screenshot** (captures exactly
   the viewport you set)
5. Save as `.jpg` at ~80–85% quality (screenshots compress fine as JPG; keeps the repo
   light — PNG is unnecessary for this)

Desktop-only is enough — the *card* is already responsive, so a desktop-captured
screenshot displays fine inside it on any device. You don't need a separate mobile
screenshot.

---

## Local preview before pushing

No build tools needed — any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or the VS Code "Live Server" extension, or just open `index.html` directly in a browser
(most of it works fine that way too, though `content.json` fetches are more reliable
over a real local server).

---

## Deploying

**First-time setup:**
1. Push this repo to `dev913913/Dev-Portfolio` on GitHub
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
3. Framework preset: **Other** (static site, no build command/output directory needed)
4. Deploy

**After that:** every `git push` to `main` redeploys automatically. No dashboard steps,
no rebuilding — Vercel watches the repo.

```bash
git add .
git commit -m "Add [whatever you changed]"
git push
```

That's the entire workflow for every future update, forever — edit `content.json` (and
drop in an image if needed), commit, push, done.
