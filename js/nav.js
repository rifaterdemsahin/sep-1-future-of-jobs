// Shared top navigation bar, rendered identically on every page so the menu
// only needs to be edited in one place. Order: Arguments before Research.
(function(){
  var LIVE_BASE = 'https://rifaterdemsahin.github.io/sep-1-future-of-jobs/html/';

  var PAGES = [
    { id: 'arguments',        emoji: '🧩', label: 'Arguments',        file: 'arguments.html' },
    { id: 'research',         emoji: '🔍', label: 'Research',         file: 'index.html' },
    { id: 'script',           emoji: '📝', label: 'Script',           file: 'script.html' },
    { id: 'design',           emoji: '🎨', label: 'Design',           file: 'design.html' },
    { id: 'previsualisation', emoji: '🎞️', label: 'Previsualisation', file: 'previsualisation.html' },
    { id: 'assets',           emoji: '🗂️', label: 'Assets',           file: 'assets.html' }
  ];

  function render(currentId){
    var mount = document.getElementById('nav-mount');
    if(!mount) return;

    var links = PAGES.map(function(p){
      var cls = p.id === currentId ? ' class="active"' : '';
      return '<a href="' + p.file + '"' + cls + '>' + p.emoji + ' ' + p.label + '</a>';
    }).join('\n      ');

    var liveHref = LIVE_BASE + (PAGES.filter(function(p){ return p.id === currentId; })[0] || PAGES[0]).file;

    mount.outerHTML =
      '<nav class="topnav">' +
        '<div class="topnav-inner">' +
          '<a class="brand" href="index.html">🎬 Job Apocalypse <span>· Debunked</span></a>' +
          '<div class="links">' +
            '\n      ' + links + '\n      ' +
            '<a class="live" href="' + liveHref + '" target="_blank" rel="noopener">🌐 Live</a>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  window.Nav = { PAGES: PAGES, render: render };
})();
