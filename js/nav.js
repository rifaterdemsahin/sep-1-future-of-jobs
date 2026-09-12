// Shared top navigation bar, rendered identically on every page so the menu
// only needs to be edited in one place. Order: Arguments before Research.
(function(){
  var LIVE_BASE = 'https://rifaterdemsahin.github.io/sep-1-future-of-jobs/html/';

  // Single-hue ramp (light -> dark) across the menu in this order, so each
  // stage gets a distinct but related color.
  var PAGES = [
    { id: 'arguments',        emoji: '🧩', label: 'Arguments',        file: 'arguments.html',        color: '#bfe0ff' },
    { id: 'research',         emoji: '🔍', label: 'Research',         file: 'index.html',            color: '#8ecbff' },
    { id: 'script',           emoji: '📝', label: 'Script',           file: 'script.html',           color: '#5ab0ff' },
    { id: 'design',           emoji: '🎨', label: 'Design',           file: 'design.html',           color: '#3f8fe0' },
    { id: 'previsualisation', emoji: '🎞️', label: 'Previsualisation', file: 'previsualisation.html', color: '#2c6bb0' },
    { id: 'assets',           emoji: '🗂️', label: 'Assets',           file: 'assets.html',           color: '#1c4a80' },
    { id: 'todo',             emoji: '✅', label: 'Production Plan',  file: 'todo.html',             color: '#7be08a' }
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

  function wireSearch(){
    var toggle = document.getElementById('nav-search-toggle');
    var wrap = document.getElementById('nav-search-wrap');
    var box = document.getElementById('nav-search-box');
    var input = document.getElementById('nav-search-input');
    var closeBtn = document.getElementById('nav-search-close');
    var results = document.getElementById('nav-search-results');
    if(!toggle || !wrap) return;

    function openBox(){
      toggle.hidden = true;
      box.hidden = false;
      input.focus();
    }
    function closeBox(){
      box.hidden = true;
      toggle.hidden = false;
      results.hidden = true;
      input.value = '';
    }
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

    toggle.addEventListener('click', openBox);
    closeBtn.addEventListener('click', closeBox);
    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ closeBox(); }
      if(e.key === 'Enter'){
        var first = results.querySelector('.search-result');
        if(first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target)) closeBox();
    });

    searchReady.then(function(){
      if(input.value) renderResults();
    });
  }

  function render(currentId){
    var mount = document.getElementById('nav-mount');
    if(!mount) return;

    var links = PAGES.map(function(p){
      var cls = p.id === currentId ? ' class="active"' : '';
      var style = ' style="--nav-color:' + p.color + ';border-color:' + (p.id === currentId ? p.color : 'transparent') + ';"';
      return '<a href="' + p.file + '"' + cls + style + '>' + p.emoji + ' ' + p.label + '</a>';
    }).join('\n      ');

    var liveHref = LIVE_BASE + (PAGES.filter(function(p){ return p.id === currentId; })[0] || PAGES[0]).file;

    mount.outerHTML =
      '<nav class="topnav">' +
        '<div class="topnav-inner">' +
          '<a class="brand" href="index.html">🎬 Job Apocalypse <span>· Debunked</span></a>' +
          '<div class="links">' +
            '\n      ' + links + '\n      ' +
            '<a class="live" href="' + liveHref + '" target="_blank" rel="noopener">🌐 Live</a>' +
            '<div class="search-wrap" id="nav-search-wrap">' +
              '<button type="button" class="search-toggle" id="nav-search-toggle">🔎 Search</button>' +
              '<div class="search-box" id="nav-search-box" hidden>' +
                '<span>🔎</span>' +
                '<input type="text" id="nav-search-input" placeholder="Search the site…" autocomplete="off">' +
                '<button type="button" class="search-close" id="nav-search-close" aria-label="Close search">✕</button>' +
              '</div>' +
              '<div class="search-results" id="nav-search-results" hidden></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</nav>';

    wireSearch();
  }

  window.Nav = { PAGES: PAGES, render: render };
})();
