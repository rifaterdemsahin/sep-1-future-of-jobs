# 🧭 Menu Specification

Specification for the shared top navigation bar rendered by `js/nav.js`
(`Nav.render(currentId)`) on every page. One file, one menu — every page
stays in sync automatically. See [Related specs](#related-specs) for how
this fits into the rest of the project's documentation.

---

## 1. Layout

```
🎬 Job Apocalypse · Debunked   🧠 Remember ▾  💡 Understand ▾  🔎 Search ⌘K
                                📊 Analysis ▾  ⚖️ Evaluate ▾  ✨ Create ▾  🧰 Tools ▾
                                                          🔎 Search ⌘K  ⭐ Lvl N badge  🌐 Live
[ ▓▓▓▓▓▓▓▓░░░░░░░░░░ ]  ← nav-xp-bar (production progress, done/in-progress)
```

- Left: brand link (`index.html`).
- Center-left: seven top-level menu buttons, most as collapsible
  `<details>`/dropdown panels (`menu-toggle` + `menu-panel`), each with its
  own accent color from `MENU_COLORS`.
- Right: a second Search entry point, the gamified level badge, and a
  `🌐 Live` link to the current page's Cloudflare Workers equivalent.
- Bottom: an XP progress bar reflecting production-plan completion.
- A separate bottom-of-viewport bar (`renderBottomBar`) lists any tasks
  currently `in progress`, independent of the top nav.

## 2. Top-level menus

| Menu | Color | Type | Contents |
|---|---|---|---|
| 🧠 Remember | `#5ab0ff` | dropdown | Research, Arguments — source-gathering pages |
| 💡 Understand | `#4bcfa1` | dropdown | Script, Design, Previsualisation — synthesis pages |
| 🔎 Search | `#e8b94a` | modal (⌘K) | Command-palette search (see §4) |
| 📊 Analysis | `#b388ff` | dropdown | About this video, Sanity Check Report, Task Report |
| ⚖️ Evaluate | `#ffab40` | dropdown | Assets, Plain English Review |
| ✨ Create | `#ff5252` | dropdown | Canva Workshop, YouTube Studio (external, `_blank`) |
| 🧰 Tools | `#7be08a` | dropdown | ✅ Tasks + 6 collapsible tool groups (see §3) |

The grouping (Remember/Understand/Analysis/Evaluate) is a *cognitive*
grouping layered on top of the 7-stage pipeline defined in
`PROJECT_TEMPLATE_SPECS.md` §1 — it is not a new set of pages, just a
different lens for reaching the same `html/*.html` files. `todo.html`
(Production Plan) is deliberately excluded from Remember/Understand and
surfaced only as "✅ Tasks" inside 🧰 Tools.

### Pipeline pages (`PAGES` array)

| id | emoji | label | file | menu |
|---|---|---|---|---|
| research | 🔍 | Research | `index.html` | Remember |
| arguments | 🧩 | Arguments | `arguments.html` | Remember |
| script | 📝 | Script | `script.html` | Understand |
| design | 🎨 | Design | `design.html` | Understand |
| previsualisation | 🎞️ | Previsualisation | `previsualisation.html` | Understand |
| assets | 🗂️ | Assets | `assets.html` | Evaluate |
| todo | ✅ | Production Plan | `todo.html` | Tools → Tasks |

Non-pipeline pages (`about.html`, `sanity-check.html`, `task-report.html`,
`plain-english.html`) live only inside Analysis/Evaluate — they are not in
`PAGES` and are not indexed by the search palette's page results, but
**are** reachable and highlighted as `active` via `currentId` checks.

## 3. 🧰 Tools groups (`TOOL_GROUPS`)

Each group is an independently-collapsible `<details open>` accordion:

1. 🚀 **Deployment** — Cloudflare Worker Live, GitHub Pages, GitHub Repo
2. 🗄️ **Data & Storage** — Supabase Dashboard, Supabase Table Editor,
   Azure Portal, Azure Container, **Second Brain Server**
   (`http://localhost:30080/` — must be running before opening any local
   page, per the project's [Local-preview workflow](#related-specs)),
   Second Brain sample note
3. 🎬 **Production Tools** — Google Flow, Kokoro Voices, Canva Design
4. 🔬 **Research** — Gemini research thread, Grok, YouTube, The Economist
5. 👥 **Community** — Skool, Course
6. 🧰 **Browser Utilities** — Tab to Top extension

Adding/removing a tool means editing one entry in `TOOL_GROUPS` in
`js/nav.js` — it automatically appears in both the Tools dropdown *and*
the search index (§4).

## 4. 🔎 Search (command palette)

- Opens as a centered modal (`⌘K`/`Ctrl+K` from anywhere, or the Search
  button), not an anchored dropdown.
- Index is three sources merged at load time:
  1. `pageIndex` — the 7 `PAGES` entries (`kind: 'page'`)
  2. `toolIndex` — every tool inside `TOOL_GROUPS` (`kind: 'tool'`)
  3. `contentIndex` — every row in Supabase's `content_blocks` table
     (`kind: 'content'`), fetched once via `window.sb` and labeled by
     `data.title`/`fullTitle`/`num` — this is what makes the search box
     cover arguments, research notes, script beats, design specs, and
     shot panels without any of that content being hardcoded here.
- Ranking: title match on a page/tool (0) beats title match on content
  (1) beats a match buried only in a content block's body (2); top 10
  shown.
- Empty-query state shows up to 5 "Recent" picks (persisted to
  `localStorage['navSearchRecent']`) plus a "Jump to a page" list of all
  7 pipeline pages.
- Arrow keys navigate, Enter opens and records to Recent, Escape/outside
  click/✕ closes.

## 5. Gamified badge + bottom bar

- `getGamifiedStats()` derives level/rank/XP from `window.PRODUCTION_PLAN`
  (11 stages, each a list of tasks with `status: done|progress|todo`),
  merged with any per-task `localStorage['todoStatusOverrides']` and
  `localStorage['todoCustomTasks']` set on `todo.html`.
- The top-nav badge (`⭐ Lvl N`) and `nav-xp-bar` reflect this everywhere;
  `todo.html` is the only page that can change it.
- `renderBottomBar()` renders a separate fixed bar at the bottom of every
  page listing tasks currently `progress`, with a click-through modal to
  mark done / revert / jump to Production Plan.

## 6. Editing rule

**Only edit `js/nav.js`.** Never hand-copy nav markup into an `html/*.html`
file — every page renders it from `PAGES` / `TOOL_GROUPS` /
`PRODUCTION_PLAN` via `Nav.render(currentId)` on a `#nav-mount` element,
which is exactly what keeps all pages in sync (see the file's own header
comment, `js/nav.js:1-7`).

---

## Related specs

- **[`PROJECT_TEMPLATE_SPECS.md`](PROJECT_TEMPLATE_SPECS.md)** — the
  architecture this menu sits on top of: the 7-stage `html/` pipeline
  (§1), the `content_blocks` table this menu's search indexes live-content
  from (§2), and the local-preview command (`python3 -m http.server 30080`)
  that the Tools → Data & Storage → Second Brain Server entry assumes is
  already running (§3 step 5, and this repo's `CLAUDE.md`).
- **[`README.md`](README.md)** — the canonical live URLs this menu's
  🌐 Live link and 🚀 Deployment tool group point to, and confirms content
  (not nav structure) lives in Supabase.
- **[`REPORT.md`](REPORT.md)** — migration history explaining *why*
  assets/notes/ratings moved to Supabase tables that back the Evaluate →
  Assets page and the search palette's content index.
