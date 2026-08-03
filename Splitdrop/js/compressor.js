(function(){
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const fileList = document.getElementById('fileList');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityVal = document.getElementById('qualityVal');
  const batchActions = document.getElementById('batchActions');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');

  const MAX_FILES = 200;
  let items = [];
  let loadEpoch = 0; // { id, file, img, objectUrl, originalSize, compressedBlob, compressedSize, type, readyPromise, token }
  let recompressTimer = null;

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
      onReady(null, img);
    };
    img.onerror = () => {
      safeRevoke(url);
      onReady(new Error('Image failed to load'));
    };
    img.src = url;
    return { img, url };
  }

  function renderRow(item){
    const row = document.createElement('div');
    row.className = 'file-row';
    row.id = 'row-' + item.id;

    const thumb = document.createElement('img');
    thumb.src = item.img.src;
    thumb.alt = item.file.name;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = item.file.name;

    const size = document.createElement('div');
    size.className = 'size';
    size.id = 'size-' + item.id;
    size.textContent = `${formatBytes(item.originalSize)} → …`;

    meta.append(name, size);

    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.className = 'btn btn-outline';
    downloadBtn.style.padding = '8px 14px';
    downloadBtn.textContent = '⬇️';
    downloadBtn.setAttribute('aria-label', `Download compressed copy of ${item.file.name}`);
    downloadBtn.onclick = () => {
      if(item.compressedBlob) downloadBlob(item.compressedBlob, renameFile(item.file.name));
      else showToast('This image is still compressing');
    };

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '✕';
    removeBtn.setAttribute('aria-label', `Remove ${item.file.name}`);
    removeBtn.onclick = () => {
      safeRevoke(item.objectUrl);
      items = items.filter(i => i.id !== item.id);
      row.remove();
      updateBatchVisibility();
    };

    row.append(thumb, meta, downloadBtn, removeBtn);
    fileList.appendChild(row);
  }

  function recompress(item){
    const token = ++item.token;
    const canvas = document.createElement('canvas');
    canvas.width = item.img.naturalWidth;
    canvas.height = item.img.naturalHeight;
    const ctx = canvas.getContext('2d');
    const q = Math.max(0.1, Math.min(0.95, (+qualitySlider.value) / 100));
    const outType = item.type === 'image/png' ? 'image/png' : (item.type === 'image/webp' ? 'image/webp' : 'image/jpeg');

    // Fill JPEG/WebP background to avoid transparency issues.
    if(outType === 'image/jpeg') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(item.img, 0, 0);

    item.readyPromise = new Promise((resolve) => {
      canvas.toBlob(blob => {
        if(token !== item.token) return resolve(null);
        if(!blob){
          item.compressedBlob = null;
          showToast('Compression failed for one image');
          return resolve(null);
        }
        item.compressedBlob = blob;
        item.compressedSize = blob.size;
        const el = document.getElementById('size-' + item.id);
        if(el){
          const saved = Math.max(0, Math.round((1 - blob.size / item.originalSize) * 100));
          el.textContent = `${formatBytes(item.originalSize)} → ${formatBytes(blob.size)} (${saved}% smaller)`;
        }
        resolve(blob);
      }, outType, outType === 'image/png' ? undefined : q);
    });

    return item.readyPromise;
  }

  function scheduleRecompressAll(){
    clearTimeout(recompressTimer);
    recompressTimer = setTimeout(() => items.forEach(recompress), 120);
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
      const id = 'f' + Math.random().toString(36).slice(2, 9);
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
          originalSize: file.size,
          type: file.type,
          compressedBlob: null,
          compressedSize: 0,
          readyPromise: Promise.resolve(null),
          token: 0
        };
        items.push(item);
        renderRow(item);
        recompress(item);
        updateBatchVisibility();
      });
    });
  }

  qualitySlider.oninput = () => {
    qualityVal.textContent = qualitySlider.value + '%';
    scheduleRecompressAll();
  };

  ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  fileInput.onchange = e => handleFiles(e.target.files);

  clearAllBtn.onclick = () => {
    loadEpoch++;
    items.forEach(item => safeRevoke(item.objectUrl));
    items = [];
    fileList.innerHTML = '';
    updateBatchVisibility();
  };

  downloadZipBtn.onclick = async () => {
    if(items.length === 0) return;
    downloadZipBtn.disabled = true;
    downloadZipBtn.textContent = 'Preparing…';
    try{
      await Promise.all(items.map(item => item.readyPromise));
      const zip = new JSZip();
      items.forEach(item => { if(item.compressedBlob) zip.file(renameFile(item.file.name), item.compressedBlob); });
      const content = await zip.generateAsync({ type:'blob' });
      downloadBlob(content, 'splitdrop-compressed-images.zip');
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
    return dot > -1 ? name.slice(0, dot) + '-compressed' + name.slice(dot) : name + '-compressed';
  }
})();
