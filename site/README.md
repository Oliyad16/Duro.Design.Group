# Duro Design Group — Website Handoff

Static single-page site (5 views: Home, Services, Work, About, Contact) navigated
client-side via a `go(pagename)` JS function — no page reloads, no framework.

## Project structure

```
index.html            → all page markup (sections toggled via JS)
assets/css/style.css   → all styling
assets/js/script.js    → navigation (go()), hero clicker, accordions, contact form
assets/images/         → all images, extracted from the original build (46 files)
vercel.json             → clean URL config
package.json            → local preview + deploy scripts
```

## Run locally

```
npm run dev
```
(or just open `index.html` directly in a browser — it has no build step)

## Deploy to Vercel

```
npm i -g vercel
vercel --prod
```
Or connect this folder as a Git repo in the Vercel dashboard and deploy from there — it's a static site, no build command required (leave "Framework Preset" as **Other**, no build command, output directory `/`).

## Locked brand constraints — do not deviate without checking with Alexis

- **Brand red:** `#FF2215` (sampled directly from the logo — do not substitute a different red)
- **Typefaces:** Fraunces (display/quotes) + Inter (body/UI) — no other fonts anywhere
  - Inter Bold for titles
  - Fraunces for all large display lines (Home headline, Services quote, Splash tagline, Contact headline)
- **Secondary headings:** 28px / weight 500 / −0.3px letter-spacing — not bold
- **Body copy:** 17px minimum site-wide
- **Top spacing:** 30px from titlebar to content, site-wide
- **Accordions:** collapsed on load, +/− icons, ~300ms ease-in-out, no divider lines inside blocks
- **`.wrap` (main content column):** capped at 1008px — this is intentional, it controls the Services page quote line-wrap. Don't widen it without checking — a previous attempt to widen it broke the quote's line count.
- **Footer (`.footwrap`):** intentionally uncapped (`max-width: none`) — spans full width, unlike the rest of the page content. This is correct, not a bug.

## Notes for the designer

- The `go()` function in `script.js` handles all page switching — sections are shown/hidden by ID, not routed via URL. If you want real URLs/routes for SEO, that's a restructuring conversation to have with Alexis first, not something to change silently.
- Images are plain files now (not base64-embedded) — feel free to optimize/compress them for production, but keep the same filenames referenced in `index.html`, or update the references if you rename them.
- Contact form currently submits via a `mailto:` JS function (`sendForm()`) — flag to Alexis if you want to wire it to a real form backend (e.g. Vercel-hosted API route, Formspree, etc.) since that's a functional change, not just styling.
