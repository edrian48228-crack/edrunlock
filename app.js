// ===== UnlockBox app =====
const STORAGE_BOXES = 'ub_boxes_v2';
const STORAGE_CLIENTS = 'ub_clients_v2';
const STORAGE_SLIDES = 'ub_slides_v1';
const STORAGE_SITE = 'ub_site_v1';

const defaultBoxes = [
  {
    id: 'b1', name: 'DecoderX Pro 4K', price: '$15 / mes',
    short: 'Caja 4K Android con WiFi doble banda',
    info: 'Decodificador 4K UHD con Android 11, 4GB RAM, 32GB, HDR10+, control por voz y HDMI incluido.',
    image: 'images/box1.jpg',
    whatsapp:'https://wa.me/5354975132', facebook:'', telegram:'https://t.me/siouxs_unlock',
    downloads:[{label:'Firmware v2.3',url:'https://example.com/firmware.zip'},{label:'Manual PDF',url:'https://example.com/manual.pdf'}]
  }
];

const defaultSlides = [
  { id:'s1', title:'iRemoval Pro', image:'https://siouxs.net/images/gallery/storebanners/10322_1920_400.jpg', link:'' },
  { id:'s2', title:'Drag Unlock',  image:'https://siouxs.net/images/gallery/banners/Banner%20Drag%20Unlock.png', link:'' },
  { id:'s3', title:'Perseus Bypass', image:'https://siouxs.net/images/gallery/banners/Perseus%20Bypass.png', link:'' }
];

const defaultSite = {
  phone:'+53 5497 5132', email:'contacto@unlockbox.com',
  payments:'CUP, MCL, Zelle, Peso Mexicano, USDT.',
  hours1:'Lunes a Sábado', hours2:'8 AM a 5 PM.',
  waLink:'https://wa.me/5354975132',
  tgLink:'https://t.me/siouxsnet', tgLink2:'https://t.me/siouxs_unlock',
  bioLink:'https://bio.link/siouxsunlocker'
};

