importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBoh-OnF_G4_N8YwhWHOAsqIOS1B1tzkkA",
  authDomain: "drops-oficial.firebaseapp.com",
  projectId: "drops-oficial",
  storageBucket: "drops-oficial.appspot.com",
  messagingSenderId: "725158698993",
  appId: "1:725158698993:web:d7e1ecbb73bfcefc676e50"
});

const messaging = firebase.messaging();

// Recibir mensaje en background — construir notificación desde data
// (no usamos payload.notification para evitar que Firebase muestre una por su cuenta)
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || 'Drops Oficial';
  const body = data.body || '';
  const link = data.link || '';
  const tipo = data.tipo || 'info';

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { link },
    requireInteraction: tipo === 'sticky',
    tag: data.notifId || 'drops-notif-' + Date.now(),
  });
});

// Al pulsar la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '';
  const url = 'https://dropsoficial.com';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('dropsoficial.com') && 'focus' in client) {
          client.focus();
          if (link) client.postMessage({ type: 'NOTIF_CLICK', link });
          return;
        }
      }
      const openUrl = link ? `${url}?notif_link=${encodeURIComponent(link)}` : url;
      return clients.openWindow(openUrl);
    })
  );
});
