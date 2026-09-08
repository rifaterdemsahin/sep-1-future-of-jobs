(function(){
  var ASSET_KEY = 'jobApocalypse_assets_v1';

  function getAssets(){
    try{ return JSON.parse(localStorage.getItem(ASSET_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveAssets(list){
    try{ localStorage.setItem(ASSET_KEY, JSON.stringify(list)); }catch(e){}
  }
  function hasAsset(id){
    return getAssets().some(function(a){ return a.id === id; });
  }
  function addAsset(item){
    var list = getAssets();
    if(list.some(function(a){ return a.id === item.id; })) return false;
    list.push(Object.assign({ comment: '', addedAt: new Date().toISOString() }, item));
    saveAssets(list);
    return true;
  }
  function removeAsset(id){
    saveAssets(getAssets().filter(function(a){ return a.id !== id; }));
  }
  function updateComment(id, comment){
    var list = getAssets();
    var it = list.find(function(a){ return a.id === id; });
    if(it){ it.comment = comment; saveAssets(list); }
  }
  function clearAssets(){
    saveAssets([]);
  }

  function injectStyles(){
    if(document.getElementById('asset-db-styles')) return;
    var style = document.createElement('style');
    style.id = 'asset-db-styles';
    style.textContent =
      '.asset-feedback-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);'+
        'display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}'+
      '.asset-feedback-box{background:var(--panel,#13161f);border:1px solid var(--panel-border,#232838);'+
        'border-radius:12px;padding:20px 22px;max-width:380px;width:100%;'+
        'box-shadow:0 12px 40px rgba(0,0,0,.4);font-family:-apple-system,BlinkMacSystemFont,'+
        '"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}'+
      '.asset-feedback-box .afb-title{font-size:13px;font-weight:700;color:var(--text,#eef0f4);margin:0 0 4px;}'+
      '.asset-feedback-box .afb-item{font-size:12.5px;color:var(--text-dim,#9aa1b0);margin:0 0 12px;}'+
      '.asset-feedback-box textarea{width:100%;min-height:70px;resize:vertical;background:#0e1017;'+
        'border:1px solid var(--panel-border,#232838);border-radius:8px;color:var(--text,#eef0f4);'+
        'font-family:inherit;font-size:13px;padding:10px 12px;box-sizing:border-box;}'+
      '.asset-feedback-box textarea:focus{outline:none;border-color:var(--accent-2,#5ab0ff);}'+
      '.afb-hint{font-size:10.5px;color:var(--text-dim,#9aa1b0);margin-top:6px;}'+
      '.afb-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px;}'+
      '.afb-btn{font-size:12.5px;padding:7px 14px;border-radius:20px;border:1px solid var(--panel-border,#232838);'+
        'background:transparent;color:var(--text-dim,#9aa1b0);cursor:pointer;}'+
      '.afb-btn:hover{border-color:var(--accent-2,#5ab0ff);color:var(--text,#eef0f4);}'+
      '.afb-btn.primary{border-color:var(--accent,#e8b94a);color:var(--accent,#e8b94a);}';
    document.head.appendChild(style);
  }

  function openFeedbackPrompt(item, onDone){
    injectStyles();
    var backdrop = document.createElement('div');
    backdrop.className = 'asset-feedback-backdrop';
    backdrop.innerHTML =
      '<div class="asset-feedback-box">'+
        '<p class="afb-title">💬 Add a note (optional)</p>'+
        '<p class="afb-item">' + (item.title || '(untitled)') + '</p>'+
        '<textarea placeholder="Why are you saving this? Any notes for later…"></textarea>'+
        '<p class="afb-hint">⌘/Ctrl + Enter to save</p>'+
        '<div class="afb-actions">'+
          '<button class="afb-btn" data-action="skip">Skip</button>'+
          '<button class="afb-btn primary" data-action="save">✅ Add to Assets</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(backdrop);
    var textarea = backdrop.querySelector('textarea');
    textarea.focus();

    function cleanup(){
      document.removeEventListener('keydown', onKey);
      if(backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }
    function finish(comment){
      cleanup();
      onDone(comment);
    }
    function cancel(){
      cleanup();
    }
    function onKey(e){
      if(e.key === 'Escape') cancel();
      if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)) finish(textarea.value);
    }
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', function(e){
      if(e.target === backdrop) cancel();
    });
    backdrop.querySelector('[data-action="skip"]').addEventListener('click', function(){ cancel(); });
    backdrop.querySelector('[data-action="save"]').addEventListener('click', function(){ finish(textarea.value); });
  }

  function initAddButtons(){
    document.querySelectorAll('.add-asset-btn').forEach(function(btn){
      var id = btn.dataset.id;
      function refresh(){
        if(hasAsset(id)){
          btn.textContent = '✅ Added';
          btn.classList.add('added');
        } else {
          btn.textContent = btn.dataset.label || '➕ Add to Assets';
          btn.classList.remove('added');
        }
      }
      refresh();
      btn.addEventListener('click', function(){
        if(hasAsset(id)){
          removeAsset(id);
          refresh();
        } else {
          var item = {
            id: id,
            type: btn.dataset.type || 'item',
            title: btn.dataset.title || '',
            description: btn.dataset.desc || '',
            source: btn.dataset.source || '',
            url: btn.dataset.url || ''
          };
          openFeedbackPrompt(item, function(comment){
            item.comment = comment || '';
            addAsset(item);
            refresh();
          });
        }
      });
    });
  }

  window.AssetDB = {
    getAssets: getAssets,
    saveAssets: saveAssets,
    addAsset: addAsset,
    removeAsset: removeAsset,
    updateComment: updateComment,
    clearAssets: clearAssets,
    hasAsset: hasAsset,
    initAddButtons: initAddButtons,
    openFeedbackPrompt: openFeedbackPrompt
  };

  document.addEventListener('DOMContentLoaded', initAddButtons);
})();
