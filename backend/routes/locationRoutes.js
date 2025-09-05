// routes/locationRoutes.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /api/location/reverse?lat=..&lng=..
router.get("/reverse", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "homemade-food-app" } } // required by Nominatim
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Reverse geocode error:", err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

export default router;
