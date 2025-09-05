import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// ✅ Option 1: Use Gmail with App Password
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // your gmail
    pass: process.env.EMAIL_PASS,  // your Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ bypass certificate error (only for local dev)
  },
});