const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const load = (k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
const save = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid  = ()=>'id'+Math.random().toString(36).slice(2,9);
const esc  = s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const state = {
  boxes:  load(STORAGE_BOXES, defaultBoxes),
  clients:load(STORAGE_CLIENTS, []),
  slides: load(STORAGE_SLIDES, defaultSlides),
  site:   {...defaultSite, ...load(STORAGE_SITE,{})}
};

// SVG icons
const icons = {
  whatsapp:'<svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6A12 12 0 0 0 12 24c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.5zM12 22a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 22 12c0 5.5-4.5 10-10 10zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.8.6.7.2 1.4.2 2 .1.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>',
  facebook:'<svg viewBox="0 0 24 24"><path d="M24 12C24 5.4 18.6 0 12 0S0 5.4 0 12c0 6 4.4 11 10.1 11.9V15.5H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"/></svg>',
  telegram:'<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.6 8.2-1.9 8.9c-.1.6-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.6-5c.2-.2 0-.3-.3-.1l-6.9 4.3-3-.9c-.6-.2-.6-.6.1-.9l11.7-4.5c.6-.2 1.1.1.9 1z"/></svg>',
  info:'<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm1 18h-2v-7h2v7zm-1-9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>',
  download:'<svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z"/></svg>',
  bio:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>'
};

// ===== RENDER =====
function renderBoxes(){
  const q = ($('#searchBox')?.value||'').toLowerCase().trim();
  const grid = $('#boxGrid'); if(!grid) return;
  const list = state.boxes.filter(b=>!q||b.name.toLowerCase().includes(q)||(b.short||'').toLowerCase().includes(q));
  grid.innerHTML = list.length?list.map(boxCard).join(''):'<p style="color:#666">No hay cajas. Agrega una desde Admin.</p>';
  const sel = $('#boxSelect'); if(sel) sel.innerHTML = state.boxes.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('');
}
function boxCard(b){
  return `<article class="card box-card">
    <div class="box-img">${b.image?`<img src="${b.image}" alt="${esc(b.name)}" loading="lazy">`:''}</div>
    <div class="box-body">
      <h3 class="box-title">${esc(b.name)}</h3>
      <div class="box-price">${esc(b.price||'')}</div>
      <p class="box-desc">${esc(b.short||'')}</p>
      <div class="box-actions">
        ${b.whatsapp?`<a class="icon-btn" title="WhatsApp" href="${b.whatsapp}" target="_blank" rel="noopener">${icons.whatsapp}</a>`:''}
        ${b.facebook?`<a class="icon-btn" title="Facebook" href="${b.facebook}" target="_blank" rel="noopener">${icons.facebook}</a>`:''}
        ${b.telegram?`<a class="icon-btn" title="Telegram" href="${b.telegram}" target="_blank" rel="noopener">${icons.telegram}</a>`:''}
        <button class="icon-btn" title="Más info" onclick="showInfo('${b.id}')">${icons.info}</button>
        ${(b.downloads||[]).length?`<button class="icon-btn" title="Descargas" onclick="showInfo('${b.id}')">${icons.download}</button>`:''}
      </div>
    </div>
  </article>`;
}
window.showInfo = function(id){
  const b = state.boxes.find(x=>x.id===id); if(!b) return;
  $('#modalBody').innerHTML = `
    ${b.image?`<img src="${b.image}" alt="" style="border-radius:8px;margin-bottom:14px;max-height:260px;object-fit:cover;width:100%">`:''}
    <h3>${esc(b.name)}</h3>
    <p style="color:var(--primary-2);font-weight:700">${esc(b.price||'')}</p>
    <p>${esc(b.info||b.short||'')}</p>
    ${(b.downloads||[]).length?`<h4>Descargas</h4><ul class="download-list">${b.downloads.map(d=>`<li><a href="${d.url}" target="_blank" rel="noopener">⬇ ${esc(d.label)}</a></li>`).join('')}</ul>`:''}
    <div class="box-actions" style="margin-top:16px">
      ${b.whatsapp?`<a class="btn btn-primary btn-sm" href="${b.whatsapp}" target="_blank">WhatsApp</a>`:''}
      ${b.telegram?`<a class="btn btn-ghost btn-sm" href="${b.telegram}" target="_blank">Telegram</a>`:''}
    </div>`;
  $('#infoModal').hidden = false;
};

function renderClients(){
  const tbody = $('#clientsTable tbody'); if(!tbody) return;
  tbody.innerHTML = state.clients.map(c=>{
    const box = state.boxes.find(b=>b.id===c.boxId);
    return `<tr>
      <td>${esc(c.name)}</td><td>${esc(c.phone)}</td>
      <td>${esc(box?box.name:'-')}</td>
      <td><span class="badge ${c.status}">${esc(c.status)}</span></td>
      <td>${new Date(c.date).toLocaleDateString()}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delClient('${c.id}')">×</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px">Sin clientes registrados</td></tr>';
}
window.delClient = id=>{ if(confirm('¿Eliminar cliente?')){state.clients=state.clients.filter(c=>c.id!==id);save(STORAGE_CLIENTS,state.clients);renderClients();}};

function renderAdmin(){
  const g = $('#adminGrid'); if(!g) return;
  g.innerHTML = state.boxes.map(b=>`
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
window.editBox = id=>{
  const b=state.boxes.find(x=>x.id===id); if(!b)return;
  const f=$('#boxForm');
  f.id.value=b.id; f.name.value=b.name; f.price.value=b.price||''; f.short.value=b.short||'';
  f.info.value=b.info||''; f.image.value=b.image||''; f.whatsapp.value=b.whatsapp||'';
  f.facebook.value=b.facebook||''; f.telegram.value=b.telegram||'';
  f.downloads.value=(b.downloads||[]).map(d=>`${d.label}|${d.url}`).join(',');
  window.scrollTo({top:0,behavior:'smooth'});
};
window.delBox = id=>{if(confirm('¿Eliminar caja?')){state.boxes=state.boxes.filter(b=>b.id!==id);save(STORAGE_BOXES,state.boxes);renderAdmin();renderBoxes();}};

function renderSlidesAdmin(){
  const g=$('#slidesGrid'); if(!g) return;
  g.innerHTML = state.slides.map(s=>`
    <article class="card box-card">
      <div class="box-img">${s.image?`<img src="${s.image}" alt="">`:''}</div>
      <div class="box-body">
        <h3 class="box-title">${esc(s.title||'(sin título)')}</h3>
        <div class="box-actions">
          <button class="btn btn-sm btn-ghost" onclick="editSlide('${s.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="delSlide('${s.id}')">Eliminar</button>
        </div>
      </div>
    </article>`).join('');
}
window.editSlide = id=>{
  const s=state.slides.find(x=>x.id===id); if(!s)return;
  const f=$('#slideForm');
  f.id.value=s.id; f.title.value=s.title||''; f.image.value=s.image||''; f.link.value=s.link||'';
  window.scrollTo({top:0,behavior:'smooth'});
};
window.delSlide = id=>{if(confirm('¿Eliminar banner?')){state.slides=state.slides.filter(s=>s.id!==id);save(STORAGE_SLIDES,state.slides);renderSlidesAdmin();renderSlider();}};

// ===== SLIDER =====
let slideIdx=0, slideTimer=null;
function renderSlider(){
  const wrap=$('#slides'), dots=$('#slDots'); if(!wrap)return;
  wrap.innerHTML = state.slides.map(s=>`
    <div class="slide">${s.link?`<a href="${s.link}" target="_blank" rel="noopener"><img src="${s.image}" alt="${esc(s.title||'')}"></a>`:`<img src="${s.image}" alt="${esc(s.title||'')}">`}</div>
  `).join('');
  dots.innerHTML = state.slides.map((_,i)=>`<span class="${i===0?'active':''}" onclick="goSlide(${i})"></span>`).join('');
  slideIdx=0; updateSlider(); restartAuto();
}
function updateSlider(){
  const w=$('#slides'); if(!w||!state.slides.length)return;
  w.style.transform=`translateX(-${slideIdx*100}%)`;
  $$('#slDots span').forEach((d,i)=>d.classList.toggle('active',i===slideIdx));
}
window.goSlide = i=>{slideIdx=i;updateSlider();restartAuto()};
function restartAuto(){clearInterval(slideTimer);slideTimer=setInterval(()=>{slideIdx=(slideIdx+1)%Math.max(state.slides.length,1);updateSlider()},5000)}

// ===== SITE CONFIG render =====
function renderSite(){
  const s=state.site;
  $('#topPhone span').textContent = s.phone||'';
  $('#topPhone').href = 'tel:'+(s.phone||'').replace(/\s/g,'');
  $('#topEmail span').textContent = s.email||'';
  $('#topEmail').href = 'mailto:'+(s.email||'');
  $('#payMethods').textContent = s.payments||'';
  $('#hoursLine1').textContent = s.hours1||'';
  $('#hoursLine2').textContent = s.hours2||'';
  $('#contactIcons').innerHTML = `
    ${s.tgLink?`<a class="tg" href="${s.tgLink}" target="_blank" rel="noopener" title="Telegram">${icons.telegram}</a>`:''}
    ${s.tgLink2?`<a class="tg" href="${s.tgLink2}" target="_blank" rel="noopener" title="Telegram soporte">${icons.telegram}</a>`:''}
    ${s.waLink?`<a class="wa" href="${s.waLink}" target="_blank" rel="noopener" title="WhatsApp">${icons.whatsapp}</a>`:''}
    ${s.bioLink?`<a class="bio" href="${s.bioLink}" target="_blank" rel="noopener" title="Bio.link">${icons.bio}</a>`:''}
  `;
  // populate site form
  const f=$('#siteForm'); if(f) Object.keys(s).forEach(k=>{if(f[k])f[k].value=s[k]||''});
}

// ===== NAV =====
function showView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===name));
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== EVENTS =====
document.addEventListener('DOMContentLoaded',()=>{
  $('#year').textContent = new Date().getFullYear();

  $$('.nav-btn,[data-view]').forEach(b=>b.addEventListener('click',e=>{
    const v=b.dataset.view; if(v){e.preventDefault();showView(v)}
  }));

  $('#searchBox')?.addEventListener('input',renderBoxes);
  $('#modalClose')?.addEventListener('click',()=>$('#infoModal').hidden=true);
  $('#infoModal')?.addEventListener('click',e=>{if(e.target.id==='infoModal')$('#infoModal').hidden=true});

  $('#slPrev')?.addEventListener('click',()=>{slideIdx=(slideIdx-1+state.slides.length)%state.slides.length;updateSlider();restartAuto()});
  $('#slNext')?.addEventListener('click',()=>{slideIdx=(slideIdx+1)%state.slides.length;updateSlider();restartAuto()});

  // register client
  $('#registerForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    state.clients.unshift({
      id:uid(),name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email'),
      address:fd.get('address'),boxId:fd.get('box'),status:fd.get('status'),
      notes:fd.get('notes'),date:Date.now()
    });
    save(STORAGE_CLIENTS,state.clients); renderClients(); e.target.reset();
    alert('Cliente registrado ✔');
  });

  $('#exportClients')?.addEventListener('click',()=>{
    const rows=[['Nombre','Teléfono','Email','Dirección','Caja','Estado','Notas','Fecha']];
    state.clients.forEach(c=>{
      const b=state.boxes.find(x=>x.id===c.boxId);
      rows.push([c.name,c.phone,c.email,c.address,b?b.name:'',c.status,c.notes,new Date(c.date).toLocaleString()]);
    });
    const csv=rows.map(r=>r.map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    const a=document.createElement('a');a.href=url;a.download='clientes.csv';a.click();
  });

  // admin: box form + image upload
  $('#imageFile')?.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();r.onload=ev=>{$('#boxForm').image.value=ev.target.result};r.readAsDataURL(f);
  });
  $('#boxForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const downloads=(fd.get('downloads')||'').split(',').map(s=>s.trim()).filter(Boolean).map(p=>{
      const [label,url]=p.split('|');return{label:label?.trim()||url,url:(url||'').trim()};
    });
    const data={
      name:fd.get('name'),price:fd.get('price'),short:fd.get('short'),info:fd.get('info'),
      image:fd.get('image'),whatsapp:fd.get('whatsapp'),facebook:fd.get('facebook'),
      telegram:fd.get('telegram'),downloads
    };
    const id=fd.get('id');
    if(id){Object.assign(state.boxes.find(b=>b.id===id),data)} else {state.boxes.push({id:uid(),...data})}
    save(STORAGE_BOXES,state.boxes); renderAdmin(); renderBoxes(); e.target.reset();
    alert('Caja guardada ✔');
  });

  // admin: slide form + upload
  $('#slideFile')?.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();r.onload=ev=>{$('#slideForm').image.value=ev.target.result};r.readAsDataURL(f);
  });
  $('#slideForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const data={title:fd.get('title'),image:fd.get('image'),link:fd.get('link')};
    const id=fd.get('id');
    if(id){Object.assign(state.slides.find(s=>s.id===id),data)} else {state.slides.push({id:uid(),...data})}
    save(STORAGE_SLIDES,state.slides); renderSlidesAdmin(); renderSlider(); e.target.reset();
    alert('Banner guardado ✔');
  });

  // admin: site config
  $('#siteForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    fd.forEach((v,k)=>{state.site[k]=v});
    save(STORAGE_SITE,state.site); renderSite();
    alert('Configuración guardada ✔');
  });

  // admin tabs
  $$('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
    $$('.tab-btn').forEach(x=>x.classList.toggle('active',x===b));
    $$('.tab-pane').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab));
  }));

  renderSite();
  renderSlider();
  renderBoxes();
  renderClients();
  renderAdmin();
  renderSlidesAdmin();
});
