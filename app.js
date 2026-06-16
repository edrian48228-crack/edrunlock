// ===== UnlockBox app =====
const STORAGE_BOXES = 'ub_boxes_v1';
const STORAGE_CLIENTS = 'ub_clients_v1';

const defaultBoxes = [
  {
    id: 'b1',
    name: 'DecoderX Pro 4K',
    price: '$15 / mes',
    short: 'Caja 4K Android con WiFi de doble banda',
    info: 'Decodificador 4K UHD con sistema Android 11, 4GB RAM, 32GB almacenamiento, soporte HDR10+ y todas las apps de streaming preinstaladas. Incluye control remoto por voz y cable HDMI.',
    image: 'images/box1.jpg',
    whatsapp: 'https://wa.me/10000000000',
    facebook: 'https://facebook.com/',
    telegram: 'https://t.me/',
    downloads: [
      {label:'Firmware v2.3', url:'https://example.com/firmware.zip'},
      {label:'Manual PDF', url:'https://example.com/manual.pdf'}
    ]
  }
];

const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

const state = {
  boxes: load(STORAGE_BOXES, defaultBoxes),
  clients: load(STORAGE_CLIENTS, [])
};

function load(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v||fallback}catch{return fallback}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function uid(){return 'id'+Math.random().toString(36).slice(2,9)}

// SVG icons
const icons = {
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6A12 12 0 0 0 12 24c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.5zM12 22a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 22 12c0 5.5-4.5 10-10 10zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.8.6.7.2 1.4.2 2 .1.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M24 12C24 5.4 18.6 0 12 0S0 5.4 0 12c0 6 4.4 11 10.1 11.9V15.5H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.6 8.2-1.9 8.9c-.1.6-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.6-5c.2-.2 0-.3-.3-.1l-6.9 4.3-3-.9c-.6-.2-.6-.6.1-.9l11.7-4.5c.6-.2 1.1.1.9 1z"/></svg>',
  info: '<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm1 18h-2v-7h2v7zm-1-9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z"/></svg>'
};

// ===== Render =====
function renderBoxes(){
  const q = $('#searchBox').value.toLowerCase().trim();
  const grid = $('#boxGrid');
  const list = state.boxes.filter(b => !q || b.name.toLowerCase().includes(q) || (b.short||'').toLowerCase().includes(q));
  grid.innerHTML = list.length ? list.map(b => boxCard(b)).join('') : '<p style="color:var(--muted)">No hay cajas disponibles. Agrega una desde Admin.</p>';
}

function boxCard(b){
  return `
  <article class="card box-card">
    <div class="box-img">${b.image?`<img src="${b.image}" alt="${esc(b.name)}" loading="lazy">`:''}</div>
    <div class="box-body">
      <h3 class="box-title">${esc(b.name)}</h3>
      <div class="box-price">${esc(b.price||'')}</div>
      <p class="box-desc">${esc(b.short||'')}</p>
      <div class="box-actions">
        ${b.whatsapp?`<a class="icon-btn" title="WhatsApp" href="${b.whatsapp}" target="_blank" rel="noopener">${icons.whatsapp}</a>`:''}
        ${b.facebook?`<a class="icon-btn" title="Facebook" href="${b.facebook}" target="_blank" rel="noopener">${icons.facebook}</a>`:''}
        ${b.telegram?`<a class="icon-btn" title="Telegram" href="${b.telegram}" target="_blank" rel="noopener">${icons.telegram}</a>`:''}
        <button class="icon-btn" title="Más información" onclick="showInfo('${b.id}')">${icons.info}</button>
        ${(b.downloads||[]).length?`<button class="icon-btn" title="Descargas" onclick="showInfo('${b.id}')">${icons.download}</button>`:''}
      </div>
    </div>
  </article>`;
}

function showInfo(id){
  const b = state.boxes.find(x=>x.id===id); if(!b) return;
  $('#modalBody').innerHTML = `
    ${b.image?`<img src="${b.image}" alt="" style="border-radius:10px;margin-bottom:14px;max-height:260px;object-fit:cover;width:100%">`:''}
    <h3>${esc(b.name)}</h3>
    <p style="color:var(--primary-glow);font-weight:800">${esc(b.price||'')}</p>
    <p>${esc(b.info||b.short||'')}</p>
    ${(b.downloads||[]).length?`<h4>Descargas</h4><ul class="download-list">${b.downloads.map(d=>`<li><a href="${d.url}" target="_blank" rel="noopener">⬇ ${esc(d.label)}</a></li>`).join('')}</ul>`:''}
    <div class="box-actions" style="margin-top:16px">
      ${b.whatsapp?`<a class="btn btn-primary btn-sm" href="${b.whatsapp}" target="_blank">WhatsApp</a>`:''}
      ${b.facebook?`<a class="btn btn-ghost btn-sm" href="${b.facebook}" target="_blank">Facebook</a>`:''}
      ${b.telegram?`<a class="btn btn-ghost btn-sm" href="${b.telegram}" target="_blank">Telegram</a>`:''}
    </div>`;
  $('#infoModal').hidden = false;
}
window.showInfo = showInfo;

