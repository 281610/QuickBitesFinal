import express from "express";
import { placeOrder, getBuyerOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder); // Buyer places order
router.get("/:buyerId", getBuyerOrders); // Buyer order history

export default router;
