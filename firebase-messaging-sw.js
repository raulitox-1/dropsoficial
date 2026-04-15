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

// Notificaciones en background (app cerrada o en segundo plano)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Mensaje background recibido:', payload);
  const { title, body } = payload.notification || {};
  const link = payload.data?.link || '';

  self.registration.showNotification(title || 'Drops Oficial', {
    body: body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { link },
    requireInteraction: payload.data?.tipo === 'sticky'
  });
});

// Al pulsar la notificación — navegar al sitio correcto
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '';
  const url = 'https://dropsoficial.com';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si la app ya está abierta, enviarle el link y enfocarla
      for (const client of clientList) {
        if (client.url.includes('dropsoficial.com') && 'focus' in client) {
          client.focus();
          if (link) {
            client.postMessage({ type: 'NOTIF_CLICK', link });
          }
          return;
        }
      }
      // Si no está abierta, abrirla y guardar el link en la URL como param
      const openUrl = link ? `${url}?notif_link=${encodeURIComponent(link)}` : url;
      return clients.openWindow(openUrl);
    })
  );
});
