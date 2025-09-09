// src/utils/pushNotifications.js

// Make sure your frontend .env has:
// VITE_BACKEND_URL=https://quickbitesfinal-2.onrender.com
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function subscribeUser() {
  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    console.warn("Push notifications not supported in this browser.");
    return;
  }

  try {
    // 1️⃣ Register Service Worker
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    console.log("✅ Service worker registered:", registration);

    // 2️⃣ Fetch VAPID public key from backend
    const res = await fetch(`${BACKEND_URL}/api/vapidPublicKey`);
    
    // Check if backend returned JSON
    if (!res.ok) throw new Error(`Failed to fetch VAPID key: ${res.status}`);
    
    const data = await res.json();
    const vapidPublicKey = data.publicKey;
    if (!vapidPublicKey) throw new Error("VAPID public key missing from backend");

    // 3️⃣ Subscribe user
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // 4️⃣ Send subscription to backend
    const subRes = await fetch(`${BACKEND_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    if (!subRes.ok) throw new Error("Failed to save subscription on backend");

    console.log("✅ User subscribed for push notifications!");
  } catch (err) {
    console.error("❌ Push subscription error:", err);
  }
}

// Helper: Base64 → Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Initialize push notifications (ask permission)
export async function initPush() {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("✅ Notification permission granted.");
    await subscribeUser();
  } else {
    console.warn("❌ Notification permission denied.");
  }
}
