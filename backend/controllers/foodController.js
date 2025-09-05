import Food from "../models/Food.js";
/*
export const addFood = async (req, res) => {
    try {
      console.log("📩 Incoming Food Data:", req.body);
      const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const food = new Food({
        seller: req.body.seller,
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        images, // ✅ now stores relative path like /uploads/12345.png
        price: req.body.price,
        location: req.body.location,
        contact: req.body.contact,
      });
      
      await food.save();
      res.json(food);
    } catch (err) {
      console.error("❌ Error adding food:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  */

  // controllers/foodController.js
export const addFood = async (req, res) => {
  try {
    console.log("📩 Incoming Food Data:", req.body);
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Expect lat & lng from frontend form
    const { lat, lng } = req.body;

    const food = new Food({
      seller: req.body.seller,
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      images,
      price: req.body.price,
      contact: req.body.contact,

      // ✅ GeoJSON format
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    await food.save();
    res.json(food);
  } catch (err) {
    console.error("❌ Error adding food:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("seller", "name email");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getSellerFoods = async (req, res) => {
  try {
    const foods = await Food.find({ seller: req.params.sellerId });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getFoodById = async (req, res) => {
    try {
      console.log("👉 Fetching food by ID:", req.params.id);
      const food = await Food.findById(req.params.id);
  
      if (!food) {
        console.log("❌ Food not found for ID:", req.params.id);
        return res.status(404).json({ error: "Food not found" });
      }
  
      res.json(food);
    } catch (err) {
      console.error("❌ getFoodById error:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  }

 // controllers/foodController.js
export const getFoodsNear = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // maxDistance in meters
    if (!lat || !lng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const foods = await Food.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance), // e.g., 5000m = 5km
        },
      },
    }).populate("seller", "name email");

    res.json(foods);
  } catch (err) {
    console.error("❌ Nearby food error:", err.message);
    res.status(500).json({ error: "Server error fetching nearby foods" });
  }
};
 