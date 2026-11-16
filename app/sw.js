/* G-Star Freeze – Service Worker („Hintergrund-Helfer“)
   Aufgabe: Programmdateien auf dem iPhone zwischenspeichern, damit die App
   komplett offline läuft. Inventardaten liegen NICHT hier, sondern in IndexedDB.

   WICHTIG bei jedem Update: VERSION erhöhen (gleich wie APP_VERSION in index.html).
   Nur dann holt sich das iPhone die neuen Dateien. */
const VERSION = '1.1.0';
const CACHE = 'gsf-app-' + VERSION;
const SHELL = ['./', 'index.html', 'manifest.webmanifest'];            // Pflicht
const EXTRA = ['../assets/icon/apple-touch-icon.png', '../assets/icon/icon-512.png']; // schön, aber optional

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL).then(() => Promise.all(EXTRA.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('gsf-app-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Zuerst aus dem Zwischenspeicher, sonst aus dem Netz (und dann merken).
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(resp => {
      if (resp.ok && resp.type === 'basic') {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(r, copy));
      }
      return resp;
    }).catch(() => r.mode === 'navigate' ? caches.match('./') : Response.error()))
  );
});
