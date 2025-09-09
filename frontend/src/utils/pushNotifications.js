const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function subscribeUser() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register("/service-worker.js");

    // get VAPID public key from backend
    const res = await fetch(`${BACKEND_URL}/api/vapidPublicKey`);
    const data = await res.json();
    const vapidPublicKey = data.publicKey;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // send subscription to backend
    await fetch(`${BACKEND_URL}/api/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ User subscribed for push notifications!");
  }
}

// helper to convert base64 → Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function initPush() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      subscribeUser();
    } else {
      console.warn("❌ Notification permission denied.");
    }
  }
}
