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
    { id: 'assets',           emoji: '🗂️', label: 'Assets',           file: 'assets.html',           color: '#1c4a80' }
  ];

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
          '</div>' +
        '</div>' +
      '</nav>';
  }

  window.Nav = { PAGES: PAGES, render: render };
})();
