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
    { id: 'cmp-real-reason', title: 'The REAL Reason Everything Is About To Change', href: 'https://www.youtube.com/watch?v=3LjuyW5Lr-c&t=1229s', angle: '🌳 Infinite Permutation', pro: 'Strong, research-verified counterpoint: walks through the 1963 Newsweek computer panic, 1980s PCs, and Photoshop to prove prior automation waves increased net employment. Solid basis for focusing the video on tool multiplication and education.', con: 'Conversational/debate format between two founders, not neutral — pull specific data points (Newsweek 1963, farming labor %) rather than citing wholesale; auto-generated captions, verify quotes before using on screen.', transcript: '../transcripts/3LjuyW5Lr-c-the-real-reason-everything-is-about-to-change.txt' },
    { id: 'cmp-education-urgbqc', title: 'Rethinking Education & Student Stress', href: 'https://www.youtube.com/shorts/urgbQCxcLG8', sub: 'YouTube Short', angle: '🌳 Infinite Permutation / Education', pro: 'AI drops the cost of personalized education toward zero, unlocking universal family participation and relieving rote learning stress.', con: 'Short-form format — best paired with data on personalized AI tutoring and accessible STEM learning.' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'pro-con-videos', position: i, type: 'video-row', data: d })),

  // section: perspective-comparison (type: perspective-row)
  ...[
    { id: 'persp-apocalypse', emojiLabel: '💥 Job Apocalypse', sub: 'Musk, alt-tech, doom projections', argument: 'AI + humanoid robotics make human labor optional — cognitive and physical tasks scale at near-zero marginal cost.', pros: 'Unlocks an "era of abundance"; eliminates dangerous, repetitive labor.', cons: 'Risk of mass structural unemployment before markets adjust; concentrates power in a few platforms.' },
    { id: 'persp-permutation', emojiLabel: '🌳 Infinite Permutation', sub: "This video's thesis · Research Verified", argument: 'Research verified: Prior automation waves increased net employment. Technology lowers baseline task costs, multiplying work and opening new sectors. The video focuses on education democratization & tool multiplication.', pros: 'Historical precedent across every automation wave (agriculture, industrial machinery, calculators, PCs, internet) multiplied net employment; education & AI tool multiplication elevate human leverage and judgment.', cons: 'Requires continuous learning & multi-disciplinary skill adaptation during the transition.' },
    { id: 'persp-skeptic', emojiLabel: '🧐 Skeptic / Marketing', sub: 'Economic analysts, media critics', argument: 'Apocalypse predictions are hype that inflates AI-startup valuations.', pros: 'Prevents panic; focuses on real near-term gains over sci-fi scenarios.', cons: 'Underestimating real progress could leave workforce policy unprepared.' }
  ].map((d, i) => ({ id: d.id, page: 'index.html', section: 'perspective-comparison', position: i, type: 'perspective-row', data: d })),

  // section: economist-report (single narrative block, type: rich-html)
  {
    id: 'economist-jobs-report', page: 'index.html', section: 'economist-report', position: 0, type: 'rich-html',
    data: {
      addedLabel: '🕒 Added: 9 Sep 2026, 10:02 BST · Research Verified',
      intro: 'These two charts from <i>The Economist</i> measure the net impact of the AI boom on US employment from 2023 through 2026, verifying that technological transformation increases net employment across physical infrastructure and specialized STEM roles.',
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
        '<h3 style="color:var(--warm);">🎯 Core Takeaway — Tool Multiplication &amp; Net Employment</h3>' +
        '<p style="margin-bottom:0;">Research verified: Prior automation waves consistently grew net employment. The AI boom follows this exact pattern by expanding physical infrastructure trades and white-collar STEM opportunities. By focusing on education democratization and tool multiplication, humanity gains exponential leverage to solve complex challenges.</p>'
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

// ---------------------------------------------------------------------
// arguments.html
// ---------------------------------------------------------------------
const argumentsBlocks = [
  {
    id: 'argument-core-message', page: 'arguments.html', section: 'core-message', position: 0, type: 'core-message',
    data: {
      title: 'Core Message', tag: '✨ Vision & Purpose',
      body: 'While rapid AI advancement elevates skill expectations across every discipline, it simultaneously unlocks <strong>AI-empowered self-learning</strong>. With this unprecedented multiplier, humanity is not heading toward a job apocalypse — we are gaining the collective power to solve grand challenges, construct <strong>civilizational megastructures</strong>, and <strong>eradicate global poverty</strong>.',
      footer: '🚀 The future is not a shortage of work — the future is profoundly bright.',
      desc: 'While rapid AI advancement elevates skill expectations across every discipline, it simultaneously unlocks AI-empowered self-learning.'
    }
  },
  {
    id: 'argument-premise', page: 'arguments.html', section: 'premise', position: 0, type: 'premise',
    data: {
      title: 'Key Premise: Work Relocation & Multiplication', tag: '🔒 Key Premise Locked',
      body: '<strong>Key Premise Locked:</strong> AI relocates and multiplies work, rather than shrinking the total pool. Applied together, human intent, domain knowledge, and AI tooling open entirely new sectors and problem domains that could never exist before, rather than simply automating away the finite tasks of the past.',
      desc: 'Key premise locked: AI relocates and multiplies work, rather than shrinking the total pool.'
    }
  },
  {
    id: 'argument-audience-transformation', page: 'arguments.html', section: 'audience-transformation', position: 1, type: 'audience-transformation',
    data: {
      title: 'Audience Transformation: What the Audience Gets', tag: '💡 Audience Value & Transformation',
      beforeTitle: '❄️ What they started with (Before the Video)',
      beforeItems: [
        'Panic and dread from viral headlines ("AI and humanoid robots will make human labor obsolete in 5–10 years").',
        'Zero-sum "fixed-pie" fallacy (believing machines take slices out of a finite bucket of human work).',
        'Anxiety about how to prepare children and families for an automated economy.'
      ],
      afterTitle: '🔥 What they get at the end (After the Video)',
      afterItems: [
        'Verified historical proof that prior automation waves consistently increased net employment through tool multiplication.',
        'The locked key premise: AI relocates and multiplies work into emerging multi-disciplinary domains.',
        'Clarity on education democratization (personalized AI tutoring collapsing learning costs) and human agency as the ultimate multiplier.'
      ],
      summary: '<strong>The Core Transformation:</strong> Viewers transition from passive panic over job destruction to active empowerment, equipped with a verified mental model of tool multiplication and education democratization.',
      desc: 'Audience Transformation: Moving from job apocalypse panic to verified historical proof and tool multiplication empowerment.'
    }
  },
  ...[
    { n: 1, key: 'arg-1', title: 'The Productivity Fallacy, Historically Debunked', emoji: '🪨', body: 'Every prior wave of automation — industrial machinery, computing, the internet — was predicted to end work, and instead grew the total number of jobs by creating categories of work that didn\'t previously exist. There\'s no historical precedent for technology producing a net "job apocalypse."', linkHref: 'script.html#section1', linkLabel: '→ Script: Section 1 — Productivity Fallacy', desc: 'Every prior wave of automation was predicted to end work, and instead grew the total number of jobs by creating categories of work that didn\'t previously exist.' },
    { n: 2, key: 'arg-2', title: 'Knowledge + AI = New Sectors, Not a Fixed Pie', emoji: '🌳', body: "Musk's thesis treats labor as a fixed pool that AI drains. In reality, combining domain knowledge with AI tooling produces near-infinite new permutations of problems to solve — new sectors (prompting, AI-ops, synthetic-media production, agent orchestration) are already opening up, worldwide, precisely because generative AI exists.", linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Infinite Permutations', desc: 'Combining domain knowledge with AI tooling produces near-infinite new permutations of problems to solve — new sectors are already opening up worldwide.' },
    { n: 3, key: 'arg-3', title: 'Judgment and Human Insight Remain the Bottleneck', emoji: '🧮', body: 'AI output is only as useful as the judgment, taste, and context applied to direct and evaluate it. As AI capability scales, the leverage on human insight scales with it — making people the multiplier, not the bottleneck to be removed.', linkHref: 'script.html#section3', linkLabel: '→ Script: Section 3 — Education Democratization, Math & Human Insight', desc: 'As AI capability scales, the leverage on human insight scales with it — making people the multiplier, not the bottleneck to be removed.' },
    { n: 4, key: 'arg-4', title: 'The Effect Is Global and Already Underway', emoji: '🌍', body: "This isn't a hypothetical for one country or industry — since generative AI went mainstream, new sector formation has been visible globally, giving present-day evidence rather than a 10-years-out prediction to argue from.", linkHref: 'script.html#outro', linkLabel: '→ Script: Conclusion & Outro', desc: 'Since generative AI went mainstream, new sector formation has been visible globally, giving present-day evidence rather than a 10-years-out prediction.' },
    { n: 5, key: 'arg-5', title: "Africa Is Entering the Game — and This Isn't a Betting Game", emoji: '🌍', body: "For a huge share of the world, including a continent of over a billion people just now coming online with AI tools, this was never a betting game about who keeps their existing job — it's a game about getting out of poverty. Framed that way, the next wave of change is likely to come from exactly where Musk's thesis expects the least: not Silicon Valley, but the places with the most people and the most to gain from new sectors opening up.", linkHref: 'script.html#outro', linkLabel: '→ Script: Conclusion & Outro', desc: "For a huge share of the world, this was never a betting game about who keeps their existing job — it's a game about getting out of poverty." },
    { n: 6, key: 'arg-6', title: 'AI Lowers the Cost of Education — Enabling Universal Family Participation', emoji: '🎓', body: 'Historically, high-tier tutoring and STEM education were costly gatekeepers that shut out families and induced severe academic anxiety. With AI-driven personalized 1-on-1 tutoring, the marginal cost of world-class learning collapses toward zero. This allows families across every socioeconomic background to participate in the knowledge economy and master problem-solving.', linkHref: 'script.html#section3', linkLabel: '→ Script: Section 3 — Education Democratization, Math & Human Insight', desc: 'With AI-driven personalized 1-on-1 tutoring, the marginal cost of world-class learning collapses toward zero, enabling universal family participation.' },
    { n: 7, key: 'arg-7', title: "The Skill Evolution: I-Shaped → T-Shaped → X-Shaped", emoji: '⚙️', body: 'In the Industrial Revolution, Adam Smith documented the leap from unspecialized labor to hyper-specialized <strong>I-shaped workers</strong> (one deep skill, via the division of labor) — that\'s a straight vertical line, no breadth. In the Tech & Digital Age, workers evolved to become <strong>T-shaped</strong>: one deep skill plus a broad horizontal bar of adjacent competence (code, design, business). Neither shape is enough now. The AI era rewards <strong>X-shaped workers</strong> — multiple deep verticals crossing at once, with the intersections themselves the source of value. It\'s not breadth for its own sake; it\'s the <em>creative recombination</em> at the crossing point — where two or more mastered domains collide — that AI can\'t originate on its own.', body2: "Being multi-skilled stops being a resume line and becomes the job itself: the AI-era premium isn't on knowing more things, it's on being the one who can creatively fuse them into something neither domain would produce alone.", linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Infinite Permutations & Skill Evolution', desc: 'From I-shaped (one deep skill) to T-shaped (one deep skill + broad competence) to X-shaped — multiple deep verticals crossing, where creative multi-skilling itself becomes the differentiator.' },
    { n: 8, key: 'arg-8', title: 'The Asimovian Horizon: Short-Term J-Curve Contraction Before Exponential Expansion', emoji: '🌌', body: 'When viewed from inches away during the immediate cycle, technological dislocation creates short-term friction: legacy jobs and functions contract because we cannot yet perceive the emergent industries of tomorrow. Like Isaac Asimov\'s positronic / epochal shifts, the realm of the <em>unknown</em> is vastly larger than the <em>known</em>. What feels like a contraction is the dip of a classic economic <strong>J-curve</strong> — a temporary phase transition before unconstrained new frontiers expand the global market exponentially.', body2: 'To be honest about the dip itself: right now there <em>is</em> a real shrink in some categories of work, and real downward pressure on wages and contract rates in the roles AI reaches first. No one can say precisely how long that dip lasts. This is exactly the position the people running the horse-drawn carriages were in when the automobile arrived — the trade they knew was disappearing under them before it was clear what to retrain into. That transition was painful for them too, and pretending this one won\'t be painful for people living through it now would undercut the argument rather than strengthen it. The claim here isn\'t that the dip doesn\'t hurt — it\'s that the dip is not the destination.', linkHref: 'script.html#section1', linkLabel: '→ Script: Section 1 — Productivity Fallacy & Macro Cycles', desc: 'What feels like a contraction is the dip of a classic economic J-curve — a temporary phase transition before new frontiers expand the global market exponentially.' },
    { n: 9, key: 'arg-9', title: 'Wages Rise with Permutations: The Superlinear Multiplier of Capability', emoji: '📈', body: 'A widespread misconception is that automation commoditizes labor and depresses compensation across the board. In reality, wages scale with the <strong>permutations of value</strong> an individual can generate. When AI collapses the execution friction and marginal cost of baseline tasks (code syntax, graphic generation, data filtering, drafting), a single worker is no longer limited to linear single-domain output. Instead, they can orchestrate tools and domain knowledge into thousands of high-order permutations — designing end-to-end applications, orchestrating autonomous AI agent fleets, and solving compound enterprise challenges that previously required entire departments.', body2: 'Because combinatorial leverage multiplies superlinearly with each added tool and skill, the economic output per person surges. High-leverage orchestrators capture premium compensation because their marginal productivity exceeds legacy single-task roles by orders of magnitude. As the permutations of what you can build and deliver increase, market demand and earning power inevitably go up.', linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Infinite Permutations & Wage Expansion', desc: 'Wages rise as capability permutations multiply: when AI collapses execution friction, combinatorial human leverage produces superlinear economic value, driving compensation upward.' },
    { n: 10, key: 'arg-10', title: 'The Traffic Light Paradox: Smart Regulation Accelerates AI Adoption', emoji: '🚦', body: 'A common tech critique claims that government and industry regulation inevitably throttles innovation. But consider the rules of the road: without traffic lights, speed limits, lane markers, and vehicle safety standards, high-speed automotive travel would be paralyzed by constant crashes, gridlock, and public fear. Traffic rules didn\'t slow transportation down — they established the predictable safety foundation that allowed millions of cars to travel at 70+ mph and unlocked modern continental commerce. AI requires the exact same institutional runway.', body2: 'When clear guardrails, data provenance standards, safety benchmarks, and liability boundaries are established, enterprise hesitation evaporates and massive institutional capital pours into deployment. Far from acting as a brake, sensible regulation builds public trust, eliminates systemic paralysis, and accelerates sustainable, high-velocity AI adoption across medicine, finance, and global infrastructure.', linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Regulation, Infrastructure & Scaled Adoption', desc: 'Smart regulation acts like traffic rules: rather than slowing AI down, clear guardrails and safety standards create the predictable trust framework needed to accelerate high-speed, enterprise-wide adoption.' },
    { n: 11, key: 'arg-11', title: 'IT & Higher Education Are Not Obsolete: The Self-Learning Renaissance & University Expansion', emoji: '🏛️', body: 'A cynical narrative claims that studying IT or investing in university education is a waste of time and money now that AI can generate code and solve exams. This confuses rote syntax memorization with deep architectural understanding. In the AI era, <strong>self-directed learning is the ultimate leverage</strong> — you cannot direct, audit, debug, or architect complex solutions if you don\'t understand computational logic, networking, and systems design. AI doesn\'t make technical mastery obsolete; it turns programmers and engineers into high-leverage systems directors.', body2: 'Crucially, AI will increase the value and number of universities, not diminish them. By liberating educators from repetitive grading and basic lectures, AI elevates universities into vital collaborative hubs for physical lab experimentation, cross-disciplinary innovation, incubation, and rigorous debate. As the demand for lifelong multi-disciplinary reskilling accelerates worldwide, higher education institutions will multiply to serve an ambitious, self-learning global workforce.', linkHref: 'script.html#section3', linkLabel: '→ Script: Section 3 — Education Democratization & University Expansion', desc: 'Learning IT and attending universities is more valuable than ever: self-directed learning unlocks exponential AI leverage, while universities evolve and multiply into global hubs for deep research and multi-disciplinary synthesis.' },
    { n: 12, key: 'arg-12', title: 'The Complexity Escalator: Real-World Projects Get Harder & Skill Expectations Skyrocket', emoji: '🧗', body: 'The armchair theory is that AI turns complex work into passive, push-button ease. In frontline engineering reality (as seen across the enterprise systems Erdem delivers daily), <strong>projects are getting harder, not simpler</strong>. When AI automates boilerplate code and routine drafting, the baseline expectation instantly shifts upward: systems must now handle real-time distributed data, multi-agent orchestration, bulletproof compliance, sub-second latencies, and continuous mission-critical availability.', body2: 'Whether an organization utilizes AI or not, the skill expectations placed on human practitioners are skyrocketing. When basic execution becomes frictionless, humanity doesn\'t stop — we tackle vastly more ambitious, compound challenges that were previously unthinkable. This demands deeper systems architecture, cross-disciplinary mastery, fault tolerance, and strategic judgment than ever before. AI doesn\'t lower the skill bar; it turns the crank on human ambition and makes high-level expertise indispensable.', linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Real-World Complexity & Rising Skill Ceilings', desc: 'Frontline engineering reality debunks push-button automation: as AI handles boilerplate, real-world projects get exponentially harder, and the skill expectations for human architects skyrocket.' },
    { n: 13, key: 'arg-13', title: 'The Bicycle for the Mind on Steroids: From Convergence to Infinite Divergence', emoji: '🚲', body: 'Steve Jobs famously called the personal computer a "bicycle for the human mind." AI is that bicycle on steroids — an intellectual propulsion system whose true ceiling we have barely begun to grasp. We are living through a historic <strong>positronic moment</strong>: an epochal threshold where the vast realm of the <em>unknown</em> unlocks before us. AI is the great <strong>convergence point</strong> where mathematics, code, and accumulated human knowledge synthesize into accessible intelligence — but convergence is only the launchpad.', body2: 'From this unified center, society begins an era of <strong>exponential divergence</strong>. Rather than shrinking human activity down to a single automated point, AI explodes outward into thousands of brand-new, hyper-specialized domains, industries, and creative endeavors. Every time the unknown unlocks, it creates entirely new categories of human work, multiplying the possibilities of what people can build and discover.', linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2 — Infinite Permutations & The Positronic Shift', desc: 'Computers were bicycles for the mind; AI is that bicycle on steroids. Standing at a positronic threshold, AI is the convergence point that ignites exponential divergence, unlocking thousands of brand-new human jobs.' }
  ].map((d) => ({ id: 'argument-' + d.n, page: 'arguments.html', section: 'arguments', position: d.n - 1, type: 'argument-card', data: { cardId: 'card-' + d.key, num: 'Argument ' + d.n, title: d.emoji + ' ' + d.title, body: d.body, body2: d.body2 || '', linkHref: d.linkHref, linkLabel: d.linkLabel, desc: d.desc, fullTitle: 'Argument ' + d.n + ' — ' + d.title } })),
  {
    id: 'argument-conclusion', page: 'arguments.html', section: 'conclusion', position: 0, type: 'conclusion',
    data: {
      title: 'Conclusion', tag: '🎬 Key Conclusion',
      body: 'Musk\'s "work will be optional" prediction assumes a <strong>fixed pool of labor</strong> that AI simply empties out. History, the economics of knowledge work, and what\'s already happening globally since generative AI all point the other way.',
      body2: '<strong>Humans are going to have more jobs, not fewer</strong> — because knowledge combined with AI doesn\'t just automate old sectors, it generates new ones.',
      desc: 'Humans are going to have more jobs, not fewer — because knowledge combined with AI doesn\'t just automate old sectors, it generates new ones.'
    }
  },
  ...[
    { n: 1, title: 'Historical Precedent & Jevons Paradox (The Calculator Test)', desc: 'When the marginal cost of computing numbers dropped to near-zero with electronic calculators and PCs, mathematicians and financial analysts were not eliminated — financial modeling, software engineering, and data industries multiplied exponentially.', verdict: '✔️ Validated: Task cost reduction historically unlocks massive new demand curves.' },
    { n: 2, title: 'Infinite Permutation Principle (The Fixed-Pie Fallacy)', desc: "Musk's prediction assumes human labor is a finite bucket that machines gradually drain. In reality, automation of baseline tasks produces thousands of new specialized roles that could not previously exist (e.g. Prompt Engineers, AI Fleet Orchestrators, Synthetic Media Directors).", verdict: '✔️ Validated: New problem categories expand faster than routine legacy roles automate.' },
    { n: 3, title: 'Judgment, Context & Taste as the New Scarcity', desc: 'When content and compute become abundant, the bottleneck immediately shifts to human curation, strategic intent, and emotional resonance. High-powered tools elevate human insight rather than substituting for it.', verdict: "✔️ Validated: Machine leverage magnifies the leverage of human leadership and taste." },
    { n: 4, title: 'Global Demographics & Emerging Economy Participation', desc: "Over a billion people across Africa and developing regions are accessing frontier intelligence directly on smartphones. This isn't a zero-sum corporate displacement game; it is an economic engine lifting millions into global value creation.", verdict: '✔️ Validated: Democratized AI expands total global productive participation.' },
    { n: 5, title: 'Falsifiability & Steelman Check', desc: "The thesis concedes Musk's strongest premise — that humanoid robots and AI will trigger unprecedented physical and digital productivity leaps. The counter-argument refutes only the secondary leap that human purpose and work will contract.", verdict: "✔️ Validated: Opponent's core technological assertion is acknowledged and steelmanned." }
  ].map((d) => ({ id: 'argument-sanity-' + d.n, page: 'arguments.html', section: 'sanity-check', position: d.n - 1, type: 'sanity-card', data: { cardId: 'card-sc-' + d.n, checkboxId: 'sc-' + d.n, num: d.n, title: d.n + '. ' + d.title, desc: d.desc, verdict: d.verdict, label: 'Sanity Check ' + d.n } }))
];

// ---------------------------------------------------------------------
// script.html
// ---------------------------------------------------------------------
const scriptBlocks = [
  {
    sectionId: 'hook', title: '🪝 Hook (Sharp 30s Open)', tc: '0:00 – 0:30', warm: false,
    visualDesc: 'Sharp 30-second hook: Fast-cut montage of headlines featuring Elon Musk predicting AI and humanoid robots replacing human labor, transitioning crisply at 0:25 to a personal, grounded shot of the creator in a home studio establishing skin in the game with his two daughters.',
    vo: [
      'Elon Musk recently made a massive prediction: over the next five years, as AI and humanoid robotics scale, total global productivity will soar, but human labor as we know it will become largely optional — or flat-out obsolete.',
      "He sees a world run by machines. But I'm here to argue the exact opposite: <strong>humans are going to have more jobs, not fewer.</strong>",
      "And look, this isn't just wishful thinking. I have skin in the game — I have two daughters growing up in this exact world. When I look at where technology is heading, I don't see a job apocalypse. I see an explosion of brand-new possibilities.",
      'Here is why the future is bright, and why my kids — and yours — are going to thrive.'
    ],
    addTitle: 'Hook (Sharp 30s Open, 0:00–0:30)',
    addDesc: 'Sharp 30s opening hook: Fast-cut Musk headline montage transitioning into personal home studio.'
  },
  {
    sectionId: 'section1', title: '🪨 Section 1 — The Productivity Fallacy &amp; Historical Proof', tc: '0:30 – 1:45', warm: false,
    visualDesc: 'Smooth transition from personal hook at 0:30 into historical proof: B-roll and animations of Stone Age tools, early agriculture, calculators, and personal computers demonstrating how automation consistently multiplied net employment by 1:45.',
    vo: [
      "Let's give credit where it's due: Elon is right about productivity rising. When you combine human capability with robotics and artificial intelligence, total economic output goes through the roof. Where he gets it wrong is what happens to us afterward.",
      'Every single time humanity undergoes a massive technological leap, doom-sayers predict the end of work.',
      'Think about the transition from hunter-gatherers in the Stone Age to early agriculture.',
      'Think about the Industrial Revolution, or when electronic calculators and mainframe computers entered offices.',
      'When calculators were invented, people thought mathematicians and accountants would disappear. Instead, financial modeling blew up. The cost of doing math dropped to zero, which allowed us to build hyper-complex global financial systems, modern architecture, and space programs.',
      "<strong>Tools don't destroy human intent; they multiply the permutations of what humans can create.</strong>"
    ],
    addTitle: 'Section 1 — Historical Proof & Smooth Transition (0:30–1:45)',
    addDesc: 'Smooth transition from hook into historical proof of net job growth across prior automation waves.'
  },
  {
    sectionId: 'section2', title: '🌳 Section 2 — The Infinite Permutation Principle', tc: '1:45 – 2:45', warm: true,
    visualDesc: 'Graphics displaying a tree diagram expanding infinitely into emerging multi-disciplinary job roles (e.g., Multi-X Synthesizer, Prompt & Systems Architect, Robot Fleet Manager, Bio-data Modeler, Synthetic Media Director).',
    vo: [
      "Here's the mechanism people miss: technology lowers the cost of basic tasks, which creates brand-new industries that couldn't exist before.",
      'Before the internet, nobody\'s job title was "App Developer," "Cloud Architect," or "YouTube Creator."',
      'When robotics handle repetitive physical labor and AI handles raw baseline calculations, humans are freed up to move into vastly more complex, creative, and highly specialized multi-disciplinary roles.',
      "Instead of a fixed pie of jobs that gets taken away, automation creates an infinite number of new permutations. We won't just be doing the old jobs faster; we'll be solving entirely new categories of problems."
    ],
    addTitle: 'Section 2 — The Infinite Permutation Principle (1:45–2:45)',
    addDesc: 'Graphics displaying a tree diagram expanding infinitely into emerging multi-disciplinary job roles.'
  },
  {
    sectionId: 'section3', title: '🧮 Section 3 — Education Democratization, Math &amp; Human Insight', tc: '2:45 – 3:45', warm: true,
    visualDesc: 'Cut to host speaking candidly, followed by visuals of kids learning with personalized AI tutors, interactive STEM modeling, and family collaboration (Ref: <a href="https://www.youtube.com/shorts/urgbQCxcLG8" target="_blank" rel="noopener" style="color:var(--accent-2);">YouTube Short: Rethinking Education &amp; Student Stress</a>).',
    vo: [
      'Which brings me back to my daughters — and families everywhere.',
      "There's a massive economic transformation taking place that doom-sayers completely miss: <strong>the cost of high-quality education is collapsing toward zero because of AI.</strong>",
      'For generations, elite tutoring and advanced technical education were expensive luxuries, causing immense academic anxiety and locking millions of households out of the modern economy. But with AI-driven personalized learning, the cost barrier evaporates. Most families who were previously priced out will now be able to participate, learn at their own pace, and master complex disciplines.',
      'Some people ask: "If AI can calculate and code anything instantly, why bother teaching our kids advanced math and technical skills?"',
      "Because tools don't eliminate the need for understanding — they elevate it. My daughters won't be wasting hours on tedious rote memorization or manual arithmetic. Instead, they'll use mathematical logic, systems thinking, and data modeling to command AI and solve real-world problems.",
      "Math isn't just arithmetic; it's the language of problem-solving. When you combine democratized, accessible education with human judgment, empathy, and creative direction, human potential explodes."
    ],
    addTitle: 'Section 3 — Education Democratization, Math & Human Insight (2:45–3:45)',
    addDesc: 'Cut to host speaking candidly, followed by visuals of kids learning with personalized AI tutors (ref: YouTube Short yt/urgbQCxcLG8), interactive STEM modeling, and family empowerment.'
  },
  {
    sectionId: 'outro', title: '🎬 Conclusion &amp; Outro', tc: '3:45 – 4:30', warm: false,
    visualDesc: 'Host back on camera, direct and grounded. On-screen graphic showcasing our Skool Community, cloud &amp; AI certification roadmaps, and career placement resources, transitioning to link in description and pinned comment.',
    vo: [
      "The narrative that robotics will leave humans with nothing to do ignores the entire history of human ambition. We don't run out of things to do when tasks get easier; we just set our sights higher.",
      "The future isn't a dark dystopia where humans are rendered useless by machines. It's an era where the barrier to entry for building great things has never been lower.",
      "<strong>The future is bright, jobs will evolve and expand, and the next generation is going to accomplish things we haven't even dreamed of yet.</strong>",
      "If you want to stay ahead of this curve and future-proof your own career, we've built a dedicated <strong>Skool community</strong> focused entirely on helping you get certified, master modern AI and cloud tools, and land high-demand future roles. You'll get step-by-step roadmaps, hands-on certification guidance, and real-world project support.",
      'Check the link in the description or pinned comment below to join our Skool community today. What do you think about Elon\'s prediction? Let me know in the comments below, hit that like button, and subscribe for more. Thanks for watching! 🙌'
    ],
    addTitle: 'Conclusion & Outro (3:45–4:30)',
    addDesc: 'Host back on camera, direct and grounded. On-screen graphic showcasing the Skool Community, cloud & AI certification roadmaps, and student success stories, transitioning to link in description and pinned comment.'
  }
].map((d, i) => ({
  id: 'beat-' + d.sectionId, page: 'script.html', section: 'beats', position: i, type: 'beat-section',
  data: { sectionId: d.sectionId, title: d.title, tc: d.tc, warm: d.warm, visualDesc: d.visualDesc, vo: d.vo, addTitle: d.addTitle, addDesc: d.addDesc }
}));

// ---------------------------------------------------------------------
// design.html
// ---------------------------------------------------------------------
const designBlocks = [
  ...[
    { key: 'act1', cls: 'act1', eyebrow: 'Act 1 · Setup (Cold Slate Blue)', title: '❄️ The Apocalypse Claim', tc: '0:00 – 1:45', items: ['🪝 Hook — Sharp 30s Musk/Optimus headline montage → personal cut to camera', '🪨 Section 1 — Smooth transition to historical proof of net job growth (0:30–1:45)'], linkHref: 'script.html#hook', linkLabel: '→ Script: Hook' },
    { key: 'act2', cls: 'act2', eyebrow: 'Act 2 · Confrontation (Transition to Warm Gold)', title: '🌳 The Counter-Argument & Multi-Disciplinary Jobs', tc: '1:45 – 3:45', items: ['🌳 Section 2 — The Infinite Permutation Principle & Multi-X Synthesizers', '🧮 Section 3 — Education democratization & human insight multiplication'], linkHref: 'script.html#section2', linkLabel: '→ Script: Section 2' },
    { key: 'act3', cls: 'act3', eyebrow: 'Act 3 · Resolution (Warm Gold)', title: '🔥 The Human Takeaway & Agency', tc: '3:45 – 4:30', items: ['🎬 Conclusion &amp; Outro — host direct to camera, optimistic close', 'CTA cards, warm gold tone throughout'], linkHref: 'script.html#outro', linkLabel: '→ Script: Outro' }
  ].map((d, i) => ({ id: 'design-act-' + d.key, page: 'design.html', section: 'three-act-structure', position: i, type: 'act-card', data: d })),
  {
    id: 'design-editing-rule', page: 'design.html', section: 'editing-rule', position: 0, type: 'editing-rule-pair',
    data: {
      cold: {
        title: '❄️ Cold Slate Blue &amp; Fast — Panic / Apocalypse Thesis',
        items: [
          'Cold slate blue palette (#5ab0ff / #2a3b5c), desaturated tones, high contrast',
          'News headline overlays, doom chyrons, screen-recording textures',
          'Faster cut rate (roughly 1–2s per shot) evoking the panic and apocalypse thesis',
          'Used for: hook headlines, Musk/Optimus clips, "job apocalypse" doom claims'
        ]
      },
      warm: {
        title: '🔥 Warm Gold &amp; Cinematic — Human Agency &amp; Multiplication',
        items: [
          'Warm gold palette (#e8b94a / #d49520), rich amber undertones, soft cinematic contrast',
          'Handheld-but-composed home footage, natural light, human agency',
          'Slower cut rate (3–5s+ per shot), letting human insight, education, and family moments breathe',
          'Used for: daughters, education democratization, history/human-achievement, outro CTA'
        ]
      }
    }
  },
  {
    id: 'design-typography', page: 'design.html', section: 'typography', position: 0, type: 'typography-samples',
    data: {
      title: { label: 'Title / on-screen headline', sample: 'Why Elon Musk is Wrong', sub: 'System sans-serif, bold, tight tracking. Used for section title cards.' },
      lower: { label: 'Lower-third / tag', sample: 'The Future of AI and Jobs' }
    }
  },
  ...[
    { key: 'stoneage', graphic: '🪨 Stone Age → Agriculture arrow', style: 'Flat icon morph, cold slate blue to warm gold gradient wipe', section: 'Section 1', addTitle: 'Stone Age → Agriculture arrow', addDesc: 'Flat icon morph, cold slate blue to warm gold gradient wipe. Section 1.' },
    { key: 'mainframe', graphic: '🖥️ Mainframe → PC dissolve', style: 'Cross-dissolve, CRT scanlines in cold slate blue transitioning to warm gold desktop', section: 'Section 1', addTitle: 'Mainframe → PC dissolve', addDesc: 'Cross-dissolve, CRT scanline texture on outgoing frame. Section 1.' },
    { key: 'jobtree', graphic: '🌳 "Job Tree" Multi-Disciplinary Expansion', style: 'Gold line-art tree, grows outward on VO beat, serif & modern labels emphasizing emerging multi-disciplinary job titles (Multi-X Synthesizers, AI-Ops Orchestrators)', section: 'Section 2', addTitle: '"Job Tree" Multi-Disciplinary Expansion', addDesc: 'Gold line-art tree growing outward to emphasize emerging multi-disciplinary job titles. Section 2.' },
    { key: 'cta', graphic: '🎓 Skool Community &amp; End-screen CTA', style: 'Skool community logo, certification badges pop-in, warm gold brand accent', section: 'Outro', addTitle: 'Skool Community & End-screen CTA', addDesc: 'Skool community logo, certification badges pop-in, warm gold brand accent. Outro.' }
  ].map((d, i) => ({ id: 'spec-' + d.key, page: 'design.html', section: 'motion-specs', position: i, type: 'spec-row', data: d })),
  {
    id: 'design-pacing', page: 'design.html', section: 'pacing', position: 0, type: 'pacing-bar',
    data: { act1Flex: 105, act2Flex: 120, act3Flex: 45 }
  }
];

// ---------------------------------------------------------------------
// previsualisation.html
// ---------------------------------------------------------------------
const previsualisationBlocks = [
  {
    id: 'previz-intro', page: 'previsualisation.html', section: 'intro', position: 0, type: 'layman-intro',
    data: {
      title: '🗣️ How This Gets Explained in Plain English',
      body: "Every shot below pairs one plain-language idea with one concrete picture — no jargon, no chart the audience has to study. If a 10-year-old wouldn't get the point from the image alone, the shot gets reworked. Each panel's \"In plain English\" line is the test: it's the sentence we'd use to explain that shot to someone who has never heard the word \"automation.\" That's the standard the whole board is held to, not just narration — the visuals have to carry the argument on their own."
    }
  },
  ...[
    { n: 1, mood: 'cold', tc: '0:00', tag: 'Montage · Screen Overlay', section: 'Hook', title: 'Headline montage (Sharp 30s Hook)', desc: 'Fast-cut news headlines: "The Future of AI and Jobs," humanoid robot tech coverage, lower-third overlays.', vo: '"Elon Musk recently made a massive prediction…"', prompt: 'Fast-paced collage of news broadcast headlines about AI and robotics; lower-third chyron graphic reading "The Future of AI and Jobs"; humanoid robot on a TV studio screen; cool blue newsroom lighting; 16:9 cinematic broadcast look, high contrast, slight motion blur.', layman: "Shows the scary headlines everyone's already half-seen about robots taking jobs — we open where the audience's worry already is, instead of pretending it doesn't exist." },
    { n: 2, mood: 'warm', tc: '0:10', tag: 'Talking Head', section: 'Hook', title: 'Host, home studio', desc: 'Warm, personal shot — creator direct to camera in a living-room studio. Establishes authentic personal stake with daughters by 0:30.', vo: '"I have skin in the game — I have two daughters…"', prompt: 'Warm, intimate talking-head shot of a person speaking directly to camera in a cozy living-room podcast studio; soft key light; bookshelf and plants softly out of focus in the background; shallow depth of field; 16:9; warm golden color grade.', layman: "The host talks like a real parent, not a lecturer — so people trust this is a personal take, not a corporate pitch about AI." },
    { n: 3, mood: 'cold', tc: '0:30', tag: 'Graphic · Transition', section: 'Section 1', title: 'Stone Age → Agriculture', desc: 'Smooth transition from personal hook: animated arrow where hand tool morphs into early plow, proving prior automation waves multiplied work by 1:45.', vo: '"Every single time humanity undergoes a leap, doom-sayers predict the end of work."', prompt: 'Split-frame animated transition: a rough stone hand-axe resting on dark rock on the left, morphing into an early wooden plow tilling golden soil on the right; dusty warm sunlight; illustrative motion-graphic style; 16:9.', layman: "A caveman's rock tool turns into a farmer's plow — a simple picture for \"new tools have always changed jobs before, and it turned out fine.\"" },
    { n: 4, mood: 'cold', tc: '1:05', tag: 'Graphic · Transition', section: 'Section 1', title: 'Mainframe → PC', desc: 'Vintage beige computer dissolves into modern desktop. Calculators and PCs proof point: tool multiplication creates more net employment.', vo: '"The cost of doing math dropped to zero…"', prompt: 'Side-by-side dissolve transition: a room-sized 1960s beige mainframe computer with blinking lights on the left, morphing into a sleek modern desktop monitor with glowing code on the right; cool blue-teal lighting; tech-documentary style; 16:9.', layman: 'A giant old computer turns into a modern laptop — shows that even huge tech leaps like calculators didn\'t erase jobs, they just changed what people did.' },
    { n: 5, mood: 'warm', tc: '1:45', tag: 'Motion Graphic', section: 'Section 2', title: '"Job Tree" Multi-Disciplinary Expansion', desc: 'Glowing gold tree graphic expanding into emerging multi-disciplinary job titles: Multi-X Synthesizer, AI-Ops Architect, Prompt & Systems Orchestrator, Bio-Data Modeler, Synthetic Media Director, Human-AI Workflow Specialist.', vo: '"Automation creates an infinite number of new permutations — unlocking emerging multi-disciplinary roles that blend technical mastery with human creativity."', prompt: 'Motion graphic of a glowing golden tree branching outward from a single trunk into multifaceted nodes, each node clearly labeled with emerging multi-disciplinary job titles: "Multi-X Synthesizer", "AI-Ops Architect", "Prompt & Systems Orchestrator", "Bio-Data Modeler", "Synthetic Media Director"; dark slate blue background; glowing gold accent lines; high-resolution vector motion design; 16:9.', layman: 'A glowing tree sprouting new multi-disciplinary branches — shows how technology creates hybrid jobs that combine skills (like art + coding + robotics) instead of just deleting jobs.' },
    { n: 6, mood: 'warm', tc: '2:15', tag: 'B-Roll · Close-up', section: 'Section 2 → 3', title: 'Daughter with holo-tablet', desc: 'Girl in a yellow sweater interacts with a glowing, translucent tablet interface at home — bridges tech to family.', vo: '"Which brings me back to my daughters."', prompt: 'Close-up B-roll of a young girl in a yellow sweater at home, interacting with a glowing translucent holographic tablet interface; soft warm household lighting; shallow depth of field; cinematic family-documentary look; 16:9.', layman: 'A kid using a futuristic tablet at home — makes "AI can help kids learn" feel real and close instead of an abstract debate.' },
    { n: 7, mood: 'warm', tc: '2:45', tag: 'B-Roll · Two-shot', section: 'Section 3', title: 'Host + daughter, holo-device', desc: 'Father kneels beside daughter as she explores the holographic tablet together — human-tech partnership, not replacement.', vo: '"My daughters are going to use math more than any generation before them."', prompt: 'Two-shot of a father kneeling beside his young daughter, both looking at a glowing holographic tablet between them; warm golden-hour light through a window; tender human-tech partnership mood; cinematic; 16:9.', layman: 'Dad and daughter looking at the same screen together — shorthand for "people and AI working side by side," not people being replaced.' },
    { n: 8, mood: 'warm', tc: '3:15', tag: 'Split Screen · B-Roll', section: 'Section 3', title: 'Collaboration split-frame', desc: 'Left: colleagues high-fiving in an office. Right: mentor and teen reviewing notes together — human judgment amplified by tools.', vo: '"Human judgment, empathy, and creative direction… human potential explodes."', prompt: 'Split-screen composition: left side two colleagues high-fiving in a bright modern office, right side a mentor and teenager reviewing notes together at a table; warm optimistic lighting on both sides; documentary style; 16:9.', layman: 'Two everyday scenes side by side — coworkers celebrating, a mentor helping a teen — to say "people helping people" is still what wins, tools or not.' },
    { n: 9, mood: 'cold', tc: '3:50', tag: 'Talking Head · Skool CTA', section: 'Outro', title: 'Host, direct address & Skool CTA', desc: 'Return to host on camera, grounded delivery, into Skool community certification roadmap overlay and subscribe/like end-screen cards.', vo: '"We\'ve built a dedicated Skool community focused entirely on helping you get certified and land high-demand future roles…"', prompt: 'Grounded talking-head shot: host looking directly into camera delivering a confident closing statement; clean minimal studio background; soft even lighting; subtle graphic overlay showing Skool community certification badges and modern tech roadmaps; 16:9.', layman: 'The host looks straight at the camera and gives one simple next step — no confusing menu of options, just "here\'s the one thing to do."' }
  ].map((d, i) => {
    const DOWNLOAD_NAMES = {
      1: 'panel_1_headline_montage.jpg',
      2: 'panel_2_host_home_studio.jpg',
      3: 'panel_3_stone_age_agriculture.jpg',
      4: 'panel_4_mainframe_pc.jpg',
      5: 'panel_5_job_tree_branching_diagram.jpg',
      6: 'panel_6_daughter_holo_tablet.jpg',
      7: 'panel_7_host_daughter_holo_device.jpg',
      8: 'panel_8_collaboration_split_frame.jpg',
      9: 'panel_9_host_direct_address_skool_cta.jpg'
    };
    return {
      id: 'shot-' + d.n, page: 'previsualisation.html', section: 'shot-board', position: i, type: 'shot-panel',
      data: {
        n: d.n, mood: d.mood, tc: d.tc, tag: d.tag, section: d.section, title: d.title, desc: d.desc, vo: d.vo, prompt: d.prompt, layman: d.layman,
        img: '../images/panel_' + d.n + '.jpg',
        downloadName: DOWNLOAD_NAMES[d.n]
      }
    };
  })
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

  const allBlocks = [...indexBlocks, ...argumentsBlocks, ...scriptBlocks, ...designBlocks, ...previsualisationBlocks];

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
