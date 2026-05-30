# DURO Website — Simplification Plan
**Branch:** `feat/simplification-pass`
**Source:** Client call (May 28) + 3 reference sites he ranked top-to-bottom
**Status:** Proposal — implement to a preview branch, ship to main after client review

---

## What the client actually said

> "It feels really good… but I want to simplify, less text, more middle-tech. I don't want to explain what we do — more a portfolio of work."
>
> "Animate the information, the picture could be static. More bare-boned."
>
> "All of them have a two-tone, top-of-page / bottom-of-page effect."
>
> "Maybe red and black only — red type is hard to read and a little aggressive. One color per type of box would be better."
>
> "Center project titles so they read better. Keep the liquid-selected-word thing — that's really cool."
>
> "When you hover over the image, the video should play." *(— but you and I chose to keep autoplay-always since the existing Harbor Bank one looks good that way.)*

---

## The 3 reference sites — what each does well

### 1. **drummondprojects.com** *(his #1 favorite — top-tier feel)*

The site's whole language is **ruthless negative space + institutional restraint**.

- **Palette:** Black text on pure white, zero color accents. The work itself is the only color on the page.
- **Hero:** A tagline ("FRAMING THE FUTURE") set in all-caps with massive leading and breathing room. **No subhead, no paragraph, no "what we do" copy.** Just three words and air.
- **/work page:** Filterable index by category (Commercial / Hospitality / Multifamily / Residential / Installation / Education & Cultural / All). Cards in a 2–3 column grid, **~4:3 landscape images**, each card = image + title + 📍 location + a one-line meta strip (Completion · Type · SF). No paragraphs anywhere.
- **Body:** Three value words — "REFINED / IMPACTFUL / INCLUSIVE" — that's it for explanatory copy. Each is paired with one photo.
- **Text-to-image ratio:** ~10–15% text. The page *refuses* to fill itself.
- **The high-tier move:** *Silence.* Five projects on the home page with massive breathing room instead of cramming twenty. That silence reads as confidence.

### 2. **emotivearch.com/portfolio** *(middle of his ranking)*

- **Palette:** Same monochrome white-and-near-black. Logo inverted in the header zone.
- **Portfolio page = nothing but a grid of images.** No filters, no descriptions, no categorization. 20+ projects, title only on each card. Linear chronological scroll.
- **Text-to-image ratio:** ~5% text. Even more ruthless than Drummond.
- **The high-tier move:** *Trust in the imagery.* Zero hand-holding. If you don't understand what each project is just from looking at it, you're not the audience.

### 3. **studiolaan.net** *(lower in his ranking but he liked elements)*

- Full-width hero **carousel** that auto-rotates through completed projects.
- Below: a small "What's New" card section (3 cards: an active project, a hiring post, a recent thing).
- The carousel itself is the move — it positions multiple completed works as the first impression, **portfolio-led instead of mission-statement-led.**

---

## What we already have that aligns

The current DURO site is already closer to this vocabulary than I think we give it credit for:

✅ Editorial typography (Fraunces serif + Inter sans) — this matches Drummond's tone better than a generic geometric sans would.
✅ Dark canvas with one accent color (DURO Red) — actually *the same recipe* the references use, just inverted.
✅ Project cards with image-first layout and clean metadata strips.
✅ Hover-state animations (the red-underline word effect he praised, "liquid selected words").
✅ Working video autoplay on Harbor Bank + AACW Museum hero cards.
✅ Centered project titles (just shipped).
✅ The detail overlay with arrow nav between projects (cleaner than most portfolio sites).

## What's misaligned

❌ **The home hero has a paragraph.** "The DMV's integrated architecture and engineering firm — built for the way public agencies actually procure, permit, and deliver work." That's a sales paragraph. Drummond's hero is *three words.*
❌ **Three big stat blocks** ("5 disciplines / 10+ years / X projects") below the hero — this is "explaining what we do," exactly what he said to cut.
❌ **The "Practice" section** with "Subconsultant coordination is the number-one source of risk on government projects…" — this is ~3 paragraphs of body copy where references would have zero.
❌ **About page** has multiple text-heavy sections — "We work where public memory meets public infrastructure" headline is great, but underneath it's paragraphs explaining the firm's approach.
❌ **Services page** is essentially all text.
❌ **No filter categorization on /projects** — Drummond filters by Commercial / Residential / etc. Our 5 projects don't need 7 filters, but at least 2–3 (Cultural · Civic · Preservation) would mirror the reference pattern.
❌ **No two-tone split.** The whole site is one tone (dark). The references all have a subtle tonal shift — usually a lighter section in the middle, or a flip from dark hero to light work-zone.
❌ **Stat-band, awards section, practice section** — these are all "tell" sections. References would *show* via project density instead.

