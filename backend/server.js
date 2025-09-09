/*import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import paymentRoutes from "./routes/paymentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config();


app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/reverse-geocode", async (req, res) => {
    const { lat, lon } = req.query;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error("❌ Reverse geocode error:", err);
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });
  
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
*/
// server.js
/*import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// keep static route if you still have some pre-existing images in /uploads (optional)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webpush from "web-push";

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/payment", paymentRoutes);

// reverse geocode route etc (keep your existing handlers)...

const PORT = process.env.PORT || 5000;
export const sendNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "🍕 Hot Deal Just For You!",
        body: "Flat 30% off on your next pizza order 🍕🔥",
        icon: "https://yourcdn.com/icons/pizza.png",
        image: "https://yourcdn.com/banners/pizza-offer.jpg",
        url: "/offers/pizza"
      })
    );
  } catch (err) {
    console.error("Push error:", err);
  }
};
// Configure web-push
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscriptions = []; // store in DB ideally

// Save subscription from frontend
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Send notification to all subscribers
app.post("/api/notify", async (req, res) => {
  const payload = JSON.stringify({ title: "New Food Available!", body: "Check out the latest food item 🚀" });
  
  try {
    for (let sub of subscriptions) {
      await webpush.sendNotification(sub, payload);
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: err.message });
  }
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
*/
// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/payment", paymentRoutes);

// ---------------- WEB-PUSH CONFIG ----------------
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// In-memory storage for now (use MongoDB in real project)
let subscriptions = [];

// ✅ Route: frontend fetches public VAPID key
app.get("/api/vapidPublicKey", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// ✅ Route: save new subscription
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved ✅" });
});

// ✅ Route: send test notification
app.post("/api/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "🍔 New Food Available!",
    body: "Check out the latest food item 🚀",
    icon: "https://yourcdn.com/icons/burger.png",
    image: "https://yourcdn.com/banners/food-offer.jpg",
    url: "/"
  });

  try {
    await Promise.all(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );
    res.json({ success: true, message: "Notification sent ✅" });
  } catch (err) {
    console.error("❌ Push error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DB + SERVER START ----------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
