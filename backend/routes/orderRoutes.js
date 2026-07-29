import express from "express";
import { placeOrder, getBuyerOrders, getSellerOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder); // Buyer places order
router.get("/seller/:sellerId", getSellerOrders); // Seller orders
router.get("/:buyerId", getBuyerOrders); // Buyer order history

export default router;
