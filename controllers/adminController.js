// controllers/adminController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config(); // ✅

const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🟢 Register Admin (use manually once)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id);
    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Login Admin (safe & user-friendly)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🧩 Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    // 🔍 Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 🔑 Match password securely
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 🪪 Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🎯 Respond success
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { name: admin.name, email: admin.email },
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


// 🟢 Forgot Password (Send OTP)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otpCode = otp;
    admin.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await admin.save();

    await resend.emails.send({
      from: "ExportHills <sales@exporthillsglobal.com>",
      to: email,
      subject: "Your ExportHills Admin OTP Code",
      html: `
        <h3>Your OTP Code</h3>
        <p>Use this OTP to reset your password: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otpCode !== otp || admin.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified, clear it
    admin.otpCode = null;
    admin.otpExpiresAt = null;
    await admin.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Reset Password (after OTP)
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get Admin Dashboard Info (after login)
export const getAdminDashboard = async (req, res) => {
  try {
    res.json({
      message: "Welcome to Admin Dashboard",
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
