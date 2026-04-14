importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBoh-OnF_G4_N8YwhWHOAsqIOS1B1tzkkA",
  authDomain: "drops-oficial.firebaseapp.com",
  projectId: "drops-oficial",
  storageBucket: "drops-oficial.firebasestorage.app",
  messagingSenderId: "725158698993",
  appId: "1:725158698993:web:d7e1ecbb73bfcefc676e50"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || "Drops Oficial";
  const body = payload.notification?.body || "";
  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.PNG",
    badge: "/icon-192.PNG",
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:"window", includeUncontrolled:true}).then(function(list) {
      for(const client of list){
        if(client.url.includes("dropsoficial") && "focus" in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow("https://dropsoficial.com");
    })
  );
});
