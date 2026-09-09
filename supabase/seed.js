#!/usr/bin/env node
// Comprehensive seed script for the Supabase Postgres database.
// Populates assets, notes, item_notes, ratings, and cross-stage links.
// Usage: node supabase/seed.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv(envPath) {
  const out = {};
  if (!fs.existsSync(envPath)) return out;
  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  });
  return out;
}

function extractAssetsFromHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const items = [];
  const regex = /<button[^>]*class=["'][^"']*add-asset-btn[^"']*["'][^>]*>/gi;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const tag = match[0];
    const getAttr = (name) => {
      const attrMatch = tag.match(new RegExp(`data-${name}=["']([^"']*)["']`, 'i'));
      return attrMatch ? attrMatch[1] : '';
    };

    const id = getAttr('id');
    if (!id) continue;

    items.push({
      id: id,
      type: getAttr('type') || 'item',
      title: getAttr('title') || id,
      description: getAttr('desc') || '',
      source: getAttr('source') || path.basename(filePath),
      url: getAttr('url') || path.basename(filePath),
      comment: 'Seeded from ' + path.basename(filePath)
    });
  }
  return items;
}

async function main() {
  const env = loadEnv(path.join(__dirname, '..', '.env'));
  const connectionString = env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error('SUPABASE_DB_URL not found in .env');
    process.exit(1);
  }

  const stageFiles = [
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '..', 'arguments.html'),
    path.join(__dirname, '..', 'script.html'),
    path.join(__dirname, '..', 'design.html'),
    path.join(__dirname, '..', 'previsualisation.html')
  ];

  let allAssets = [];
  for (const file of stageFiles) {
    if (fs.existsSync(file)) {
      allAssets = allAssets.concat(extractAssetsFromHtml(file));
    }
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    console.log('--- Applying Schema ---');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('Schema verified & updated.');

    console.log('--- Seeding Assets ---');
    for (const item of allAssets) {
      await client.query(`
        INSERT INTO public.assets (id, type, title, description, source, url, comment, added_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (id) DO UPDATE SET
          type = EXCLUDED.type,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          source = EXCLUDED.source,
          url = EXCLUDED.url,
          comment = EXCLUDED.comment
      `, [item.id, item.type, item.title, item.description, item.source, item.url, item.comment]);
    }
    console.log(`Seeded ${allAssets.length} assets.`);

    console.log('--- Seeding Ratings ---');
    const sampleRatings = [
      { id: 'cmp-musk-optional', stars: 5 },
      { id: 'cmp-musk-big-prediction', stars: 5 },
      { id: 'cmp-altman', stars: 4 },
      { id: 'cmp-gates', stars: 4 },
      { id: 'cmp-bernie', stars: 4 },
      { id: 'link-repo', stars: 5 },
      { id: 'link-gemini', stars: 5 },
      { id: 'link-flow', stars: 5 },
      { id: 'link-yt-bzo3n3', stars: 5 },
      { id: 'link-yt-55qwjh', stars: 4 },
      { id: 'link-yt-urgbqc', stars: 5 },
      { id: 'argument-1', stars: 5 },
      { id: 'argument-2', stars: 5 },
      { id: 'argument-3', stars: 4 },
      { id: 'argument-6', stars: 5 },
      { id: 'beat-hook', stars: 5 },
      { id: 'beat-section1', stars: 5 },
      { id: 'beat-section2', stars: 4 },
      { id: 'shot-1', stars: 5 },
      { id: 'shot-2', stars: 5 },
      { id: 'shot-5', stars: 5 },
      { id: 'shot-7', stars: 5 }
    ];
    for (const r of sampleRatings) {
      await client.query(`
        INSERT INTO public.ratings (id, stars, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET stars = EXCLUDED.stars, updated_at = NOW()
      `, [r.id, r.stars]);
    }
    console.log(`Seeded ${sampleRatings.length} ratings.`);

    console.log('--- Seeding Notes ---');
    const sampleNotes = [
      { page: 'index.html', text: 'Research verified: Prior automation waves increased net employment. Focus video on education & tool multiplication.' },
      { page: 'arguments.html', text: 'Key premise locked: AI relocates and multiplies work, rather than shrinking the total pool.' },
      { page: 'script.html', text: 'Pacing check: Hook should be sharp (30s), transition smoothly to historical proof by 1:45.' },
      { page: 'design.html', text: 'Visual palette: Cold slate blue for the panic/apocalypse thesis, transitioning to warm gold for human agency.' },
      { page: 'previsualisation.html', text: 'Shot 5 tree graphic must emphasize emerging multi-disciplinary job titles.' }
    ];
    for (const n of sampleNotes) {
      await client.query(`
        INSERT INTO public.notes (page, text, created_at)
        VALUES ($1, $2, NOW())
      `, [n.page, n.text]);
    }
    console.log(`Seeded ${sampleNotes.length} general production notes.`);

    console.log('--- Seeding Item Notes ---');
    const sampleItemNotes = [
      { id: 'argument-1', text: 'Reference spreadsheet automation / ATM effect to ground this argument clearly.' },
      { id: 'argument-6', text: 'Highlight personalized AI tutor short (yt/urgbQCxcLG8).' },
      { id: 'beat-hook', text: 'Include Elon robot demo overlays during first 15 seconds.' },
      { id: 'shot-5', text: 'Gold tree expanding animation creates strong emotional payoff.' }
    ];
    for (const inote of sampleItemNotes) {
      await client.query(`
        INSERT INTO public.item_notes (id, text, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, updated_at = NOW()
      `, [inote.id, inote.text]);
    }
    console.log(`Seeded ${sampleItemNotes.length} item notes.`);

    console.log('--- Seeding Cross-Stage Links ---');
    const sampleLinks = [
      { key: 'script.html|beat-hook', ids: ['argument-premise', 'shot-1', 'shot-2'] },
      { key: 'script.html|beat-section1', ids: ['argument-1', 'shot-3', 'shot-4'] },
      { key: 'script.html|beat-section2', ids: ['argument-2', 'argument-7', 'shot-5'] },
      { key: 'script.html|beat-section3', ids: ['argument-5', 'argument-6', 'shot-6', 'shot-7'] },
      { key: 'script.html|beat-outro', ids: ['argument-conclusion', 'shot-9'] }
    ];
    for (const link of sampleLinks) {
      await client.query(`
        INSERT INTO public.links (key, linked_ids, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET linked_ids = EXCLUDED.linked_ids, updated_at = NOW()
      `, [link.key, link.ids]);
    }
    console.log(`Seeded ${sampleLinks.length} cross-stage links.`);

    console.log('\n✅ All tables populated successfully!');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Execution failed:', err);
  process.exit(1);
});
