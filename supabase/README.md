# Supabase backend

This project's browser-side data — assets, notes, ratings, and cross-stage
links — is stored in a Supabase Postgres database instead of
`localStorage`/cookies, so it's shared across devices/browsers.

- **Project:** `mdsykpdkdprtmkccukle` (https://mdsykpdkdprtmkccukle.supabase.co)
- **Schema:** [`schema.sql`](./schema.sql)
- **Client:** [`../supabase-client.js`](../supabase-client.js) creates a
  single `window.sb` Supabase JS client, loaded on every page before
  `theme.js`/`notes.js`/`assets.js`/`ratings.js`/`links.js`.

## Tables

| Table | Replaces | Columns |
|---|---|---|
| `assets` | `assets.js` localStorage (`jobApocalypse_assets_v1`) | `id, type, title, description, source, url, comment, added_at` |
| `notes` | `notes.js` cookie (`jobApocalypse_notes_v1`) + Azure blob sync | `id (uuid), page, text, created_at` |
| `item_notes` | `notes.js` cookie (`jobApocalypse_itemNotes_v1`) + Azure blob sync | `id, text, updated_at` |
| `ratings` | `ratings.js` cookie (`jobApocalypse_ratings_v1`) | `id, stars, updated_at` |
| `links` | `links.js` localStorage (`jobApocalypse_links_v1`) | `key, linked_ids (text[]), updated_at` |

All tables have Row Level Security enabled with a permissive "anon full
access" policy — this is a single-user pre-production tool with no login,
so the anon public API key can read/write everything.

## Applying the schema

```bash
npm install pg --no-save   # if not already installed
node supabase/apply-schema.js
```

Reads `SUPABASE_DB_URL` from `.env` (git-ignored) and runs `schema.sql`
against the live database. Safe to re-run — every statement is
`create table if not exists` / `drop policy if exists`.

## Credentials

- `SUPABASE_DB_URL` (direct Postgres connection, used only by
  `apply-schema.js`) and `SUPABASE_ANON_KEY` (used by the browser client)
  live in `.env`, which is git-ignored.
- The anon key is safe to ship in client-side JS by design — Supabase
  scopes its access via RLS policies, not secrecy.
- A copy of both is also stored in the `dp-kv-deliverypilot` Azure Key
  Vault as `sep1-supabase-db-url`, `sep1-supabase-url`, and
  `sep1-supabase-anon-key`.
