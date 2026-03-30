import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailer.js";
/*
export const registerUser = async (req, res) => {
  try {
    const { name, email, role, contact } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const user = new User({ name, email, role, contact });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};*/
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      contact,
      address,
      panNumber,
      aadhaarNumber,
      gstNumber,
    } = req.body;

    const normalizedEmail = (email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Handle flat bankDetails.*
    const bankDetails = {
      accountHolder: req.body["bankDetails.accountHolder"],
      accountNumber: req.body["bankDetails.accountNumber"],
      ifscCode: req.body["bankDetails.ifscCode"],
      upiId: req.body["bankDetails.upiId"],
    };

    if (role === "seller") {
      if (!panNumber || !aadhaarNumber || !bankDetails.accountNumber) {
        return res.status(400).json({ error: "Seller KYC details required" });
      }
    }

    const user = new User({
      name,
      email: normalizedEmail,
      role,
      contact,
      address,
      panNumber,
      aadhaarNumber,
      gstNumber,
      bankDetails,
      shopPhoto: req.file?.path || null,
    });

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Register Error:", err);
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const otpStore = {}; // { email: { code, expiresAt } }

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        error: "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in backend env.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: "User not found" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[normalizedEmail] = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    console.log(`Generated OTP for ${normalizedEmail}: ${otp}`); // 🔎 dev log

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Your Login OTP - QuickBites",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    if (err?.code === "EAUTH") {
      return res.status(500).json({ error: "OTP mail login failed. Check EMAIL_USER and Gmail App Password." });
    }
    if (err?.code === "ENOTFOUND" || err?.code === "ECONNECTION") {
      return res.status(500).json({ error: "Unable to connect to email server. Please try again." });
    }
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedOtp = (otp || "").trim();

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const record = otpStore[normalizedEmail];

    if (record && record.code === normalizedOtp && record.expiresAt > Date.now()) {
      delete otpStore[normalizedEmail];

      const user = await User.findOne({ email: normalizedEmail });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({ message: "Login successful", token, user });
    } else {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, contact, address } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined ? { name } : {}),
        ...(contact !== undefined ? { contact } : {}),
        ...(address !== undefined ? { address } : {}),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};
