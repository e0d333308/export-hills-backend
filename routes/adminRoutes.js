// routes/adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  sendOtp,
  verifyOtp,
  resetPassword,
  getAdminDashboard,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // optional — one-time setup
router.post("/login", loginAdmin);
router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/dashboard", protectAdmin, getAdminDashboard);

export default router;
