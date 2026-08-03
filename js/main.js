// ---------- Theme ----------
(function(){
  const btn = document.getElementById('themeToggle');

  function apply(theme){
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if(btn){
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    localStorage.setItem('splitdrop-theme', theme);
  }

  apply(localStorage.getItem('splitdrop-theme') || 'light');

  if(btn){
    btn.type = 'button';
    btn.onclick = () => apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }
})();

// ---------- Mobile nav ----------
(function(){
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if(!burger || !links) return;

  burger.onclick = () => {
    const isOpen = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  links.addEventListener('click', (event) => {
    if(event.target && event.target.matches('a')) {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ---------- Toast ----------
let toastTimer;
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Tool registry (used on homepage) ----------
const SPLITDROP_TOOLS = [
  { name:'Image Compressor', desc:'Shrink JPG, PNG or WEBP file size without losing quality.', icon:'🗜️', url:'image-compressor.html', cat:'Image' },
  { name:'Image Converter', desc:'Convert between JPG, PNG and WEBP formats instantly.', icon:'🔄', url:'image-converter.html', cat:'Image' },
  { name:'PDF Merge', desc:'Combine multiple PDF files into one, in any order.', icon:'📎', url:'pdf-merge.html', cat:'PDF' },
  { name:'PDF Split', desc:'Pull out the exact pages you need from a PDF.', icon:'✂️', url:'pdf-split.html', cat:'PDF' },
  { name:'QR Code Generator', desc:'Create QR codes for links, WiFi, UPI, vCards and more.', icon:'▦', url:'qr-generator.html', cat:'Generator' },
];

function renderToolGrids(){
  const featured = document.getElementById('featuredGrid');
  const popular = document.getElementById('popularGrid');
  const cardHtml = t => `
    <a class="tool-card" href="${t.url}">
      <div class="ic" aria-hidden="true">${t.icon}</div>
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
      <span class="go">Open tool →</span>
    </a>`;
  if(featured) featured.innerHTML = SPLITDROP_TOOLS.slice(0,3).map(cardHtml).join('');
  if(popular) popular.innerHTML = SPLITDROP_TOOLS.map(cardHtml).join('');
}
renderToolGrids();

// ---------- Search ----------
(function(){
  const input = document.getElementById('searchInput');
  const form = document.getElementById('searchForm');
  if(!input) return;

  function go(){
    const q = input.value.trim().toLowerCase();
    if(!q) return;
    const match = SPLITDROP_TOOLS.find(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));
    if(match) window.location.href = match.url;
    else showToast('No matching tool found — browse the list below');
  }

  if(form) form.addEventListener('submit', e => { e.preventDefault(); go(); });
})();

// ---------- Shared helpers used by tool pages ----------
function formatBytes(bytes){
  if(!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB','TB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function downloadBlob(blob, filename){
  if(!blob) {
    showToast('Nothing is ready to download yet');
    return;
  }
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
