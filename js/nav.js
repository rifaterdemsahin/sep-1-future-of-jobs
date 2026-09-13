// Shared top navigation bar, rendered identically on every page so the menu
// only needs to be edited in one place. Two collapsible dropdowns: 📂 Pipeline
// (the production-stage pages) and 🔗 Share (Tasks, Search, Tools) — both
// built once here so every page stays in sync automatically.
(function(){
  var LIVE_BASE = 'https://rifaterdemsahin.github.io/sep-1-future-of-jobs/html/';

  // Single-hue ramp (light -> dark) across the menu in this order, so each
  // stage gets a distinct but related color. 'todo' (Production Plan) is
  // surfaced separately as "Tasks" in the Share menu, not in Pipeline.
  var PAGES = [
    { id: 'arguments',        emoji: '🧩', label: 'Arguments',        file: 'arguments.html',        color: '#bfe0ff' },
    { id: 'research',         emoji: '🔍', label: 'Research',         file: 'index.html',            color: '#8ecbff' },
    { id: 'script',           emoji: '📝', label: 'Script',           file: 'script.html',           color: '#5ab0ff' },
    { id: 'design',           emoji: '🎨', label: 'Design',           file: 'design.html',           color: '#3f8fe0' },
    { id: 'previsualisation', emoji: '🎞️', label: 'Previsualisation', file: 'previsualisation.html', color: '#2c6bb0' },
    { id: 'assets',           emoji: '🗂️', label: 'Assets',           file: 'assets.html',           color: '#1c4a80' },
    { id: 'todo',             emoji: '✅', label: 'Production Plan',  file: 'todo.html',             color: '#7be08a' }
  ];

  var PIPELINE_PAGES = PAGES.filter(function(p){ return p.id !== 'todo'; });
  var TASKS_PAGE = PAGES.filter(function(p){ return p.id === 'todo'; })[0];

  // Tools the production pipeline actually depends on — surfaced inside the
  // "🔗 Share" dropdown, grouped by role so a long list stays scannable.
  // Each group is [label, [tool, tool, ...]].
  var TOOL_GROUPS = [
    ['Deployment', [
      { emoji: '⚡', label: 'Cloudflare Worker Live', url: 'https://sep-1-future-of-jobs.polished-boat-17b2.workers.dev/html/', desc: 'Edge production deployment' },
      { emoji: '📄', label: 'GitHub Pages', url: 'https://rifaterdemsahin.github.io/sep-1-future-of-jobs/html/assets.html', desc: 'Legacy static hosting (forwards to Cloudflare)' },
      { emoji: '🐙', label: 'GitHub Repo', url: 'https://github.com/rifaterdemsahin/sep-1-future-of-jobs', desc: 'Source code' }
    ]],
    ['Data & Storage', [
      { emoji: '🗄️', label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard/project/mdsykpdkdprtmkccukle', desc: 'content_blocks, assets, notes, ratings, audio_clips' },
      { emoji: '☁️', label: 'Azure Portal', url: 'https://portal.azure.com/auth/login/', desc: 'Azure Blob Storage — asset backup sync' },
      { emoji: '🖼️', label: 'Azure Container (sep-1-future-of-jobs)', url: 'https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2Fb85b029d-9f7c-4c5a-8939-819480780c5d%2FresourceGroups%2Fdeliverypilot-rg%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fdpprojects/path/sep-1-future-of-jobs/etag/%220x8DF0E4F96506ADE%22/defaultId//publicAccessVal/Blob', desc: 'Direct container view & image carousel assets' },
      { emoji: '🧠', label: 'Second Brain Server', url: 'http://localhost:30080/', desc: 'Must be running before opening any local page' },
      { emoji: '📓', label: 'Second Brain — Sample Note', url: 'http://localhost:30080/markdown_renderer.html?path=4_Archieve%2F2026%2F09%2F08%2F2026-09-08-nursery-financial-analysis-comprehensive-report.md', desc: 'Local notes vault (markdown renderer)' }
    ]],
    ['Production Tools', [
      { emoji: '🌊', label: 'Google Flow', url: 'https://flow.google.com/u/1/project/ec557d11-2773-4887-babb-f12b65e4b7b7/edit/88f11cfc-17da-476b-8ff3-7e8bb5790963', desc: 'AI video generation and asset pipeline' },
      { emoji: '🎙️', label: 'Kokoro Voices (TTS)', url: 'https://secondbrain-kokoro.fly.dev/voices', desc: 'Voice-over generation service' },
      { emoji: '🎨', label: 'Canva Design', url: 'https://www.canva.com/design/DAHTV1XbvSs/uyMkcD8cZwdHn03nhVnC_w/edit', desc: 'Pipeline design board' }
    ]],
    ['Research', [
      { emoji: '✨', label: 'Gemini Research Chat', url: 'https://gemini.google.com/app/732deb1f1441e2fd', desc: "Musk's Job Apocalypse Debunked — research thread" },
      { emoji: '🤖', label: 'Grok', url: 'https://grok.com', desc: 'AI research & counterpoint checks' },
      { emoji: '▶️', label: 'YouTube', url: 'https://www.youtube.com', desc: 'Source videos & eventual upload destination' },
      { emoji: '📊', label: 'The Economist · Data', url: 'https://www.economist.com/', desc: 'Net AI jobs-impact charts' }
    ]],
    ['Community', [
      { emoji: '🏫', label: 'Skool', url: 'https://www.skool.com', desc: 'Community CTA cross-link destination' },
      { emoji: '🎓', label: 'Course', url: 'https://www.skool.com/delivery-pilot-8938/classroom', desc: 'Delivery Pilot classroom' }
    ]],
    ['Browser Utilities', [
      { emoji: '🗂️', label: 'Tab to Top', url: 'https://chromewebstore.google.com/detail/tab-to-top-move-tabs-to-t/edncbfiemmpedhdjechpipmpnbcgipim?hl=en', desc: 'Chrome extension — manage & reorder tabs' }
    ]]
  ];

  // ---------------------------------------------------------------------
  // Site search: indexes public.content_blocks (every source link,
  // argument, beat, spec, shot panel) once per page load, so typing in
  // the nav search box finds a match wherever it lives and jumps there.
  // ---------------------------------------------------------------------
  var searchIndex = [];
  var searchReady = (window.sb ? window.sb.from('content_blocks').select('page, section, type, data') : Promise.resolve({ data: [] }))
    .then(function(res){
      if(res.error){ console.error('Nav search index load failed', res.error); return; }
      searchIndex = (res.data || []).map(function(row){
        var d = row.data || {};
        var label = d.title || d.fullTitle || d.num || (row.section + ' — ' + row.type);
        // Strip any inline HTML tags authors embedded in title/body fields.
        label = String(label).replace(/<[^>]*>/g, '').trim();
        var haystack = (label + ' ' + JSON.stringify(d)).toLowerCase();
        return { page: row.page, label: label, haystack: haystack };
      });
    });

  function pageMeta(file){
    return PAGES.filter(function(p){ return p.file === file; })[0];
  }

  function runSearch(query){
    var q = query.trim().toLowerCase();
    if(!q) return [];
    return searchIndex.filter(function(r){ return r.haystack.indexOf(q) !== -1; }).slice(0, 8);
  }

  // Generic collapsible dropdown wiring — used for both the Pipeline and
  // Share top-level menus so their open/close/outside-click/Escape behavior
  // stays identical.
  function wireDropdown(toggleId, menuId, wrapId){
    var toggle = document.getElementById(toggleId);
    var menu = document.getElementById(menuId);
    var wrap = document.getElementById(wrapId);
    if(!toggle || !menu || !wrap) return;

    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      var opening = menu.hidden;
      // Close any other open top-level dropdown first.
      document.querySelectorAll('.topnav .menu-panel').forEach(function(m){
        if(m !== menu) m.hidden = true;
      });
      menu.hidden = !opening;
    });
    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target)) menu.hidden = true;
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') menu.hidden = true;
    });
  }

  function wireSearch(){
    var input = document.getElementById('nav-search-input');
    var results = document.getElementById('nav-search-results');
    if(!input || !results) return;

    function renderResults(){
      var matches = runSearch(input.value);
      if(!input.value.trim()){
        results.hidden = true;
        return;
      }
      results.hidden = false;
      if(!matches.length){
        results.innerHTML = '<div class="search-empty">No matches for "' + input.value.trim() + '"</div>';
        return;
      }
      results.innerHTML = matches.map(function(m){
        var meta = pageMeta(m.page);
        var pageLabel = meta ? (meta.emoji + ' ' + meta.label) : m.page;
        return '<a class="search-result" href="' + m.page + '">' +
          '<span class="sr-page">' + pageLabel + '</span>' +
          '<span class="sr-title">' + m.label + '</span>' +
        '</a>';
      }).join('');
    }

    input.addEventListener('click', function(e){ e.stopPropagation(); });
    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        var first = results.querySelector('.search-result');
        if(first) window.location.href = first.getAttribute('href');
      }
    });

    searchReady.then(function(){
      if(input.value) renderResults();
    });
  }

  function render(currentId){
    var mount = document.getElementById('nav-mount');
    if(!mount) return;

    var pipelineActive = PIPELINE_PAGES.some(function(p){ return p.id === currentId; });
    var pipelineItems = PIPELINE_PAGES.map(function(p){
      var cls = p.id === currentId ? ' class="tools-item active"' : ' class="tools-item"';
      var style = ' style="--nav-color:' + p.color + ';"';
      return '<a href="' + p.file + '"' + cls + style + '>' +
        '<span class="ti-label">' + p.emoji + ' ' + p.label + '</span>' +
      '</a>';
    }).join('');

    var liveHref = LIVE_BASE + (PAGES.filter(function(p){ return p.id === currentId; })[0] || PAGES[0]).file;

    var toolItems = TOOL_GROUPS.map(function(group){
      var groupLabel = group[0], tools = group[1];
      var items = tools.map(function(t){
        return '<a class="tools-item" href="' + t.url + '" target="_blank" rel="noopener">' +
          '<span class="ti-label">' + t.emoji + ' ' + t.label + '</span>' +
          '<span class="ti-desc">' + t.desc + '</span>' +
        '</a>';
      }).join('');
      return '<div class="tools-group">' +
        '<div class="tools-group-label">' + groupLabel + '</div>' +
        items +
      '</div>';
    }).join('');

    var tasksActive = currentId === 'todo';

    mount.outerHTML =
      '<nav class="topnav">' +
        '<div class="topnav-inner">' +
          '<a class="brand" href="index.html">🎬 Job Apocalypse <span>· Debunked</span></a>' +
          '<div class="links">' +
            '<div class="menu-wrap" id="nav-pipeline-wrap">' +
              '<button type="button" class="menu-toggle' + (pipelineActive ? ' active' : '') + '" id="nav-pipeline-toggle">📂 Pipeline <span class="menu-caret">▾</span></button>' +
              '<div class="menu-panel tools-menu" id="nav-pipeline-menu" hidden>' + pipelineItems + '</div>' +
            '</div>' +
            '<div class="menu-wrap" id="nav-share-wrap">' +
              '<button type="button" class="menu-toggle' + (tasksActive ? ' active' : '') + '" id="nav-share-toggle">🔗 Share <span class="menu-caret">▾</span></button>' +
              '<div class="menu-panel tools-menu share-menu" id="nav-share-menu" hidden>' +
                '<div class="tools-group">' +
                  '<div class="tools-group-label">Tasks</div>' +
                  '<a class="tools-item' + (tasksActive ? ' active' : '') + '" href="' + TASKS_PAGE.file + '">' +
                    '<span class="ti-label">' + TASKS_PAGE.emoji + ' ' + TASKS_PAGE.label + '</span>' +
                  '</a>' +
                '</div>' +
                '<div class="tools-group">' +
                  '<div class="tools-group-label">Search</div>' +
                  '<div class="share-search">' +
                    '<span>🔎</span>' +
                    '<input type="text" id="nav-search-input" placeholder="Search the site…" autocomplete="off">' +
                  '</div>' +
                  '<div class="search-results" id="nav-search-results" hidden></div>' +
                '</div>' +
                toolItems +
              '</div>' +
            '</div>' +
            '<a class="live" href="' + liveHref + '" target="_blank" rel="noopener">🌐 Live</a>' +
          '</div>' +
        '</div>' +
      '</nav>';

    wireDropdown('nav-pipeline-toggle', 'nav-pipeline-menu', 'nav-pipeline-wrap');
    wireDropdown('nav-share-toggle', 'nav-share-menu', 'nav-share-wrap');
    wireSearch();
  }

  window.Nav = { PAGES: PAGES, render: render };
})();
