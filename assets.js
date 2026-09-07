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
        } else {
          addAsset({
            id: id,
            type: btn.dataset.type || 'item',
            title: btn.dataset.title || '',
            description: btn.dataset.desc || '',
            source: btn.dataset.source || '',
            url: btn.dataset.url || ''
          });
        }
        refresh();
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
    initAddButtons: initAddButtons
  };

  document.addEventListener('DOMContentLoaded', initAddButtons);
})();
