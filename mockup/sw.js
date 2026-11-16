/* G-Star Freeze – minimaler Service Worker fürs Mockup.
   Speichert (noch) nichts zwischen – Offline-Betrieb kommt in Phase 2.
   Er ist nötig, damit iOS die App als vollwertige Web-App behandelt
   (Erlaubnis „Mitteilungen“ → rote Zahl am App-Symbol). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
