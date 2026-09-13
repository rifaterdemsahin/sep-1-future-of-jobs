# Project workflow

This is a static HTML site (`html/index.html`, `html/arguments.html`,
`html/script.html`, `html/design.html`, `html/previsualisation.html`,
`html/assets.html`, JS in `js/`, shared CSS in `css/shared.css`) for
pre-production notes on the "Job Apocalypse · Debunked" video. No build
step. Root `index.html` is just a redirect stub into `html/index.html`.
Per-page content (source links, arguments, script beats, design specs,
shot panels) is stored in Supabase's `content_blocks` table and rendered
client-side — see `supabase/seed-content.js` to edit it, not the HTML.

## Before opening any local page

Always make sure the Second Brain server at `http://localhost:30080/` is
running before opening any page from this project (locally or otherwise).
Start it if it isn't already up.

## Single-branch rule

This repo only ever has one branch: `main`. Never create, push to, or check
out any other branch — commit and push directly to `main`.

## After making changes

Always finish a change with this sequence:

1. Run a local static server for the project directory and open the main
   page (`html/index.html`) in Google Chrome to visually confirm the
   change (per global preference, use `open -a "Google Chrome" <url>`,
   not the default browser).
2. Commit and push to `main` (only when the user has asked for the change
   to be committed).
3. Open the GitHub commit page for the commit just pushed (i.e.
   `https://github.com/rifaterdemsahin/sep-1-future-of-jobs/commit/<sha>`)
   in Chrome so the diff can be reviewed on GitHub.

Repo: https://github.com/rifaterdemsahin/sep-1-future-of-jobs