// ===== Clients =====
function renderClients(){
  const tbody = $('#clientsTable tbody');
  tbody.innerHTML = state.clients.length ? state.clients.map(c=>`
    <tr>
      <td>${esc(c.name)}</td>
      <td><a href="https://wa.me/${(c.phone||'').replace(/\D/g,'')}" target="_blank">${esc(c.phone)}</a></td>
      <td>${esc(c.box)}</td>
      <td><span class="badge ${c.status}">${c.status}</span></td>
      <td>${new Date(c.date).toLocaleDateString()}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delClient('${c.id}')">Eliminar</button></td>
    </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:30px">Sin clientes registrados</td></tr>';

  const sel = $('#boxSelect');
  sel.innerHTML = state.boxes.map(b=>`<option value="${esc(b.name)}">${esc(b.name)}</option>`).join('') || '<option>—</option>';
}
window.delClient = (id)=>{ if(confirm('¿Eliminar cliente?')){state.clients=state.clients.filter(c=>c.id!==id);save(STORAGE_CLIENTS,state.clients);renderClients()} };

// ===== Admin =====
function renderAdmin(){
  const grid = $('#adminGrid');
  grid.innerHTML = state.boxes.map(b=>`
    <article class="card box-card">
      <div class="box-img">${b.image?`<img src="${b.image}" alt="">`:''}</div>
      <div class="box-body">
        <h3 class="box-title">${esc(b.name)}</h3>
        <div class="box-price">${esc(b.price||'')}</div>
        <div class="box-actions">
          <button class="btn btn-sm btn-ghost" onclick="editBox('${b.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="delBox('${b.id}')">Eliminar</button>
        </div>
      </div>
    </article>`).join('');
}
window.editBox = (id)=>{
  const b = state.boxes.find(x=>x.id===id); if(!b) return;
  const f = $('#boxForm');
  for(const k of ['id','name','price','short','info','image','whatsapp','facebook','telegram']){
    if(f[k]) f[k].value = b[k]||'';
  }
  f.downloads.value = (b.downloads||[]).map(d=>`${d.label}|${d.url}`).join(', ');
  window.scrollTo({top:0,behavior:'smooth'});
};
window.delBox = (id)=>{ if(confirm('¿Eliminar caja?')){state.boxes=state.boxes.filter(b=>b.id!==id);save(STORAGE_BOXES,state.boxes);renderAdmin();renderBoxes();renderClients()} };

// ===== Form handlers =====
$('#boxForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const downloads = (fd.get('downloads')||'').split(',').map(s=>s.trim()).filter(Boolean).map(p=>{
    const [label,url] = p.split('|').map(x=>x?.trim()); return {label:label||'Descargar', url:url||'#'};
  });
  const data = {
    id: fd.get('id') || uid(),
    name: fd.get('name'), price: fd.get('price'),
    short: fd.get('short'), info: fd.get('info'),
    image: fd.get('image'),
    whatsapp: fd.get('whatsapp'), facebook: fd.get('facebook'), telegram: fd.get('telegram'),
    downloads
  };
  const idx = state.boxes.findIndex(b=>b.id===data.id);
  if(idx>=0) state.boxes[idx]=data; else state.boxes.push(data);
  save(STORAGE_BOXES,state.boxes);
  e.target.reset();
  renderAdmin(); renderBoxes(); renderClients();
  alert('Caja guardada');
});

$('#imageFile').addEventListener('change', e=>{
  const f = e.target.files?.[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => { $('#boxForm').image.value = r.result; };
  r.readAsDataURL(f);
});

$('#registerForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const c = {
    id: uid(), date: Date.now(),
    name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'),
    address: fd.get('address'), box: fd.get('box'), status: fd.get('status'), notes: fd.get('notes')
  };
  state.clients.unshift(c);
  save(STORAGE_CLIENTS, state.clients);
  e.target.reset();
  renderClients();
  alert('Cliente registrado correctamente');
});

$('#exportClients').addEventListener('click', ()=>{
  if(!state.clients.length) return alert('Sin datos');
  const rows = [['Nombre','Teléfono','Email','Dirección','Caja','Estado','Notas','Fecha']];
  state.clients.forEach(c=>rows.push([c.name,c.phone,c.email,c.address,c.box,c.status,c.notes,new Date(c.date).toLocaleString()]));
  const csv = rows.map(r=>r.map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'clientes.csv'; a.click();
});

$('#searchBox').addEventListener('input', renderBoxes);

// Navigation
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>{
  $$('.nav-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  $$('.view').forEach(v=>v.classList.remove('active'));
  $('#'+b.dataset.view).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}));

$('#modalClose').addEventListener('click',()=>$('#infoModal').hidden=true);
$('#infoModal').addEventListener('click',e=>{if(e.target.id==='infoModal')$('#infoModal').hidden=true});

$('#year').textContent = new Date().getFullYear();

function esc(s){return (s??'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

renderBoxes(); renderClients(); renderAdmin();
