import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Import

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin CRUD
router.post("/", protectAdmin, upload.single("image"), createCategory);
router.put("/:id", protectAdmin, upload.single("image"), updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
