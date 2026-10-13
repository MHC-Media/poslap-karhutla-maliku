/* Service Worker - Poslap Karhutla Kecamatan Maliku
   - Cangkang aplikasi (HTML/JS/ikon) disimpan agar aplikasi terbuka cepat & tetap terbuka saat offline.
   - Data titik panas / laporan (Google Apps Script) TIDAK PERNAH di-cache: data karhutla harus selalu terkini.
   - Pustaka CDN & font: stale-while-revalidate. */
const VERSION = 'poslap-maliku-v4';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const SHELL_FILES = ['./', 'index.html', 'config.js', 'pwa.js', 'offline.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon.svg'];
const CDN_HOSTS = ['unpkg.com', 'cdnjs.cloudflare.com', 'cdn.tailwindcss.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const NEVER_CACHE = ['script.google.com', 'script.googleusercontent.com', 'api.open-meteo.com', 'air-quality-api.open-meteo.com',
  'api.bmkg.go.id', 'gibs.earthdata.nasa.gov', 'drive.google.com', 'lh3.googleusercontent.com', 'api.whatsapp.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NEVER_CACHE.includes(url.hostname)) return; // langsung ke jaringan

  // Halaman: jaringan dulu, cadangan cache, lalu halaman offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(SHELL).then((c) => c.put('index.html', copy)); return res; })
        .catch(() => caches.match('index.html').then((r) => r || caches.match('offline.html')))
    );
    return;
  }

  // File sendiri (config.js, pwa.js, ikon): jaringan dulu supaya perubahan config langsung terpakai.
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(SHELL).then((c) => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Pustaka CDN & font: stale-while-revalidate.
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(RUNTIME).then((cache) => cache.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
  // Selain itu (tile peta, dll.): biarkan browser menangani.
});
