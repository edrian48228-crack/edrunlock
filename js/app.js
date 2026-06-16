/* =====================================================
   UNLOCK BOX — App Logic (vanilla JS)
   Data persisted in localStorage.
===================================================== */

// ⚠️ Cambia esta contraseña para tu administrador
const ADMIN_PASSWORD = 'admin123';

const STORAGE = {
  boxes: 'ub_boxes_v1',
  clients: 'ub_clients_v1',
  session: 'ub_admin_session'
};

const DEFAULT_BOXES = [
  {
    id: cryptoId(),
    name: 'iRemoval PRO',
    price: 25,
    image: 'images/box-sample.jpg',
    short: 'iCloud Bypass con señal para iPhone XR a 15 Pro Max.',
    description: 'Solución definitiva de bypass de iCloud con señal. Compatible con iPhone XR hasta iPhone 15 Pro Max. Incluye soporte y actualizaciones.',
    features: ['Bypass iCloud con señal', 'iPhone XR - 15 Pro Max', 'Soporte 24/7', 'Actualizaciones gratis'],
    downloads: [
      { label: 'Descargar v2.3', url: '#' },
      { label: 'Manual PDF', url: '#' }
    ],
    whatsapp: '5354975132',
    telegram: 'https://t.me/siouxs_unlock',
    facebook: 'https://facebook.com',
    phone: '+5354975132',
    moreInfo: 'https://iremoval.pro'
  },
  {
    id: cryptoId(),
    name: 'Unlock Tool',
    price: 18,
    image: 'images/box-sample.jpg',
    short: 'Herramienta multimarca para FRP, MDM y desbloqueo.',
    description: 'Caja universal de desbloqueo para múltiples marcas Android. Soporte para FRP, MDM, patrón, PIN y más.',
    features: ['Multi-marca Android', 'FRP / MDM bypass', 'Actualizaciones diarias'],
    downloads: [{ label: 'Última versión', url: '#' }],
    whatsapp: '5354975132',
    telegram: '@unlockbox',
    facebook: '',
    phone: '+5354975132',
    moreInfo: ''
  }
];

