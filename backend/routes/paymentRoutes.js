/*import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create order API
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res.status(500).send("Error creating order");
  }
});

// ✅ Verify payment signature API (optional but recommended)
router.post("/verify", (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(order_id + "|" + payment_id);
    const digest = shasum.digest("hex");

    if (digest === signature) {
      return res.json({ status: "success" });
    } else {
      return res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).send("Verification failed");
  }
});

export default router;
*/
// routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Food from "../models/Food.js"; // ✅ Food model

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create order
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res.status(500).send("Error creating order");
  }
});

// ✅ Verify + delete multiple foods
router.post("/verify", async (req, res) => {
  try {
    const { order_id, payment_id, signature, foodIds } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(order_id + "|" + payment_id);
    const digest = shasum.digest("hex");

    if (digest === signature) {
      // 🟢 Delete all purchased food items
      await Food.deleteMany({ _id: { $in: foodIds } });

      return res.json({ status: "success", message: "Payment verified & foods deleted" });
    } else {
      return res.status(400).json({ status: "failed", message: "Invalid signature" });
    }
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).send("Verification failed");
  }
});

export default router;
