# Job Apocalypse · Debunked

Pre-production notes for the video **"Why Elon Musk is Wrong About the Job
Apocalypse."** Static HTML, no build step, no framework — open a file in a
browser and it works.

- **Repo:** https://github.com/rifaterdemsahin/sep-1-future-of-jobs
- **Live site (Cloudflare Workers — canonical):**
  - 🔍 [Research](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/index.html)
  - 🧩 [Arguments](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/arguments.html)
  - 📝 [Script](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/script.html)
  - 🎨 [Design](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/design.html)
  - 🎞️ [Previsualisation](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/previsualisation.html)
  - 🗂️ [Assets](https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/assets.html)
  - The bare domain (`/`) redirects to `/html/index.html`.
  - Deployed via `wrangler deploy` (see `wrangler.toml`); redeploy after
    any change with `npx wrangler deploy`.
- **GitHub Pages:** still builds from this repo, but every page redirects
  (`location.replace`) to the matching Cloudflare Workers URL above —
  GitHub Pages is a forwarding address, not a second copy of the site.
- **Data:** every page's actual content — source links, arguments, script
  beats, design specs, shot panels — plus assets, notes, ratings, and
  cross-stage links, is stored in Supabase (see `supabase/README.md`), not
  hardcoded in the HTML or in per-browser storage. `assets.html` is the
  only page whose data still lives solely in the `assets` table by design
  (it's a save-list, not authored content).
- **Run locally:** run a local static server (`python3 -m http.server`)
  from the repo root and browse to `/html/index.html` — the pages use
  relative `../js/`, `../css/`, `../images/` paths, so `file://` won't
  resolve them; a server is required. The GitHub Pages redirect only
  triggers on a `github.io` hostname, so local runs are unaffected.

## Folder structure

```
html/    the 6 pages (index, arguments, script, design, previsualisation, assets)
js/      shared JS modules loaded by every page
css/     shared.css — theme variables, base body reset, top nav
images/  storyboard panel images (previsualisation)
supabase/  schema + seed scripts
index.html   root redirect stub → html/index.html
```

## The pipeline

Pre-production is modelled as five linked stages, each feeding the next.
`js/pipeline.js` renders the stepper you see at the top of every stage
page, so the site itself documents the flow:

| # | Stage | Page | What it holds |
|---|-------|------|----------------|
| 1 | 🔍 [Research](html/index.html) | `html/index.html` | Source links, counter-arguments, pro/con video comparisons, footage leads |
| 2 | 🧩 [Arguments](html/arguments.html) | `html/arguments.html` | Premise, arguments, and conclusion — the video's actual case, distilled from Research |
| 3 | 📝 [Script](html/script.html) | `html/script.html` | Voiceover beats broken into timed sections |
| 4 | 🎨 [Design](html/design.html) | `html/design.html` | Palette, typography, pacing and motion specs, structured as a 3-act story |
| 5 | 🎞️ [Previsualisation](html/previsualisation.html) | `html/previsualisation.html` | Shot-by-shot board, ready for the edit — plus a "How this gets explained in plain English" note on every panel |

The top nav (`js/nav.js`) lists the pages in a slightly different order —
Arguments before Research — and colors each link along one light-to-dark
hue so the six stages read as a sequence at a glance.

A supporting page sits alongside the pipeline rather than inside it:

- 🗂️ [Assets](html/assets.html) (`html/assets.html` / `js/assets.js`) — B-roll
  and archival categories mapped to script sections, with YouTube search
  terms to source each one. Pulled into from Research/Arguments/Script/
  Design/Previsualisation wherever a shot needs footage. Can be sorted by
  save date or by each item's expected time code in the final video.

### Rationale — why this shape

The pipeline mirrors how the video actually gets made, and each arrow is a
real dependency, not just a navigation convenience:

- **Research → Arguments.** Raw sources and counter-evidence collected in
  Research get distilled into one premise, a short set of arguments, and
  a conclusion — the actual case the video makes, separated from the
  research pile it was mined from.
- **Arguments → Script.** Each argument becomes a voiceover beat and shot
  direction — you can't write the script until the case itself (not just
  the raw research) is locked.
- **Script → Design.** Each beat's mood (cold/apocalypse vs. warm/human)
  drives the visual style rules — palette and pacing follow the emotional
  arc of the script, not the other way round.
- **Design → Previsualisation.** The three-act pacing and motion specs
  become the shot list — once the look and rhythm are locked, shots can be
  boarded against them.
- **Previsualisation is the last stop before shoot/edit** — everything
  upstream exists to make that shot list unambiguous.

Keeping every stage as a plain page (rather than one long doc) lets each
one carry its own review/rating tooling — e.g. the star-rating + re-sort
on Research's source links and video comparison table (`js/ratings.js`) —
without cluttering the others.

## How content loads

Every page has a "🗄️ Database" button in the bottom notes bar that opens a
modal explaining exactly this for that page. In short:

1. `js/supabase-client.js` creates one shared `window.sb` client per page.
2. `js/content-db.js` fetches all rows from `content_blocks` (Supabase
   Postgres) and exposes a `.ready` promise plus `getBlocks(page, section)`.
3. Each page's own inline script waits on `ContentDB.ready` (and
   `AssetDB.ready` where relevant) before building any HTML — the cards,
   argument blocks, script beats, design specs, and shot panels you see
   are all rendered client-side from the rows that come back, using the
   same item ids the old static markup used, so existing ratings/notes/
   saved-assets keyed by those ids kept working across the migration.
4. `supabase/seed-content.js` is the source of truth for that content —
   edit it and re-run `node supabase/seed-content.js` to update the DB
   (upserts by id, safe to re-run).

Cross-stage "🔗 Linked to…" pickers (`js/links.js`) read the same
`content_blocks` rows for the previous stage instead of scraping that
page's HTML, so they keep working now that content is DB-rendered.

## Other files

| File | Purpose |
|------|---------|
| `js/pipeline.js` | Renders the Research → Arguments → Script → Design → Previsualisation stepper on each stage page |
| `js/nav.js` | Renders the top navigation bar (single source of truth, was previously duplicated per page) |
| `js/content-db.js` | Fetches `content_blocks` and exposes it to each page's render code |
| `js/links.js` | Cross-stage linking — dropdown multi-selects that jump between related items on different pipeline stages |
| `js/theme.js` | 7-mode theme switcher (Dark, Light, Midnight, Sepia, Ocean, Grape, High Contrast) |
| `js/ratings.js` | Star-rating + re-sort for tables/cards |
| `js/notes.js` | The bottom "Notes for Video Production Agent" bar, per-item note boxes, and the "🗄️ Database" explainer modal |
| `js/audio-clips.js` | Manifest of Kokoro voice-over clips already saved to Azure Blob Storage, so Arguments' voice-over bar can skip a re-generation call when a clip already exists |
| `css/shared.css` | Theme variables, base body reset, top nav — the CSS that used to be duplicated in every page's `<style>` block |
| `transcripts/` | Raw transcripts backing the Research page's source links |

## Workflow

See `CLAUDE.md` for the standard change → preview → commit → push →
review-on-GitHub sequence used on this repo.
