const CACHE_NAME = "drops-v2";

self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(clients.claim()); });

// Manejar notificaciones push directas
self.addEventListener("push", function(event) {
  let data = { title: "Drops Oficial", body: "" };
  try { data = event.data.json(); } catch(e) {
    try { data.body = event.data.text(); } catch(e2) {}
  }
  const options = {
    body: data.body || data.notification?.body || "",
    icon: "/icon-192.PNG",
    badge: "/icon-192.PNG",
    vibrate: [200, 100, 200],
    data: data.data || {},
    requireInteraction: true
  };
  event.waitUntil(
    self.registration.showNotification(data.title || data.notification?.title || "Drops Oficial", options)
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url.includes("dropsoficial") && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("https://dropsoficial.com");
    })
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("firestore") || event.request.url.includes("firebase")) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
