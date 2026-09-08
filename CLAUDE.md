# Project workflow

This is a static HTML site (`index.html`, `script.html`, `design.html`,
`previsualisation.html`, `assets.html` + `assets.js`) for pre-production
notes on the "Job Apocalypse · Debunked" video. No build step.

## After making changes

Always finish a change with this sequence:

1. Run a local static server for the project directory and open the main
   page (`index.html`) in Google Chrome to visually confirm the change
   (per global preference, use `open -a "Google Chrome" <url>`, not the
   default browser).
2. Commit and push to `main` (only when the user has asked for the change
   to be committed).
3. Open the GitHub commit page for the commit just pushed (i.e.
   `https://github.com/rifaterdemsahin/sep-1-future-of-jobs/commit/<sha>`)
   in Chrome so the diff can be reviewed on GitHub.

Repo: https://github.com/rifaterdemsahin/sep-1-future-of-jobs
