/*import express from "express";
import multer from "multer";
import { addFood, getFoods, getSellerFoods } from "../controllers/foodController.js";

const router = express.Router();

// Configure multer
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("images", 5), addFood); // ✅ handle images
router.get("/", getFoods);
router.get("/:sellerId", getSellerFoods);
router.get("/seller/:sellerId", getSellerFoods); // move seller-specific under /seller/:id

export default router;
*/
/*import express from "express";
import multer from "multer";
import { addFood, getFoods, getSellerFoods, getFoodById,getFoodsNear } from "../controllers/foodController.js";

const router = express.Router();

// Configure multer
const upload = multer({ dest: "uploads/" });

// Add new food
router.post("/", upload.array("images", 5), addFood);

// Get all foods
router.get("/", getFoods);
/*
// ✅ Get single food by its ID
router.get("/:id", getFoodById);

// ✅ Get foods by seller
router.get("/food/:foodId", getSellerFoods);

router.get("/seller/:sellerId", getSellerFoods);

// ✅ Get single food by its ID
// routes/foodRoutes.js
router.get("/near", getFoodsNear);
router.get("/:id", getFoodById);

export default router;
*/
// routes/foodRoutes.js
import express from "express";
import multer from "multer";
import {
  addFood,
  getFoods,
  getSellerFoods,
  getFoodById,
  getFoodsNear
} from "../controllers/foodController.js";

const router = express.Router();

// store temporary files in "temp/" (will be removed after uploading to Cloudinary)
const upload = multer({ dest: "temp/" });

// Add new food
router.post("/", upload.array("images", 5), addFood);

// Get all foods
router.get("/", getFoods);

// Get foods near (latitude/longitude)
router.get("/near", getFoodsNear);

// Get foods by seller
/*router.get("/seller/:sellerId", getSellerFoods);

// Get single food by ID
router.get("/:id", getFoodById);
*/
router.get("/seller/:sellerId", getSellerFoods);
router.get("/:id", getFoodById);

export default router;
