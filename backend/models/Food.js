/*import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["veg", "non-veg"], required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  location: String,
  contact: String,
}, { timestamps: true });

export default mongoose.model("Food", foodSchema);
*/
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["veg", "non-veg"], required: true },
    description: String,
    images: [String],
    price: { type: Number, required: true },
    contact: String,

    // 🟢 Change location from String → GeoJSON Point
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// 🟢 Create index for geospatial queries
foodSchema.index({ location: "2dsphere" });

export default mongoose.model("Food", foodSchema);
