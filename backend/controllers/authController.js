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
      email: email.toLowerCase(),
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

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: "User not found" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    console.log(`Generated OTP for ${normalizedEmail}: ${otp}`); // 🔎 dev log

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
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
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (!user.otp || !user.otpExpires) return res.status(400).json({ error: "No OTP requested for this user" });
    
    if (user.otpExpires < new Date()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ error: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
