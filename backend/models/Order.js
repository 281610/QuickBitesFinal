import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
