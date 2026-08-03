(function(){
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const pdfInfo = document.getElementById('pdfInfo');
  const splitOptions = document.getElementById('splitOptions');
  const rangeInput = document.getElementById('rangeInput');
  const rangeHelp = document.getElementById('rangeHelp');
  const extractBtn = document.getElementById('extractBtn');
  const splitAllBtn = document.getElementById('splitAllBtn');
  const resultBox = document.getElementById('resultBox');

  let currentFile = null;
  let pageCount = 0;

  async function handleFile(file){
    if(!file){
      return;
    }
    if(file.type !== 'application/pdf'){
      showToast('Please choose a PDF file');
      return;
    }

    currentFile = file;
    try{
      const bytes = await file.arrayBuffer();
      const { PDFDocument } = PDFLib;
      const doc = await PDFDocument.load(bytes);
      pageCount = doc.getPageCount();
      pdfInfo.style.display = 'block';
      pdfInfo.innerHTML = `<b>${file.name}</b> — ${pageCount} page${pageCount === 1 ? '' : 's'}, ${formatBytes(file.size)}`;
      splitOptions.style.display = 'block';
      rangeInput.value = '';
      if(rangeHelp) rangeHelp.textContent = `Enter pages like 1-${Math.min(3, pageCount)}.`;
      resultBox.style.display = 'none';
    }catch(err){
      currentFile = null;
      showToast('Could not read that PDF file');
    }
  }

  function parseRange(str, max){
    const pages = new Set();
    str.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
      if(part.includes('-')){
        const [a,b] = part.split('-').map(n => parseInt(n,10));
        if(!Number.isNaN(a) && !Number.isNaN(b)){
          for(let i = Math.min(a,b); i <= Math.max(a,b); i++){
            if(i >= 1 && i <= max) pages.add(i - 1);
          }
        }
      } else {
        const n = parseInt(part,10);
        if(!Number.isNaN(n) && n >= 1 && n <= max) pages.add(n - 1);
      }
    });
    return [...pages].sort((a,b) => a - b);
  }

  ['dragover','dragenter'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
  fileInput.onchange = e => handleFile(e.target.files[0]);

  extractBtn.onclick = async () => {
    if(!currentFile) return;
    const indices = parseRange(rangeInput.value, pageCount);
    if(indices.length === 0){
      showToast('Enter a valid page range');
      return;
    }
    extractBtn.disabled = true;
    extractBtn.textContent = 'Extracting…';
    try{
      const { PDFDocument } = PDFLib;
      const bytes = await currentFile.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach(p => out.addPage(p));
      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type:'application/pdf' });
      downloadBlob(blob, 'splitdrop-extract.pdf');
      resultBox.style.display = 'block';
      resultBox.textContent = `✓ Extracted ${indices.length} page${indices.length === 1 ? '' : 's'} into a new PDF.`;
      showToast('Pages extracted and downloaded');
    }catch(e){
      console.error(e);
      showToast('Could not extract — check the page range');
    }
    extractBtn.disabled = false;
    extractBtn.textContent = '⬇️ Extract range as PDF';
  };

  splitAllBtn.onclick = async () => {
    if(!currentFile) return;
    splitAllBtn.disabled = true;
    splitAllBtn.textContent = 'Splitting…';
    try{
      const { PDFDocument } = PDFLib;
      const bytes = await currentFile.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const zip = new JSZip();
      for(let i = 0; i < pageCount; i++){
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const outBytes = await out.save();
        zip.file(`page-${i + 1}.pdf`, outBytes);
      }
      const content = await zip.generateAsync({ type:'blob' });
      downloadBlob(content, 'splitdrop-split-pages.zip');
      resultBox.style.display = 'block';
      resultBox.textContent = `✓ Split into ${pageCount} single-page PDF${pageCount === 1 ? '' : 's'} (ZIP downloaded).`;
      showToast('All pages split and downloaded');
    }catch(e){
      console.error(e);
      showToast('Could not split this PDF');
    }
    splitAllBtn.disabled = false;
    splitAllBtn.textContent = '📦 Split every page (ZIP)';
  };
})();
