self.addEventListener("push", event => {
    let data = {};
    if (event.data) {
      data = event.data.json();
    }
  
    const options = {
      body: data.body || "Check out new offers!",
      icon: data.icon || "/logo192.png", // small icon
      badge: "/badge.png",               // monochrome badge
      image: data.image || null,         // large banner
      vibrate: [200, 100, 200],          // vibration pattern
      actions: [
        { action: "open-app", title: "Open App" },
        { action: "view-offers", title: "View Offers" }
      ],
      data: {
        url: data.url || "/" // Fallback if no custom URL is provided
      }
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || "🍔 New Update!", options)
    );
  });
  
  self.addEventListener("notificationclick", event => {
    event.notification.close();
  
    if (event.action === "view-offers") {
      event.waitUntil(self.clients.openWindow("/offers"));
    } else {
      event.waitUntil(self.clients.openWindow(event.notification.data.url));
    }
  });
  