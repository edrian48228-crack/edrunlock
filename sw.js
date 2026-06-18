const CACHE = 'unlockbox-v13';

// Al instalar: limpiar TODO cache viejo inmediatamente
self.addEventListener('install', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Estrategia: Network-first para HTML/CSS/JS, cache para imágenes/iconos
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  const isStatic = /\.(png|jpg|jpeg|svg|ico|woff2?)$/.test(url);

  if (isStatic) {
    // cache-first para imágenes
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  } else {
    // network-first para todo lo demás (HTML, CSS, JS)
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
