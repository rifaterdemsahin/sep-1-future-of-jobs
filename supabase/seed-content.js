#!/usr/bin/env node
// Seeds public.content_blocks with the hand-authored production content
// that used to be hardcoded HTML on each page (source links, arguments,
// script beats, design specs, shot-board panels, etc.).
// Usage: node supabase/seed-content.js
//
// Safe to re-run: every row is inserted with ON CONFLICT (id) DO UPDATE.

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

// ---------------------------------------------------------------------
// index.html
// ---------------------------------------------------------------------
const indexBlocks = [
  // section: source-links (type: link-card)
  ...[
    { id: 'link-repo', tag: '🐙 Repo', title: 'rifaterdemsahin/sep-1-future-of-jobs', url: 'https://github.com/rifaterdemsahin/sep-1-future-of-jobs', urlDisplay: 'github.com/rifaterdemsahin/sep-1-future-of-jobs', desc: 'Repo' },
    { id: 'link-gemini', tag: '✨ Research chat', title: "Musk's Job Apocalypse Debunked — Gemini", url: 'https://gemini.google.com/app/732deb1f1441e2fd', urlDisplay: 'gemini.google.com/app/732deb1f1441e2fd', desc: 'Research chat' },
    { id: 'link-flow', tag: '🌊 Google Flow', title: 'Sep 07 · elon sep1 project', url: 'https://flow.google.com/u/1/project/ec557d11-2773-4887-babb-f12b65e4b7b7/edit/88f11cfc-17da-476b-8ff3-7e8bb5790963', urlDisplay: 'flow.google.com/…/88f11cfc-17da-476b-8ff3-7e8bb5790963', desc: 'Google Flow' },
    { id: 'link-yt-bzo3n3', tag: '▶️ YouTube · Musk thesis', title: "'Work Will Be Optional': Elon Musk's BIG Prediction", url: 'https://www.youtube.com/watch?v=BZo3n3Bkpn0', urlDisplay: 'youtube.com/watch?v=BZo3n3Bkpn0', desc: 'YouTube · Musk thesis' },
    { id: 'link-yt-hup6z5', tag: '🤖 YouTube · Optimus', title: 'Elon Musk REVEALS Tesla Bot (full presentation)', url: 'https://www.youtube.com/watch?v=HUP6Z5voiS8', urlDisplay: 'youtube.com/watch?v=HUP6Z5voiS8', desc: 'YouTube · Optimus' },
    { id: 'link-yt-r0uuhk', tag: '🤖 YouTube · Optimus', title: 'Tesla Optimus V3 Mass production by 2026', url: 'https://www.youtube.com/shorts/r0uuhk2RhGM', urlDisplay: 'youtube.com/shorts/r0uuhk2RhGM', desc: 'YouTube · Optimus' },
    { id: 'link-yt-yxjl1w', tag: '💬 YouTube · counterpoint', title: "OpenAI's Sam Altman on Astra Model Debut, Benefits of AI", url: 'https://www.youtube.com/watch?v=YxjL1wLLnHE', urlDisplay: 'youtube.com/watch?v=YxjL1wLLnHE', desc: 'YouTube · counterpoint' },
    { id: 'link-yt-u4zgls', tag: '💬 YouTube · counterpoint', title: 'Bill Gates Changes His Mind on AI', url: 'https://www.youtube.com/watch?v=U4zGLSlLo5A', urlDisplay: 'youtube.com/watch?v=U4zGLSlLo5A', desc: 'YouTube · counterpoint' },
    { id: 'link-yt-cprax', tag: '🤖 YouTube · Optimus', title: 'Optimus — Gen 2 | Tesla', url: 'https://www.youtube.com/watch?v=cpraXaw7dyc', urlDisplay: 'youtube.com/watch?v=cpraXaw7dyc', desc: 'YouTube · Optimus' },
    { id: 'link-yt-h3atwd', tag: '🗣️ YouTube · debate', title: 'Bernie vs. Claude', url: 'https://www.youtube.com/watch?v=h3AtWdeu_G0', urlDisplay: 'youtube.com/watch?v=h3AtWdeu_G0', desc: 'YouTube · debate' },
    { id: 'link-yt-55qwjh', tag: '💥 YouTube · Musk thesis', title: 'Elon Musk: "Working Will Be Optional in 10 Years" | AI Prediction', url: 'https://www.youtube.com/watch?v=55QWJHQw1MQ', urlDisplay: 'youtube.com/watch?v=55QWJHQw1MQ', desc: 'YouTube · Musk thesis' },
    { id: 'link-yt-5emsmi', tag: '🦿 YouTube · Advanced robotics', title: 'ATLAS: Hyundai and Boston Dynamics Reveal Their Humanoid Robots at CES 2026', url: 'https://www.youtube.com/watch?v=5eMSMiL7F2o', urlDisplay: 'youtube.com/watch?v=5eMSMiL7F2o', desc: 'YouTube · Advanced robotics' },
    { id: 'link-economist-jobs', tag: '📊 The Economist · Data', title: 'The Economist: Net AI Jobs Impact (2023–2026)', url: 'https://www.economist.com/', urlDisplay: 'economist.com · Hard-hat labour & STEM charts', desc: 'The Economist · Data' },
    { id: 'link-yt-3ljuyw', tag: '🌳 YouTube · counterpoint', title: 'The REAL Reason Everything Is About To Change', url: 'https://www.youtube.com/watch?v=3LjuyW5Lr-c&t=1229s', urlDisplay: 'youtube.com/watch?v=3LjuyW5Lr-c', desc: 'YouTube · counterpoint' },
    { id: 'link-yt-urgbqc', tag: '🎓 YouTube · Education', title: 'Rethinking Education Stress & AI-Driven Learning', url: 'https://www.youtube.com/shorts/urgbQCxcLG8', urlDisplay: 'youtube.com/shorts/urgbQCxcLG8', desc: 'YouTube · Education & Family Participation' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'source-links', position: i, type: 'link-card', data: d })),

  // section: pro-con-videos (type: video-row)
  ...[
    { id: 'cmp-musk-optional', title: 'Elon Musk: "Working Will Be Optional in 10 Years"', href: 'https://www.youtube.com/watch?v=55QWJHQw1MQ', sub: 'AI Prediction', angle: '💥 Job Apocalypse', pro: "Primary source for Musk's own thesis — cold open / hook material.", con: 'Assumes fixed-labor ("lump of labor") fallacy; no counter-evidence offered.' },
    { id: 'cmp-musk-big-prediction', title: "'Work Will Be Optional': Elon Musk's BIG Prediction", href: 'https://www.youtube.com/watch?v=BZo3n3Bkpn0', sub: 'How AI & Robotics Will Change Everything', angle: '💥 Job Apocalypse', pro: 'Longer-form version of the same thesis with more B-roll of robotics.', con: 'Same fixed-labor assumption; treats abundance as automatic, not earned.' },
    { id: 'cmp-atlas', title: 'ATLAS: Hyundai and Boston Dynamics Reveal Their Humanoid Robots at CES 2026', href: 'https://www.youtube.com/watch?v=5eMSMiL7F2o', angle: '💥 Job Apocalypse (grounding footage)', pro: "Real, current-day dexterity footage — good for the Moravec's Paradox segment (shows how far robots have actually come).", con: "Commercial deployment is factory-only and doesn't start until 2028 — don't let the footage imply general-purpose readiness." },
    { id: 'cmp-altman', title: "OpenAI's Sam Altman on Astra Model Debut, Benefits of AI", href: 'https://www.youtube.com/watch?v=YxjL1wLLnHE', angle: '🌳 Infinite Permutation', pro: 'Counterpoint voice from inside the AI industry itself, softens the "all doom" framing.', con: 'Still an interested party (OpenAI benefits from optimistic framing too).' },
    { id: 'cmp-gates', title: 'Bill Gates Changes His Mind on AI', href: 'https://www.youtube.com/watch?v=U4zGLSlLo5A', angle: '🌳 Infinite Permutation', pro: 'Credible, non-AI-vendor voice moving toward the optimistic camp — good for the "skeptic converted" beat.', con: 'Gates\' framing is closer to "some jobs safe" than "net job growth" — don\'t overstate it.' },
    { id: 'cmp-bernie', title: 'Bernie vs. Claude', href: 'https://www.youtube.com/watch?v=h3AtWdeu_G0', angle: '🧐 Skeptic / Marketing', pro: "Political-economy framing of who captures AI's gains — useful for the wealth-concentration counter-argument section.", con: 'Debate format, not a documentary source — cite the specific claim, not the whole video.' },
    { id: 'cmp-real-reason', title: 'The REAL Reason Everything Is About To Change', href: 'https://www.youtube.com/watch?v=3LjuyW5Lr-c&t=1229s', angle: '🌳 Infinite Permutation', pro: 'Strong, directly-on-thesis counterpoint: walks through the 1963 "computers will take all the jobs" Newsweek scare, the \'80s desktop-computer panic, and the Adobe Photoshop/photographer example — argues job counts have never declined after a tech revolution, only shifted and grown (farming 60%→2% of labor). Good source for the historical-precedent beat and the "fixed pie" fallacy.', con: 'Conversational/debate format between two founders, not neutral — pull specific data points (Newsweek 1963, farming labor %) rather than citing wholesale; auto-generated captions, verify quotes before using on screen.', transcript: '../transcripts/3LjuyW5Lr-c-the-real-reason-everything-is-about-to-change.txt' },
    { id: 'cmp-education-urgbqc', title: 'Rethinking Education & Student Stress', href: 'https://www.youtube.com/shorts/urgbQCxcLG8', sub: 'YouTube Short', angle: '🌳 Infinite Permutation / Education', pro: 'AI drops the cost of personalized education toward zero, unlocking universal family participation and relieving rote learning stress.', con: 'Short-form format — best paired with data on personalized AI tutoring and accessible STEM learning.' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'pro-con-videos', position: i, type: 'video-row', data: d })),

  // section: perspective-comparison (type: perspective-row)
  ...[
    { id: 'persp-apocalypse', emojiLabel: '💥 Job Apocalypse', sub: 'Musk, alt-tech, doom projections', argument: 'AI + humanoid robotics make human labor optional — cognitive and physical tasks scale at near-zero marginal cost.', pros: 'Unlocks an "era of abundance"; eliminates dangerous, repetitive labor.', cons: 'Risk of mass structural unemployment before markets adjust; concentrates power in a few platforms.' },
    { id: 'persp-permutation', emojiLabel: '🌳 Infinite Permutation', sub: "This video's thesis", argument: 'Technology lowers baseline task costs, unleashing new demand, markets, and specialized industries.', pros: 'Historical precedent (calculators, PCs, internet) multiplied net employment; human judgment becomes more valuable.', cons: 'Requires major re-skilling; short-term displacement during the transition.' },
    { id: 'persp-skeptic', emojiLabel: '🧐 Skeptic / Marketing', sub: 'Economic analysts, media critics', argument: 'Apocalypse predictions are hype that inflates AI-startup valuations.', pros: 'Prevents panic; focuses on real near-term gains over sci-fi scenarios.', cons: 'Underestimating real progress could leave workforce policy unprepared.' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'perspective-comparison', position: i, type: 'perspective-row', data: d })),

  // section: economist-report (single narrative block, type: rich-html)
  {
    id: 'economist-jobs-report', page: 'index.html', section: 'economist-report', position: 0, type: 'rich-html',
    data: {
      addedLabel: '🕒 Added: 9 Sep 2026, 10:02 BST',
      intro: 'These two charts from <i>The Economist</i> measure the net impact of the AI boom on US employment from 2023 through 2026 by comparing actual job counts to expected baseline hiring trends (<i>"Actual jobs minus jobs expected if sectors followed broader hiring trends"</i>).',
      html: '<h3 style="margin-top:0;color:var(--accent);">🧱 Chart 1: Hard-hat labour</h3>' +
        '<p>This chart displays <b>additional AI-related infrastructure jobs</b> (blue-collar/trades), showing a steady, accelerating rise from 2023 into 2026, reaching around 300,000 net additional jobs.</p>' +
        '<ul>' +
          '<li><b>Physical Data Center Boom:</b> Building out the physical infrastructure required to train and run AI models (data centers, power grids, cooling systems) requires physical labor that cannot be automated by software.</li>' +
          '<li><b>Key Sectors Driving Growth:</b>' +
            '<ul>' +
              '<li><b>Electrical contractors</b> (red) and <b>utility-system construction</b> (blue) make up the largest share, as AI facilities require massive electrical power grid expansions.</li>' +
              '<li><b>Commercial construction</b>, <b>HVAC &amp; plumbing</b> (for liquid and air cooling in server farms), and <b>electrical-equipment manufacturing</b> contribute the rest.</li>' +
            '</ul>' +
          '</li>' +
        '</ul>' +
        '<hr style="border:none;border-top:1px solid var(--panel-border);margin:18px 0;">' +
        '<h3 style="color:var(--accent-2);">💻 Chart 2: STEM with the flow</h3>' +
        '<p>This chart tracks <b>additional AI-related white-collar jobs</b>, total gain approaching ~600,000–700,000 net jobs by 2026, but with a distinct mid-period dip in specific roles.</p>' +
        '<ul>' +
          '<li><b>The Software Developer Dip (2024):</b> Notice how <b>Software developers</b> (red) dipped into negative territory throughout 2024 (down to around -100k relative to baseline). Early AI adoption increased code efficiency and enabled tech layoffs, briefly slowing hiring for entry-to-mid-level coders.</li>' +
          '<li><b>The Rebound &amp; Expansion (2025–2026):</b> By 2025, software developer hiring recovered back into positive growth alongside major increases in:' +
            '<ul>' +
              '<li><b>Maths &amp; data science</b> (orange) and <b>Info-security analysts</b> (light blue)</li>' +
              '<li><b>Engineers</b> (dark blue)</li>' +
              '<li><b>Other computer occupations</b> (grey), which forms the largest overall category as AI integration broadens across non-coding tech roles.</li>' +
            '</ul>' +
          '</li>' +
        '</ul>' +
        '<hr style="border:none;border-top:1px solid var(--panel-border);margin:18px 0;">' +
        '<h3 style="color:var(--warm);">🎯 Core Takeaway</h3>' +
        '<p style="margin-bottom:0;">The AI boom isn\'t just creating digital jobs—it is driving massive demand for physical infrastructure. While software engineering underwent a temporary correction in 2024 as companies adapted to AI tools, both physical infrastructure trades and white-collar STEM fields show strong overall net job creation driven by AI investment.</p>'
    }
  },

  // section: footage-shot-list (type: shot-row)
  ...[
    { id: 'footage-hook-optimus', sec: '🪝 Hook', warm: false, title: 'Tesla Optimus / Elon clips + headlines overlay', desc: 'Search "Tesla Bot presentation AI Day", "Elon Musk unveils Optimus robot". Screen-recorded news headline overlay graphics.', items: '<b>Tesla Optimus / Elon clips</b> — search "Tesla Bot presentation AI Day", "Elon Musk unveils Optimus robot". <b>Headlines overlay</b> — screen-recorded news headline graphics.' },
    { id: 'footage-hook-personal', sec: '👨‍👧 Hook — personal', warm: true, title: 'Candid family footage', desc: "Candid home footage or stylized shot with the creator's daughters, to establish the personal stake.", items: "Candid home footage or stylized shot with the creator's daughters, to establish the personal stake." },
    { id: 'footage-sec1-history', sec: '🪨 Section 1 — History', warm: false, title: 'Historical technology-shift archival', desc: 'Stone Age / early agriculture illustrations; black-and-white assembly-line archive (Ford Model T); 1980s office footage — search "1980s USA office workers on phones and computers Kinolibrary".', items: 'Stone Age / early agriculture illustrations; black-and-white assembly-line archive (Ford Model T); 1980s office footage — search "1980s USA office workers on phones and computers Kinolibrary".' },
    { id: 'footage-sec1-modern', sec: '🏭 Section 1 — Modern contrast', warm: false, title: 'Modern automation contrast', desc: 'Automated EV plant with robotic welding arms; financial graphs animating across a laptop screen.', items: 'Automated EV plant with robotic welding arms; financial graphs animating across a laptop screen.' },
    { id: 'footage-sec2-jobs', sec: '🌳 Section 2 — Emerging jobs', warm: true, title: 'Emerging job roles b-roll', desc: 'Technician with VR/AR headset and a holographic digital twin; warehouse AGV robot fleet oversight; creator editing video with AI tools.', items: 'Technician with VR/AR headset and a holographic digital twin; warehouse AGV robot fleet oversight; creator editing video with AI tools.' },
    { id: 'footage-sec3-math', sec: '🧮 Section 3 — Education & Math', warm: true, title: 'Math, AI tutoring & family participation b-roll', desc: 'Kids learning with personalized AI tutors, coding, or building with Lego Mindstorms; family learning together at home; teenager solving equations on a glass whiteboard; engineers collaborating around blueprints.', items: 'Kids with personalized AI tutors on tablets (ref: <b>yt/urgbQCxcLG8</b>); family learning together at home; teenager solving equations on a glass whiteboard; engineers collaborating around blueprints.' },
    { id: 'footage-robotics-ref', sec: '🦿 Advanced robotics reference', warm: false, title: 'Boston Dynamics Atlas reference', desc: 'Search "Boston Dynamics Atlas humanoid upgrade" or "Boston Dynamics research run" for high-energy contrast footage.', items: 'Boston Dynamics Atlas — search "Boston Dynamics Atlas humanoid upgrade" or "Boston Dynamics research run" for high-energy contrast footage.' },
    { id: 'footage-outro', sec: '🌅 Outro', warm: true, title: 'Closing optimism imagery', desc: 'Sunrise over a futuristic city skyline; a young girl looking toward the horizon — closing image of optimism.', items: 'Sunrise over a futuristic city skyline; a young girl looking toward the horizon — closing image of optimism.' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'footage-shot-list', position: i, type: 'shot-row', data: d }))
];

async function main() {
  const env = loadEnv(path.join(__dirname, '..', '.env'));
  const connectionString = env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error('SUPABASE_DB_URL not found in .env');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  const allBlocks = [...indexBlocks];

  for (const b of allBlocks) {
    await client.query(
      `insert into public.content_blocks (id, page, section, position, type, data)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (id) do update set
         page = excluded.page, section = excluded.section, position = excluded.position,
         type = excluded.type, data = excluded.data, updated_at = now()`,
      [b.id, b.page, b.section, b.position, b.type, JSON.stringify(b.data)]
    );
  }

  console.log(`Seeded ${allBlocks.length} content_blocks rows.`);
  await client.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
