const CACHE_NAME = 'drops-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Para push notifications, delegar a firebase-messaging-sw.js
self.addEventListener('fetch', event => {
  // Solo cachear recursos estáticos básicos
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || event.request.url.includes('firebase')) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
