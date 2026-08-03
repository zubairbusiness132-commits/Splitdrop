(function(){
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const previewGrid = document.getElementById('previewGrid');
  const formatSelect = document.getElementById('formatSelect');
  const batchActions = document.getElementById('batchActions');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');

  const EXT = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp' };
  const MAX_FILES = 200;
  let items = [];
  let loadEpoch = 0; // { id, file, img, objectUrl, convertedBlob, readyPromise, token }

  function updateBatchVisibility(){
    batchActions.style.display = items.length ? 'flex' : 'none';
  }

  function safeRevoke(url){
    if(url) {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }
  }

  function createPreviewImage(file, onReady){
    const img = new Image();
    img.decoding = 'async';
    const url = URL.createObjectURL(file);
    img.onload = () => {
      safeRevoke(url);
      onReady(null, img, url);
    };
    img.onerror = () => {
      safeRevoke(url);
      onReady(new Error('Image failed to load'));
    };
    img.src = url;
    return { img, url };
  }

  function renderCard(item){
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.id = 'card-' + item.id;

    const thumb = document.createElement('img');
    thumb.src = item.img.src;
    thumb.alt = item.file.name;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';

    const info = document.createElement('div');
    info.className = 'info';

    const name = document.createElement('b');
    name.textContent = item.file.name;

    const br1 = document.createElement('br');
    const status = document.createElement('span');
    status.id = 'status-' + item.id;
    status.textContent = 'Converting…';

    const br2 = document.createElement('br');
    const download = document.createElement('button');
    download.type = 'button';
    download.className = 'btn btn-outline';
    download.style.marginTop = '8px';
    download.style.padding = '8px 12px';
    download.style.width = '100%';
    download.id = 'dl-' + item.id;
    download.textContent = '⬇️ Download';
    download.onclick = () => {
      if(item.convertedBlob) downloadBlob(item.convertedBlob, renameFile(item.file.name));
      else showToast('This image is still converting');
    };

    info.append(name, br1, status, br2, download);
    card.append(thumb, info);
    previewGrid.appendChild(card);
  }

  function convertItem(item){
    const token = ++item.token;
    const canvas = document.createElement('canvas');
    canvas.width = item.img.naturalWidth;
    canvas.height = item.img.naturalHeight;
    const ctx = canvas.getContext('2d');
    const target = formatSelect.value;

    if(target === 'image/jpeg'){
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(item.img, 0, 0);

    item.readyPromise = new Promise(resolve => {
      canvas.toBlob(blob => {
        if(token !== item.token) return resolve(null);
        if(!blob){
          item.convertedBlob = null;
          showToast('Conversion failed for one image');
          return resolve(null);
        }
        item.convertedBlob = blob;
        const status = document.getElementById('status-' + item.id);
        if(status) status.textContent = `Ready — ${formatBytes(blob.size)} (${EXT[target].toUpperCase()})`;
        resolve(blob);
      }, target, 0.92);
    });

    return item.readyPromise;
  }

  function handleFiles(fileArr){
    const accepted = [...fileArr].filter(file => file && file.type.startsWith('image/'));
    if(!accepted.length){
      showToast('Please choose JPG, PNG or WEBP files');
      return;
    }
    if(items.length + accepted.length > MAX_FILES){
      showToast(`Too many files at once. Limit is ${MAX_FILES}.`);
      return;
    }

    const batchEpoch = ++loadEpoch;

    accepted.forEach(file => {
      const id = 'c' + Math.random().toString(36).slice(2, 9);
      const { img, url } = createPreviewImage(file, (err, loadedImg) => {
        if(err){
          showToast(`Could not load ${file.name}`);
          return;
        }
        if(batchEpoch !== loadEpoch){
          safeRevoke(url);
          return;
        }
        const item = {
          id,
          file,
          img: loadedImg,
          objectUrl: url,
          convertedBlob: null,
          readyPromise: Promise.resolve(null),
          token: 0
        };
        items.push(item);
        renderCard(item);
        convertItem(item);
        updateBatchVisibility();
      });
    });
  }

  ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  fileInput.onchange = e => handleFiles(e.target.files);

  formatSelect.onchange = () => {
    items.forEach(item => {
      item.convertedBlob = null;
      const status = document.getElementById('status-' + item.id);
      if(status) status.textContent = 'Converting…';
      convertItem(item);
    });
  };

  clearAllBtn.onclick = () => {
    loadEpoch++;
    items.forEach(item => safeRevoke(item.objectUrl));
    items = [];
    previewGrid.innerHTML = '';
    updateBatchVisibility();
  };

  downloadZipBtn.onclick = async () => {
    if(items.length === 0) return;
    downloadZipBtn.disabled = true;
    downloadZipBtn.textContent = 'Preparing…';
    try{
      await Promise.all(items.map(item => item.readyPromise));
      const zip = new JSZip();
      items.forEach(item => { if(item.convertedBlob) zip.file(renameFile(item.file.name), item.convertedBlob); });
      const content = await zip.generateAsync({ type:'blob' });
      downloadBlob(content, 'splitdrop-converted-images.zip');
      showToast('ZIP downloaded');
    }catch(err){
      showToast('Could not create ZIP');
    }finally{
      downloadZipBtn.disabled = false;
      downloadZipBtn.textContent = '⬇️ Download all as ZIP';
    }
  };

  function renameFile(name){
    const dot = name.lastIndexOf('.');
    const base = dot > -1 ? name.slice(0, dot) : name;
    return base + '.' + EXT[formatSelect.value];
  }

  updateBatchVisibility();
})();
