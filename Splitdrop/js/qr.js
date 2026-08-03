(function(){
  const typeGrid = document.getElementById('typeGrid');
  const fieldsContainer = document.getElementById('fieldsContainer');
  const canvas = document.getElementById('qrCanvas');
  const fgColor = document.getElementById('fgColor');
  const bgColor = document.getElementById('bgColor');
  const logoInput = document.getElementById('logoInput');
  const downloadPng = document.getElementById('downloadPng');
  const downloadSvg = document.getElementById('downloadSvg');

  let currentType = 'url';
  let logoImg = null;
  let logoUrl = null;
  let lastContent = '';
  let renderNonce = 0;

  const DEFAULT_URL = 'https://zubairbusiness132-commits.github.io/Splitdrop/';
  const FIELD_DEFS = {
    url:     [{id:'url', label:'URL', hint:DEFAULT_URL}],
    text:    [{id:'text', label:'Text', hint:'Any text you like'}],
    email:   [{id:'email', label:'Email address', hint:'name@domain.com'}, {id:'subject', label:'Subject (optional)'}, {id:'body', label:'Message (optional)'}],
    phone:   [{id:'phone', label:'Phone number', hint:'+919999999999'}],
    sms:     [{id:'phone', label:'Phone number', hint:'+919999999999'}, {id:'body', label:'Message (optional)'}],
    whatsapp:[{id:'phone', label:'WhatsApp number (with country code, no +)', hint:'919999999999'}, {id:'body', label:'Pre-filled message (optional)'}],
    wifi:    [{id:'ssid', label:'Network name (SSID)'}, {id:'password', label:'Password'}, {id:'enc', label:'Encryption', hint:'WPA (or WEP / nopass)'}],
    upi:     [{id:'vpa', label:'UPI ID', hint:'name@upi'}, {id:'name', label:'Payee name'}, {id:'amount', label:'Amount (optional)'}],
    vcard:   [{id:'name', label:'Full name'}, {id:'org', label:'Organization (optional)'}, {id:'phone', label:'Phone'}, {id:'email', label:'Email'}, {id:'url', label:'Website (optional)', hint:DEFAULT_URL}]
  };

  function setInputValue(id, value){
    const el = document.getElementById('qf-' + id);
    return el ? el.value.trim() : value;
  }

  function renderFields(){
    fieldsContainer.innerHTML = '';
    FIELD_DEFS[currentType].forEach(f => {
      const wrap = document.createElement('div');
      wrap.className = 'qr-field';

      const label = document.createElement('label');
      label.setAttribute('for', 'qf-' + f.id);
      label.textContent = f.label;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'qf-' + f.id;
      input.addEventListener('input', generate);

      wrap.append(label, input);
      if(f.hint){
        const hint = document.createElement('small');
        hint.textContent = f.hint;
        hint.style.display = 'block';
        hint.style.marginTop = '6px';
        hint.style.fontSize = '11.5px';
        hint.style.color = 'var(--muted-2)';
        wrap.appendChild(hint);
      }
      fieldsContainer.appendChild(wrap);
    });
  }

  function val(id){
    const el = document.getElementById('qf-' + id);
    return el ? el.value.trim() : '';
  }

  function buildContent(){
    switch(currentType){
      case 'url': {
        let u = val('url');
        if(u && !u.toLowerCase().startsWith('http://') && !u.toLowerCase().startsWith('https://')) u = 'https://' + u;
        return u || DEFAULT_URL;
      }
      case 'text':
        return val('text') || 'Hello from Splitdrop';
      case 'email': {
        const e = val('email');
        const s = val('subject');
        const b = val('body');
        let out = 'mailto:' + e;
        const params = [];
        if(s) params.push('subject=' + encodeURIComponent(s));
        if(b) params.push('body=' + encodeURIComponent(b));
        if(params.length) out += '?' + params.join('&');
        return e ? out : 'mailto:';
      }
      case 'phone':
        return 'tel:' + (val('phone') || '');
      case 'sms': {
        const p = val('phone');
        const b = val('body');
        return 'sms:' + p + (b ? '?body=' + encodeURIComponent(b) : '');
      }
      case 'whatsapp': {
        const p = val('phone').replace(/\D/g,'');
        const b = val('body');
        return `https://wa.me/${p}${b ? '?text=' + encodeURIComponent(b) : ''}`;
      }
      case 'wifi': {
        const ssid = val('ssid');
        const pass = val('password');
        const enc = (val('enc') || 'WPA').toUpperCase();
        return `WIFI:T:${enc};S:${ssid};P:${pass};H:false;;`;
      }
      case 'upi': {
        const pa = val('vpa');
        const pn = val('name');
        const am = val('amount');
        let out = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}`;
        if(am) out += `&am=${encodeURIComponent(am)}`;
        out += '&cu=INR';
        return out;
      }
      case 'vcard': {
        const name = val('name');
        const org = val('org');
        const phone = val('phone');
        const email = val('email');
        const url = val('url');
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\n${org ? 'ORG:' + org + '\n' : ''}${phone ? 'TEL:' + phone + '\n' : ''}${email ? 'EMAIL:' + email + '\n' : ''}${url ? 'URL:' + url + '\n' : ''}END:VCARD`;
      }
      default:
        return DEFAULT_URL;
    }
  }

  function drawLogo(){
    if(!logoImg) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width * 0.22;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
    ctx.drawImage(logoImg, x, y, size, size);
  }

  function generate(){
    const content = buildContent();
    lastContent = content;
    const nonce = ++renderNonce;
    QRCode.toCanvas(canvas, content, {
      width: 260,
      margin: 2,
      color: { dark: fgColor.value, light: bgColor.value }
    }, function(err){
      if(err || nonce !== renderNonce) return;
      if(logoImg) drawLogo();
    });
  }

  logoInput.onchange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    if(logoUrl){
      try { URL.revokeObjectURL(logoUrl); } catch (_) {}
    }
    const img = new Image();
    logoUrl = URL.createObjectURL(file);
    img.onload = () => {
      logoImg = img;
      generate();
      try { URL.revokeObjectURL(logoUrl); } catch (_) {}
      logoUrl = null;
    };
    img.onerror = () => {
      showToast('Could not load the logo image');
      try { URL.revokeObjectURL(logoUrl); } catch (_) {}
      logoUrl = null;
    };
    img.src = logoUrl;
  };

  typeGrid.querySelectorAll('.qr-type-btn').forEach(btn => {
    btn.type = 'button';
    btn.onclick = () => {
      typeGrid.querySelectorAll('.qr-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      renderFields();
      generate();
    };
  });

  fgColor.oninput = generate;
  bgColor.oninput = generate;

  downloadPng.onclick = () => {
    canvas.toBlob(blob => {
      if(!blob) return showToast('Could not create PNG');
      downloadBlob(blob, 'splitdrop-qrcode.png');
    });
  };

  downloadSvg.onclick = () => {
    if(!lastContent) {
      showToast('Create a QR code first');
      return;
    }
    QRCode.toString(lastContent, { type:'svg', margin:2, color:{ dark:fgColor.value, light:bgColor.value } }, (err, svgStr) => {
      if(err){
        showToast('Could not create SVG');
        return;
      }
      const blob = new Blob([svgStr], { type:'image/svg+xml' });
      downloadBlob(blob, 'splitdrop-qrcode.svg');
    });
  };

  renderFields();
  generate();
})();
