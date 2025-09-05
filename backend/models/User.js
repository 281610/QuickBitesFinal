/*import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  contact: String,
});

export default mongoose.model("User", userSchema);
*/


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
 
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  contact: { type: String, required: true },

  // Buyer fields
  address: String,

  // Seller fields
  panNumber: String,
  aadhaarNumber: String,
  gstNumber: String,
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
  },
  shopPhoto: String,
});

export default mongoose.model("User", userSchema);
