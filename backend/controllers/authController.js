import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
import nodemailer from "nodemailer";



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
      email,
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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    console.log(`Generated OTP for ${email}: ${otp}`); // 🔎 dev log

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 👈 allow self-signed certs
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP - QuickBites",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (record && record.code === otp && record.expiresAt > Date.now()) {
      delete otpStore[email];

      const user = await User.findOne({ email });
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
