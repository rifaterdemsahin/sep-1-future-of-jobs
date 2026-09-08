# Job Apocalypse · Debunked

Pre-production notes for the video **"Why Elon Musk is Wrong About the Job
Apocalypse."** Static HTML, no build step, no framework — open a file in a
browser and it works.

- **Repo:** https://github.com/rifaterdemsahin/sep-1-future-of-jobs
- **Live pages:** open any `.html` file directly, or run a local static
  server (`python3 -m http.server`) and browse to `index.html`.

## The pipeline

Pre-production is modelled as four linked stages, each feeding the next.
`pipeline.js` renders the stepper you see at the top of every stage page,
so the site itself documents the flow:

| # | Stage | Page | What it holds |
|---|-------|------|----------------|
| 1 | 🔍 [Research](index.html) | `index.html` | Source links, counter-arguments, pro/con video comparisons, footage leads |
| 2 | 📝 [Script](script.html) | `script.html` | Voiceover beats broken into timed sections |
| 3 | 🎨 [Design](design.html) | `design.html` | Palette, typography, pacing and motion specs, structured as a 3-act story |
| 4 | 🎞️ [Previsualisation](previsualisation.html) | `previsualisation.html` | Shot-by-shot board, ready for the edit |

A supporting page sits alongside the pipeline rather than inside it:

- 🗂️ [Assets](assets.html) (`assets.html` / `assets.js`) — B-roll and
  archival categories mapped to script sections, with YouTube search terms
  to source each one. Pulled into from Research/Design/Previsualisation
  wherever a shot needs footage.

### Rationale — why this shape

The pipeline mirrors how the video actually gets made, and each arrow is a
real dependency, not just a navigation convenience:

- **Research → Script.** Arguments and footage leads collected in Research
  become voiceover beats and shot direction — you can't write the script
  until you know what you're arguing against and what evidence backs the
  rebuttal.
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
on Research's source links and video comparison table (`ratings.js`) —
without cluttering the others.

## Other files

| File | Purpose |
|------|---------|
| `pipeline.js` | Renders the Research → Script → Design → Previsualisation stepper on each stage page |
| `links.js` | Cross-stage linking — dropdown multi-selects that jump between related items on different pipeline stages |
| `theme.js` | 7-mode theme switcher (Dark, Light, Midnight, Sepia, Ocean, Grape, High Contrast) |
| `ratings.js` | Star-rating + re-sort for tables/cards, persisted in a cookie per browser |
| `transcripts/` | Raw transcripts backing the Research page's source links |

## Workflow

See `CLAUDE.md` for the standard change → preview → commit → push →
review-on-GitHub sequence used on this repo.
