(function(){
  var STORAGE_KEY = 'jobApocalypse_theme_v1';

  var THEMES = [
    { id: 'dark', emoji: '🌑', label: 'Dark', vars: {
      bg: '#0b0d12', panel: '#13161f', panelBorder: '#232838',
      accent: '#e8b94a', accent2: '#5ab0ff', text: '#eef0f4', textDim: '#9aa1b0',
      cold: '#5ab0ff', warm: '#e8b94a'
    }},
    { id: 'light', emoji: '☀️', label: 'Light', vars: {
      bg: '#f7f7f5', panel: '#ffffff', panelBorder: '#e2e2e0',
      accent: '#c98a1d', accent2: '#1f6fb2', text: '#14161c', textDim: '#5b6270',
      cold: '#1f6fb2', warm: '#c98a1d'
    }},
    { id: 'midnight', emoji: '🌌', label: 'Midnight', vars: {
      bg: '#05060a', panel: '#0d1220', panelBorder: '#1b2540',
      accent: '#f2c14e', accent2: '#6fb1ff', text: '#eef2ff', textDim: '#8892b0',
      cold: '#6fb1ff', warm: '#f2c14e'
    }},
    { id: 'sepia', emoji: '🍂', label: 'Sepia', vars: {
      bg: '#f4ecdd', panel: '#fdf6e9', panelBorder: '#e3d3ad',
      accent: '#b0631d', accent2: '#5c7a52', text: '#3a2f22', textDim: '#7a6a52',
      cold: '#5c7a52', warm: '#b0631d'
    }},
    { id: 'ocean', emoji: '🌊', label: 'Ocean', vars: {
      bg: '#061a1c', panel: '#0d2b2e', panelBorder: '#164447',
      accent: '#ffb454', accent2: '#37e5c4', text: '#e6fbf8', textDim: '#7fb8b5',
      cold: '#37e5c4', warm: '#ffb454'
    }},
    { id: 'grape', emoji: '🍇', label: 'Grape', vars: {
      bg: '#120c1e', panel: '#1d1430', panelBorder: '#33254f',
      accent: '#f6c453', accent2: '#b98cff', text: '#f1e9ff', textDim: '#a495c4',
      cold: '#b98cff', warm: '#f6c453'
    }},
    { id: 'contrast', emoji: '⬛', label: 'High Contrast', vars: {
      bg: '#000000', panel: '#000000', panelBorder: '#ffffff',
      accent: '#ffee00', accent2: '#00e5ff', text: '#ffffff', textDim: '#cccccc',
      cold: '#00e5ff', warm: '#ffee00'
    }}
  ];

  function cssForTheme(t){
    var v = t.vars;
    return ':root[data-theme="' + t.id + '"]{' +
      '--bg:' + v.bg + ';--panel:' + v.panel + ';--panel-border:' + v.panelBorder + ';' +
      '--accent:' + v.accent + ';--accent-2:' + v.accent2 + ';--text:' + v.text + ';' +
      '--text-dim:' + v.textDim + ';--cold:' + v.cold + ';--warm:' + v.warm + ';}';
  }

  function injectVarStyle(){
    if(document.getElementById('theme-vars')) return;
    var style = document.createElement('style');
    style.id = 'theme-vars';
    style.textContent = THEMES.map(cssForTheme).join('\n');
    document.head.appendChild(style);
  }

  function getSaved(){
    try{ return localStorage.getItem(STORAGE_KEY) || 'dark'; }
    catch(e){ return 'dark'; }
  }
  function save(id){
    try{ localStorage.setItem(STORAGE_KEY, id); }catch(e){}
  }
  function apply(id){
    document.documentElement.setAttribute('data-theme', id);
  }

  // Runs synchronously as the page's <head> parses, before first paint,
  // so switching pages doesn't flash back to the default dark theme.
  injectVarStyle();
  apply(getSaved());

  function injectUiStyles(){
    if(document.getElementById('theme-ui-styles')) return;
    var style = document.createElement('style');
    style.id = 'theme-ui-styles';
    style.textContent =
      '.theme-toggle{position:fixed;bottom:20px;right:20px;z-index:500;' +
        'width:46px;height:46px;border-radius:50%;border:1px solid var(--panel-border,#232838);' +
        'background:var(--panel,#13161f);color:var(--text,#eef0f4);font-size:19px;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;padding:0;' +
        'box-shadow:0 6px 20px rgba(0,0,0,.35);transition:transform .15s ease,border-color .15s ease;}' +
      '.theme-toggle:hover{transform:translateY(-2px);border-color:var(--accent-2,#5ab0ff);}' +
      '.theme-menu{position:fixed;bottom:74px;right:20px;z-index:500;' +
        'background:var(--panel,#13161f);border:1px solid var(--panel-border,#232838);' +
        'border-radius:12px;padding:8px;box-shadow:0 12px 40px rgba(0,0,0,.45);' +
        'display:flex;flex-direction:column;gap:2px;min-width:180px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
      '.theme-menu[hidden]{display:none;}' +
      '.theme-menu .tm-title{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;' +
        'color:var(--text-dim,#9aa1b0);font-weight:700;padding:4px 10px 6px;}' +
      '.theme-option{display:flex;align-items:center;gap:9px;font-size:13px;' +
        'padding:8px 10px;border-radius:8px;border:1px solid transparent;background:none;' +
        'color:var(--text-dim,#9aa1b0);cursor:pointer;text-align:left;width:100%;font-family:inherit;}' +
      '.theme-option:hover{background:rgba(127,127,127,.14);color:var(--text,#eef0f4);}' +
      '.theme-option.active{border-color:var(--accent-2,#5ab0ff);color:var(--text,#eef0f4);}' +
      '.theme-option .tc-swatch{width:13px;height:13px;border-radius:50%;flex-shrink:0;' +
        'border:1px solid rgba(127,127,127,.4);}';
    document.head.appendChild(style);
  }

  function buildUi(){
    injectUiStyles();

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.title = 'Change theme';
    btn.setAttribute('aria-label', 'Change theme');
    btn.textContent = '🎨';

    var menu = document.createElement('div');
    menu.className = 'theme-menu';
    menu.hidden = true;
    menu.innerHTML = '<div class="tm-title">🎨 Theme</div>';

    function refreshActive(){
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      menu.querySelectorAll('.theme-option').forEach(function(opt){
        opt.classList.toggle('active', opt.dataset.id === current);
      });
    }

    THEMES.forEach(function(t){
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'theme-option';
      opt.dataset.id = t.id;
      opt.innerHTML =
        '<span class="tc-swatch" style="background:' + t.vars.accent + ';"></span>' +
        t.emoji + ' ' + t.label;
      opt.addEventListener('click', function(){
        apply(t.id);
        save(t.id);
        refreshActive();
      });
      menu.appendChild(opt);
    });

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      if(!menu.hidden) refreshActive();
    });
    document.addEventListener('click', function(e){
      if(!menu.hidden && !menu.contains(e.target) && e.target !== btn){
        menu.hidden = true;
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') menu.hidden = true;
    });

    document.body.appendChild(menu);
    document.body.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', buildUi);

  window.Theme = { THEMES: THEMES, apply: apply, save: save };
})();
