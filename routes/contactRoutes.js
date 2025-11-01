import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User side (no auth)
router.post("/", sendMessage);

// ✅ Admin side (protected)
router.get("/", protectAdmin, getMessages);
router.delete("/:id", protectAdmin, deleteMessage);

export default router;
