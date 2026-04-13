importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBoh-OnF_G4_N8YwhWHOAsqIOS1B1tzkkA",
  authDomain: "drops-oficial.firebaseapp.com",
  projectId: "drops-oficial",
  storageBucket: "drops-oficial.firebasestorage.app",
  appId: "1:725158698993:web:d7e1ecbb73bfcefc676e50",
  messagingSenderId: "725158698993"
});

const messaging = firebase.messaging();

// Mostrar notificación cuando la app está en segundo plano
messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '🎯 Drops Oficial', {
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Ver' }
    ]
  });
});

// Al hacer click en la notificación, abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('dropsoficial') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
