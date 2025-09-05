import express from "express";
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
