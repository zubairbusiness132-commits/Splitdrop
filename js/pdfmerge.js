(function(){
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const fileList = document.getElementById('fileList');
  const actions = document.getElementById('actions');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const mergeBtn = document.getElementById('mergeBtn');
  const resultBox = document.getElementById('resultBox');

  let items = []; // { id, file }
  let dragSrcId = null;

  function updateActions(){
    actions.style.display = items.length ? 'flex' : 'none';
  }

  function handleFiles(fileArr){
    const accepted = [...fileArr].filter(file => file && file.type === 'application/pdf');
    if(!accepted.length){
      showToast('Please choose PDF files');
      return;
    }
    accepted.forEach(file => items.push({ id: 'p' + Math.random().toString(36).slice(2,9), file }));
    renderList();
  }

  function makeRow(item, idx){
    const row = document.createElement('div');
    row.className = 'file-row';
    row.draggable = true;
    row.dataset.id = item.id;

    const icon = document.createElement('span');
    icon.style.fontSize = '18px';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '📄';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = `${idx + 1}. ${item.file.name}`;

    const size = document.createElement('div');
    size.className = 'size';
    size.textContent = formatBytes(item.file.size);

    meta.append(name, size);

    const drag = document.createElement('span');
    drag.style.cursor = 'grab';
    drag.style.color = 'var(--muted-2)';
    drag.setAttribute('aria-hidden', 'true');
    drag.textContent = '⠿⠿';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.title = 'Remove';
    removeBtn.setAttribute('aria-label', `Remove ${item.file.name}`);
    removeBtn.textContent = '✕';
    removeBtn.onclick = () => {
      items = items.filter(i => i.id !== item.id);
      renderList();
    };

    row.append(icon, meta, drag, removeBtn);

    row.addEventListener('dragstart', () => {
      dragSrcId = item.id;
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));
    row.addEventListener('dragover', e => e.preventDefault());
    row.addEventListener('drop', e => {
      e.preventDefault();
      if(!dragSrcId || dragSrcId === item.id) return;
      const from = items.findIndex(i => i.id === dragSrcId);
      const to = items.findIndex(i => i.id === item.id);
      if(from < 0 || to < 0) return;
      const [moved] = items.splice(from,1);
      items.splice(to,0,moved);
      renderList();
    });

    return row;
  }

  function renderList(){
    fileList.innerHTML = '';
    items.forEach((item, idx) => fileList.appendChild(makeRow(item, idx)));
    updateActions();
  }

  ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  fileInput.onchange = e => handleFiles(e.target.files);

  clearAllBtn.onclick = () => { items = []; renderList(); resultBox.style.display='none'; };

  mergeBtn.onclick = async () => {
    if(items.length < 1) return;
    mergeBtn.disabled = true;
    mergeBtn.textContent = 'Merging…';
    try{
      const { PDFDocument } = PDFLib;
      const merged = await PDFDocument.create();
      for(const item of items){
        const bytes = await item.file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const outBytes = await merged.save();
      const blob = new Blob([outBytes], { type:'application/pdf' });
      downloadBlob(blob, 'splitdrop-merged.pdf');
      resultBox.style.display = 'block';
      resultBox.textContent = `✓ Merged ${items.length} files into one PDF (${formatBytes(blob.size)}).`;
      showToast('PDF merged and downloaded');
    }catch(err){
      console.error(err);
      showToast('Could not merge — check the files are valid PDFs');
    }
    mergeBtn.disabled = false;
    mergeBtn.textContent = '📎 Merge & Download';
  };

  updateActions();
})();
