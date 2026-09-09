-- Schema for the "Job Apocalypse" pre-production site.
-- Replaces localStorage/cookie-based storage in assets.js, notes.js,
-- ratings.js and links.js with Supabase Postgres tables.
--
-- Single-user tool (no auth system in the app), so RLS is enabled with
-- permissive anon policies scoped to the anon/public API key. Run with:
--   node supabase/apply-schema.js

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- assets: items saved via the "Add to Assets" buttons across pages
-- ---------------------------------------------------------------------
create table if not exists public.assets (
  id          text primary key,          -- matches data-id on .add-asset-btn
  type        text not null default 'item',
  title       text not null default '',
  description text not null default '',
  source      text not null default '',
  url         text not null default '',
  comment     text not null default '',
  added_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- notes: free-form notes for the "Video Production Agent" bar
-- ---------------------------------------------------------------------
create table if not exists public.notes (
  id         uuid primary key default gen_random_uuid(),
  page       text not null,              -- e.g. index.html, script.html
  text       text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- item_notes: one note per catalog item (id -> text)
-- ---------------------------------------------------------------------
create table if not exists public.item_notes (
  id         text primary key,           -- catalog item id
  text       text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ratings: 1-5 star rating per catalog item
-- ---------------------------------------------------------------------
create table if not exists public.ratings (
  id         text primary key,           -- catalog item id
  stars      smallint not null check (stars between 0 and 5),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- links: cross-stage links between catalog items
--   key = "<sourceFile>|<itemId>", linked_ids = array of linked item ids
-- ---------------------------------------------------------------------
create table if not exists public.links (
  key        text primary key,
  linked_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security: public tool, no auth, anon key does everything.
-- ---------------------------------------------------------------------
alter table public.assets     enable row level security;
alter table public.notes      enable row level security;
alter table public.item_notes enable row level security;
alter table public.ratings    enable row level security;
alter table public.links      enable row level security;

drop policy if exists "anon full access" on public.assets;
create policy "anon full access" on public.assets
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.notes;
create policy "anon full access" on public.notes
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.item_notes;
create policy "anon full access" on public.item_notes
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.ratings;
create policy "anon full access" on public.ratings
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.links;
create policy "anon full access" on public.links
  for all using (true) with check (true);