/* ============ Utils ============ */
function cryptoId() { return 'b_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function escapeHtml(s = '') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ============ State ============ */
let boxes = load(STORAGE.boxes, null);
if (!boxes) { boxes = DEFAULT_BOXES; save(STORAGE.boxes, boxes); }
let clients = load(STORAGE.clients, []);

/* ============ Render: Public Boxes ============ */
function renderBoxes(filter = '') {
  const grid = $('#boxesGrid');
  const q = filter.trim().toLowerCase();
  const list = boxes.filter(b => !q || b.name.toLowerCase().includes(q) || (b.short || '').toLowerCase().includes(q));
  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-dim)">No se encontraron cajas.</p>`;
    return;
  }
  grid.innerHTML = list.map(b => `
    <article class="box-card" data-id="${b.id}">
      <div class="box-img" style="background-image:url('${escapeHtml(b.image || 'images/box-sample.jpg')}')">
        ${b.price ? `<div class="box-price">$${escapeHtml(b.price)}/mes</div>` : ''}
      </div>
      <div class="box-body">
        <h3>${escapeHtml(b.name)}</h3>
        <p>${escapeHtml(b.short || '')}</p>
        <div class="box-actions">
          ${b.whatsapp ? `<a class="icon-btn wa" title="WhatsApp" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(b.whatsapp.replace(/\D/g,''))}"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
          ${b.telegram ? `<a class="icon-btn tg" title="Telegram" target="_blank" rel="noopener" href="${tgLink(b.telegram)}"><i class="fa-brands fa-telegram"></i></a>` : ''}
          ${b.facebook ? `<a class="icon-btn fb" title="Facebook" target="_blank" rel="noopener" href="${escapeHtml(b.facebook)}"><i class="fa-brands fa-facebook"></i></a>` : ''}
          ${b.phone ? `<a class="icon-btn ph" title="Llamar" href="tel:${escapeHtml(b.phone)}"><i class="fa-solid fa-phone"></i></a>` : ''}
          ${(b.downloads && b.downloads.length) ? `<a class="icon-btn dl" title="Descargar" href="${escapeHtml(b.downloads[0].url)}" target="_blank" rel="noopener"><i class="fa-solid fa-download"></i></a>` : ''}
          <span class="spacer"></span>
          <button class="icon-btn info" title="Más información" data-info="${b.id}"><i class="fa-solid fa-circle-info"></i></button>
        </div>
      </div>
    </article>
  `).join('');
  $('#statBoxes').textContent = boxes.length;
  refreshBoxSelect();
}

function tgLink(t) {
  if (!t) return '#';
  if (/^https?:/.test(t)) return t;
  return 'https://t.me/' + t.replace(/^@/, '');
}

function refreshBoxSelect() {
  const sel = $('#boxSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Seleccionar --</option>' +
    boxes.map(b => `<option value="${escapeHtml(b.name)}">${escapeHtml(b.name)}</option>`).join('');
}

/* ============ Box Detail Modal ============ */
function openBoxDetail(id) {
  const b = boxes.find(x => x.id === id); if (!b) return;
  $('#boxModalContent').innerHTML = `
    <div class="detail-hero" style="background-image:url('${escapeHtml(b.image || 'images/box-sample.jpg')}')"></div>
    <h3>${escapeHtml(b.name)}</h3>
    ${b.price ? `<div class="detail-row"><span class="chip">💰 $${escapeHtml(b.price)}/mes</span></div>` : ''}
    <p style="color:var(--text-dim)">${escapeHtml(b.description || b.short || '')}</p>
    ${b.features && b.features.length ? `
      <h4 style="margin-top:18px;font-size:13px;color:var(--primary-2);text-transform:uppercase;letter-spacing:1px">Características</h4>
      <ul class="features-list">${b.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : ''}
    ${b.downloads && b.downloads.length ? `
      <h4 style="margin-top:14px;font-size:13px;color:var(--primary-2);text-transform:uppercase;letter-spacing:1px">Descargas</h4>
      <div class="dl-list">${b.downloads.map(d => `<a href="${escapeHtml(d.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-download"></i> ${escapeHtml(d.label || 'Descargar')}</a>`).join('')}</div>` : ''}
    <h4 style="margin-top:14px;font-size:13px;color:var(--primary-2);text-transform:uppercase;letter-spacing:1px">Contacto</h4>
    <div class="box-actions" style="border:none;padding-top:0">
      ${b.whatsapp ? `<a class="icon-btn wa" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(b.whatsapp.replace(/\D/g,''))}"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
      ${b.telegram ? `<a class="icon-btn tg" target="_blank" rel="noopener" href="${tgLink(b.telegram)}"><i class="fa-brands fa-telegram"></i></a>` : ''}
      ${b.facebook ? `<a class="icon-btn fb" target="_blank" rel="noopener" href="${escapeHtml(b.facebook)}"><i class="fa-brands fa-facebook"></i></a>` : ''}
      ${b.phone ? `<a class="icon-btn ph" href="tel:${escapeHtml(b.phone)}"><i class="fa-solid fa-phone"></i></a>` : ''}
      ${b.moreInfo ? `<a class="icon-btn info" target="_blank" rel="noopener" href="${escapeHtml(b.moreInfo)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
    </div>
    <div class="btn-row" style="margin-top:20px">
      <a href="#registro" class="btn btn-primary" onclick="closeModals()"><i class="fa-solid fa-paper-plane"></i> Solicitar Alquiler</a>
    </div>
  `;
  openModal('#boxModal');
}

/* ============ Modals ============ */
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModals() { $$('.modal').forEach(m => m.hidden = true); document.body.style.overflow = ''; }
window.closeModals = closeModals;