---

## The plan — phased

### Phase 1: Cut text aggressively (the "less explaining" pass)

The single biggest move. Most of the lift, lowest risk.

| Page | Currently | Change to |
|---|---|---|
| **Home hero** | Long paragraph + "See our work" + "Request SF-330 portfolio" buttons | Just the headline + 1 ghost link "See work →". Kill the paragraph. |
| **Home stat band** (5 / 10+ / etc.) | 3 big numbers with captions | **Delete the section entirely.** References don't have it. |
| **Home "Practice" section** | ~3 paragraphs about subconsultant risk | Reduce to one pull-quote sized line. Or delete. |
| **Home "Selected work · 2023–2025"** | This is the strongest part of the site | **Keep — promote it.** Make it the dominant section. |
| **About page intro** | Paragraph after paragraph | Headline + one editorial line + a single quote. |
| **Services page** | Full text page | Convert to a clean list — 5 disciplines, one line each, no paragraphs. Or fold into About. |

**Why this works:** It directly does what he asked ("less text, more portfolio"). It mirrors how Drummond and Emotive operate.

### Phase 2: Two-tone split

References subtly shift tone mid-page. Concrete proposal:

- **Top zone (hero, intro):** keep the current dark canvas — black + warm-white text, red accent.
- **Work zone (project cards):** flip to **light** — warm off-white background, dark text. Project imagery pops harder against light, and the visual break gives the page rhythm.
- **Footer:** back to dark, mirrors the hero, bookends the page.

This is a real structural change but a single CSS gambit — we already have the `body.duro-night` class and the `:root` light defaults. We just need section-level theme classes (`.section-dark` / `.section-light`) instead of one global theme.

### Phase 3: Project index, Drummond-style

- Add **category filter pills** at the top of /projects: `All · Cultural · Civic · Preservation · Private`.
- Card layout cleanup — match Drummond's pattern: image + title + 📍 location + one-line meta strip. No paragraphs on cards. (We're already 80% there.)
- Image aspect ratio standardized to **4:3 landscape** across all cards (currently mixed 4/5, 3/4, 16/10) — gives the grid one rhythm.
- Keep the "View Project" detail overlay we have — it's actually better than what the references have.

### Phase 4: Color calming (his "one color per box" idea)

Tentative — he was still deciding. Three options to show him:

**A. Current:** dark canvas, red accent everywhere (titles, eyebrows, hover, links).
**B. Calmer:** red only on hover and the logo-dot. Eyebrows in muted gray, titles in white. Reduces the "aggressive" feel.
**C. Bold:** red on backgrounds (eyebrow tabs are red blocks, project type chips are red), but body type stays neutral. "One color per box" literally.

I'd build Phase 4 as a tweaks-panel option so he can flip between them live, decide, then we bake it in.

### Phase 5 (only if he wants): the carousel move

Studio Laan's auto-rotating hero carousel — he didn't explicitly ask for it but mentioned it as a thing he liked. Could be a Phase 5 if the static hero feels too quiet after Phase 1's text cuts.

---

## Suggested implementation order

| Step | Why this order |
|---|---|
| 1. Branch off main → `feat/simplification-pass` | Don't disturb the live deploy while iterating |
| 2. Phase 1 text cuts | Biggest visible win, lowest technical risk, exactly what he asked for |
| 3. Phase 3 projects-page filters + 4:3 grid | Builds on Phase 1, also concrete and unambiguous |
| 4. Phase 2 two-tone split | Bigger CSS change, do once the layout is stable |
| 5. Phase 4 color options exposed via tweaks panel | Last because it's his decision, not ours |
| 6. Push branch, send preview URL to client for review |  |
| 7. After his approval → merge to main → Vercel redeploys |  |

---

## What we're explicitly NOT doing (and why)

- ❌ **Redesigning typography.** Fraunces + Inter is already great — Drummond uses something similar in spirit. Don't fix what isn't broken.
- ❌ **Removing the red entirely.** He said "I do like it, I do like the way it looks." Just calm where it appears.
- ❌ **Removing the project-detail overlay.** It's a feature the references *don't* have. We lead here.
- ❌ **Adding a blog / insights / news section.** None of his references have one; he said "more a portfolio."
- ❌ **Generating more AI hero imagery before he approves the layout.** Sequence matters — layout first, fill in imagery as the layout demands it.
