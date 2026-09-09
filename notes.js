(function(){
  var COOKIE_KEY = 'jobApocalypse_notes_v1';
  var COOKIE_DAYS = 365;

  function getCookie(name){
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }
  function setCookie(name, value, days){
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + expires + ';path=/;SameSite=Lax';
  }

  function currentPage(){
    var path = window.location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function loadNotes(){
    var raw = getCookie(COOKIE_KEY);
    if(!raw) return [];
    try{
      var parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) return [];
      // Migrate older cookie format (plain strings, no page tag).
      return parsed.map(function(n){
        return typeof n === 'string' ? { text: n, page: currentPage() } : n;
      });
    }catch(e){ return []; }
  }
  function saveNotes(notes){
    setCookie(COOKIE_KEY, JSON.stringify(notes), COOKIE_DAYS);
  }

  function copyText(text, status){
    function done(ok){
      status.textContent = ok ? '✅ copied' : '⚠️ copy failed';
      setTimeout(function(){ status.textContent = ''; }, 1500);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
    } else {
      var tmp = document.createElement('textarea');
      tmp.value = text;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      try{ document.execCommand('copy'); done(true); }
      catch(err){ done(false); }
      document.body.removeChild(tmp);
    }
  }

  function injectStyles(){
    if(document.getElementById('notes-styles')) return;
    var style = document.createElement('style');
    style.id = 'notes-styles';
    style.textContent =
      '.notes-bar{position:fixed;left:0;right:0;bottom:0;z-index:490;' +
        'background:var(--panel,#13161f);border-top:1px solid var(--panel-border,#232838);' +
        'box-shadow:0 -6px 20px rgba(0,0,0,.35);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
      '.notes-bar-header{display:flex;align-items:center;gap:8px;padding:8px 14px;cursor:pointer;' +
        'color:var(--text,#eef0f4);user-select:none;}' +
      '.notes-bar-header .nb-title{font-size:12.5px;font-weight:700;text-transform:uppercase;' +
        'letter-spacing:.06em;color:var(--text-dim,#9aa1b0);flex:1;}' +
      '.notes-bar-header .nb-count{font-size:11px;color:var(--text-dim,#9aa1b0);}' +
      '.notes-bar-header .nb-caret{font-size:11px;color:var(--text-dim,#9aa1b0);transition:transform .15s ease;}' +
      '.notes-bar.open .nb-caret{transform:rotate(180deg);}' +
      '.notes-body{display:none;padding:0 14px 12px;}' +
      '.notes-bar.open .notes-body{display:block;}' +
      '.notes-list{max-height:28vh;overflow-y:auto;display:flex;flex-direction:column;gap:6px;' +
        'margin-bottom:8px;}' +
      '.notes-list:empty{display:none;}' +
      '.notes-item{display:flex;align-items:flex-start;gap:8px;background:var(--bg,#0b0d12);' +
        'border:1px solid var(--panel-border,#232838);border-radius:8px;padding:8px 10px;}' +
      '.notes-item .ni-body{flex:1;min-width:0;}' +
      '.notes-item .ni-page{display:inline-block;font-size:10.5px;font-weight:700;' +
        'text-transform:uppercase;letter-spacing:.04em;color:var(--accent,#e8b94a);' +
        'background:rgba(232,185,74,.12);border-radius:4px;padding:1px 6px;margin-bottom:4px;}' +
      '.notes-item .ni-text{font-size:13px;line-height:1.45;color:var(--text,#eef0f4);' +
        'white-space:pre-wrap;word-break:break-word;}' +
      '.notes-item button{flex-shrink:0;border:1px solid var(--panel-border,#232838);' +
        'background:transparent;color:var(--text-dim,#9aa1b0);border-radius:6px;' +
        'width:26px;height:26px;font-size:12px;cursor:pointer;line-height:1;' +
        'display:flex;align-items:center;justify-content:center;}' +
      '.notes-item button:hover{border-color:var(--accent-2,#5ab0ff);color:var(--text,#eef0f4);}' +
      '.notes-input-row{display:flex;gap:8px;}' +
      '.notes-input-row textarea{flex:1;min-height:44px;max-height:30vh;resize:vertical;' +
        'background:var(--bg,#0b0d12);color:var(--text,#eef0f4);' +
        'border:1px solid var(--panel-border,#232838);border-radius:8px;padding:9px 11px;' +
        'font-size:13px;line-height:1.5;font-family:inherit;box-sizing:border-box;}' +
      '.notes-input-row textarea:focus{outline:none;border-color:var(--accent-2,#5ab0ff);}' +
      '.notes-actions{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;}' +
      '.notes-actions button{border:1px solid var(--panel-border,#232838);background:var(--bg,#0b0d12);' +
        'color:var(--text,#eef0f4);border-radius:7px;padding:7px 12px;font-size:12.5px;cursor:pointer;' +
        'font-family:inherit;transition:border-color .15s ease,color .15s ease;}' +
      '.notes-actions button:hover{border-color:var(--accent-2,#5ab0ff);}' +
      '.notes-actions .nb-add{border-color:var(--accent,#e8b94a);color:var(--accent,#e8b94a);}' +
      '.notes-actions .nb-clear:hover{border-color:#e05a5a;color:#e05a5a;}' +
      '.notes-actions .nb-status{font-size:11.5px;color:var(--text-dim,#9aa1b0);margin-left:auto;}';
    document.head.appendChild(style);
  }

  function buildUi(){
    injectStyles();

    var notes = loadNotes();

    var bar = document.createElement('div');
    bar.className = 'notes-bar';

    var header = document.createElement('div');
    header.className = 'notes-bar-header';
    header.innerHTML =
      '<span>📝</span>' +
      '<span class="nb-title">Notes for Claude</span>' +
      '<span class="nb-count"></span>' +
      '<span class="nb-caret">▲</span>';
    var countEl = header.querySelector('.nb-count');

    var body = document.createElement('div');
    body.className = 'notes-body';

    var list = document.createElement('div');
    list.className = 'notes-list';

    var inputRow = document.createElement('div');
    inputRow.className = 'notes-input-row';
    var textarea = document.createElement('textarea');
    textarea.placeholder = 'Jot an update you want to prompt back with, e.g. "swap the hero image on index.html"… (Enter to add, Shift+Enter for a new line)';
    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '➕ Add';
    inputRow.appendChild(textarea);
    inputRow.appendChild(addBtn);

    var actions = document.createElement('div');
    actions.className = 'notes-actions';
    var copyAllBtn = document.createElement('button');
    copyAllBtn.type = 'button';
    copyAllBtn.className = 'nb-copy-all';
    copyAllBtn.textContent = '📋 Copy All Notes';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'nb-clear';
    clearBtn.textContent = '🗑️ Clear All';
    var status = document.createElement('span');
    status.className = 'nb-status';
    actions.appendChild(copyAllBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(status);

    body.appendChild(list);
    body.appendChild(inputRow);
    body.appendChild(actions);

    bar.appendChild(header);
    bar.appendChild(body);

    function noteText(note){
      return '[' + note.page + '] ' + note.text;
    }

    function allNotesText(){
      return notes.map(function(n){ return '- ' + noteText(n); }).join('\n');
    }

    function refreshCount(){
      countEl.textContent = notes.length + (notes.length === 1 ? ' note' : ' notes');
    }

    function renderList(){
      list.innerHTML = '';
      notes.forEach(function(note, idx){
        var item = document.createElement('div');
        item.className = 'notes-item';

        var bodyEl = document.createElement('div');
        bodyEl.className = 'ni-body';

        var pageEl = document.createElement('div');
        pageEl.className = 'ni-page';
        pageEl.textContent = note.page;

        var textEl = document.createElement('div');
        textEl.className = 'ni-text';
        textEl.textContent = note.text;

        bodyEl.appendChild(pageEl);
        bodyEl.appendChild(textEl);

        var copyOneBtn = document.createElement('button');
        copyOneBtn.type = 'button';
        copyOneBtn.title = 'Copy this note';
        copyOneBtn.textContent = '📋';
        copyOneBtn.addEventListener('click', function(){
          copyText(noteText(note), status);
        });

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.title = 'Remove this note';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', function(){
          notes.splice(idx, 1);
          saveNotes(notes);
          renderList();
          refreshCount();
        });

        item.appendChild(bodyEl);
        item.appendChild(copyOneBtn);
        item.appendChild(removeBtn);
        list.appendChild(item);
      });
      refreshCount();
    }

    function addNote(){
      var text = textarea.value.trim();
      if(!text) return;
      notes.push({ text: text, page: currentPage() });
      saveNotes(notes);
      textarea.value = '';
      renderList();
      if(!bar.classList.contains('open')) bar.classList.add('open');
    }

    header.addEventListener('click', function(){
      bar.classList.toggle('open');
    });

    addBtn.addEventListener('click', function(e){
      e.stopPropagation();
      addNote();
    });

    textarea.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        addNote();
      }
    });

    copyAllBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(!notes.length){
        status.textContent = '⚠️ no notes yet';
        setTimeout(function(){ status.textContent = ''; }, 1500);
        return;
      }
      copyText(allNotesText(), status);
    });

    clearBtn.addEventListener('click', function(e){
      e.stopPropagation();
      notes = [];
      saveNotes(notes);
      renderList();
      status.textContent = '🗑️ cleared';
      setTimeout(function(){ status.textContent = ''; }, 1500);
    });

    renderList();
    document.body.appendChild(bar);
  }

  document.addEventListener('DOMContentLoaded', buildUi);
})();