document.addEventListener('click', e => {
  if (e.target.matches('[data-close]')) closeModals();
  const info = e.target.closest('[data-info]'); if (info) openBoxDetail(info.dataset.info);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

/* ============ Mobile nav ============ */
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

/* ============ Search ============ */
$('#searchBox').addEventListener('input', e => renderBoxes(e.target.value));

/* ============ Registration ============ */
$('#registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get('name') || '').toString().trim();
  const phone = (fd.get('phone') || '').toString().trim();
  if (!name || name.length < 2) return toast('Nombre inválido');
  if (!phone || phone.length < 6) return toast('Teléfono inválido');
  const client = {
    id: cryptoId(),
    name, phone,
    email: (fd.get('email') || '').toString().trim(),
    location: (fd.get('location') || '').toString().trim(),
    box: (fd.get('box') || '').toString(),
    message: (fd.get('message') || '').toString().trim(),
    date: new Date().toISOString(),
    status: 'nuevo'
  };
  clients.unshift(client); save(STORAGE.clients, clients);
  e.target.reset();
  toast('¡Solicitud enviada! Te contactaremos pronto.');
  $('#statClients').textContent = clients.length;
});

/* ============ Admin auth ============ */
$('#adminBtn').addEventListener('click', e => {
  e.preventDefault();
  if (sessionStorage.getItem(STORAGE.session) === '1') openAdminPanel();
  else openModal('#adminLogin');
});
$('#adminLoginForm').addEventListener('submit', e => {
  e.preventDefault();
  if ($('#adminPass').value === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE.session, '1');
    $('#adminPass').value = '';
    openAdminPanel();
  } else toast('Contraseña incorrecta');
});
$('#adminLogout').addEventListener('click', () => {
  sessionStorage.removeItem(STORAGE.session);
  closeModals(); toast('Sesión cerrada');
});

function openAdminPanel() {
  closeModals(); openModal('#adminPanel');
  renderAdminBoxes(); renderAdminClients();
}

