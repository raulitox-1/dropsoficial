const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

exports.sendPushOnNotif = onDocumentCreated(
  "users/{userId}/notificaciones/{notifId}",
  async (event) => {
    const notif = event.data?.data();
    if (!notif) return;
    if (!["sticky", "accion"].includes(notif.tipo)) return;

    const userId = event.params.userId;

    let pushToken = null;
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists && userDoc.data()?.pushToken) {
        pushToken = userDoc.data().pushToken;
      }
    } catch (e) {}

    if (!pushToken && notif.commId) {
      try {
        const commUserDoc = await db
          .collection("communities").doc(notif.commId)
          .collection("users").doc(userId).get();
        if (commUserDoc.exists && commUserDoc.data()?.pushToken) {
          pushToken = commUserDoc.data().pushToken;
        }
      } catch (e) {}
    }

    if (!pushToken) {
      console.log("No pushToken for user:", userId);
      return;
    }

    // Solo data, sin notification — así el SW controla el display
    // y no se duplica con el sistema interno de la app
    const message = {
      token: pushToken,
      data: {
        title: notif.text || "Drops Oficial",
        body: notif.sub || "",
        link: notif.link || "",
        tipo: notif.tipo || "info",
      },
      webpush: {
        fcmOptions: { link: "https://dropsoficial.com" },
      },
    };

    try {
      await getMessaging().send(message);
      console.log("✅ Push enviado a:", userId);
    } catch (e) {
      console.error("Error push:", e.message);
      if (
        e.code === "messaging/invalid-registration-token" ||
        e.code === "messaging/registration-token-not-registered"
      ) {
        await db.collection("users").doc(userId)
          .update({ pushToken: null }).catch(() => {});
      }
    }
  }
);