/* ============ Admin Tabs ============ */
$$('.admin-tabs .tab[data-tab]').forEach(t => {
  t.addEventListener('click', () => {
    $$('.admin-tabs .tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    $$('.tab-pane').forEach(p => p.classList.remove('active'));
    $('#tab-' + t.dataset.tab).classList.add('active');
  });
});

/* ============ Admin: Boxes CRUD ============ */
function renderAdminBoxes() {
  $('#adminBoxList').innerHTML = boxes.map(b => `
    <div class="admin-item">
      <img src="${escapeHtml(b.image || 'images/box-sample.jpg')}" alt="" />
      <div class="info">
        <strong>${escapeHtml(b.name)}</strong>
        <small>${escapeHtml(b.short || '')}</small>
      </div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm" data-edit="${b.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost btn-sm" data-del="${b.id}" style="color:var(--accent)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('') || `<p class="muted">Sin cajas todavía.</p>`;
}

$('#newBoxBtn').addEventListener('click', () => openBoxEditor());
document.addEventListener('click', e => {
  const ed = e.target.closest('[data-edit]'); if (ed) openBoxEditor(ed.dataset.edit);
  const dl = e.target.closest('[data-del]'); if (dl) {
    if (confirm('¿Eliminar esta caja?')) {
      boxes = boxes.filter(b => b.id !== dl.dataset.del);
      save(STORAGE.boxes, boxes); renderBoxes(); renderAdminBoxes(); toast('Caja eliminada');
    }
  }
  const delc = e.target.closest('[data-delclient]'); if (delc) {
    if (confirm('¿Eliminar este cliente?')) {
      clients = clients.filter(c => c.id !== delc.dataset.delclient);
      save(STORAGE.clients, clients); renderAdminClients(); $('#statClients').textContent = clients.length;
    }
  }
});

function openBoxEditor(id) {
  const editing = id ? boxes.find(b => b.id === id) : null;
  $('#editorTitle').textContent = editing ? 'Editar Caja' : 'Nueva Caja';
  const f = $('#boxForm');
  f.reset();
  f.id.value = editing?.id || '';
  if (editing) {
    f.name.value = editing.name || '';
    f.price.value = editing.price || '';
    f.image.value = editing.image || '';
    f.short.value = editing.short || '';
    f.description.value = editing.description || '';
    f.features.value = (editing.features || []).join('\n');
    f.whatsapp.value = editing.whatsapp || '';
    f.telegram.value = editing.telegram || '';
    f.facebook.value = editing.facebook || '';
    f.phone.value = editing.phone || '';
    f.moreInfo.value = editing.moreInfo || '';
  }
  renderDownloads(editing?.downloads || []);
  openModal('#boxEditor');
}

function renderDownloads(items) {
  const wrap = $('#downloadsWrap');
  wrap.innerHTML = items.map((d, i) => downloadRow(d, i)).join('') || downloadRow({}, 0);
}
function downloadRow(d = {}, i) {
  return `<div class="row" data-dl style="margin-bottom:8px">
    <input placeholder="Etiqueta" data-dl-label value="${escapeHtml(d.label || '')}" />
    <div style="display:flex;gap:6px">
      <input placeholder="URL" data-dl-url value="${escapeHtml(d.url || '')}" style="flex:1" />
      <button type="button" class="btn btn-ghost btn-sm" data-removedl>&times;</button>
    </div>
  </div>`;
}
$('#addDownload').addEventListener('click', () => {
  $('#downloadsWrap').insertAdjacentHTML('beforeend', downloadRow({}, 0));
});
$('#downloadsWrap').addEventListener('click', e => {
  if (e.target.closest('[data-removedl]')) e.target.closest('[data-dl]').remove();
});

$('#imageFile').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  if (file.size > 800 * 1024) return toast('Imagen muy grande (máx ~800KB)');
  const r = new FileReader();
  r.onload = () => { $('#boxForm').image.value = r.result; toast('Imagen cargada'); };
  r.readAsDataURL(file);
});

$('#boxForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const downloads = $$('[data-dl]', $('#downloadsWrap')).map(row => ({
    label: row.querySelector('[data-dl-label]').value.trim(),
    url: row.querySelector('[data-dl-url]').value.trim()
  })).filter(d => d.url);
  const data = {
    id: f.id.value || cryptoId(),
    name: f.name.value.trim(),
    price: parseFloat(f.price.value) || 0,
    image: f.image.value.trim(),
    short: f.short.value.trim(),
    description: f.description.value.trim(),
    features: f.features.value.split('\n').map(s => s.trim()).filter(Boolean),
    downloads,
    whatsapp: f.whatsapp.value.trim(),
    telegram: f.telegram.value.trim(),
    facebook: f.facebook.value.trim(),
    phone: f.phone.value.trim(),
    moreInfo: f.moreInfo.value.trim()
  };
  if (!data.name) return toast('Nombre requerido');
  const ix = boxes.findIndex(b => b.id === data.id);
  if (ix >= 0) boxes[ix] = data; else boxes.push(data);
  save(STORAGE.boxes, boxes);
  renderBoxes(); renderAdminBoxes(); closeModals(); toast('Caja guardada');
});

/* ============ Admin: Clients ============ */
function renderAdminClients() {
  $('#adminClientList').innerHTML = clients.map(c => `
    <div class="admin-item">
      <div style="width:60px;height:60px;border-radius:50%;background:var(--grad-primary);display:grid;place-items:center;font-weight:700;font-size:20px;flex-shrink:0">
        ${escapeHtml((c.name || '?')[0].toUpperCase())}
      </div>
      <div class="info">
        <strong>${escapeHtml(c.name)}</strong>
        <small>
          <i class="fa-solid fa-phone"></i> ${escapeHtml(c.phone)}
          ${c.email ? ` · <i class="fa-solid fa-envelope"></i> ${escapeHtml(c.email)}` : ''}
          ${c.box ? ` · 📦 ${escapeHtml(c.box)}` : ''}
        </small>
        <small style="display:block;margin-top:4px">${escapeHtml(c.message || '')}</small>
        <small style="display:block;color:var(--muted);margin-top:4px">${new Date(c.date).toLocaleString()}</small>
      </div>
      <div class="actions">
        ${c.phone ? `<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(c.phone.replace(/\D/g,''))}" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
        <button class="btn btn-ghost btn-sm" data-delclient="${c.id}" style="color:var(--accent)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('') || `<p class="muted">No hay solicitudes todavía.</p>`;
  $('#statClients').textContent = clients.length;
}

/* ============ Export / Import ============ */
$('#exportBtn').addEventListener('click', () => {
  const data = JSON.stringify({ boxes, clients, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `unlockbox-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Backup descargado');
});
$('#importFile').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (data.boxes) { boxes = data.boxes; save(STORAGE.boxes, boxes); }
      if (data.clients) { clients = data.clients; save(STORAGE.clients, clients); }
      renderBoxes(); renderAdminBoxes(); renderAdminClients();
      toast('Datos importados');
    } catch { toast('Archivo inválido'); }
  };
  r.readAsText(file);
});

/* ============ Init ============ */
renderBoxes();
$('#statClients').textContent = clients.length;
$('#year').textContent = new Date().getFullYear();
