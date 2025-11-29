import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadLocal, uploadCloud } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ⭐ FIXED CLOUD / LOCAL SWITCH
const selectUploader = (req, res, next) => {
  const cloudFlag = String(req.query.cloud || "")
    .trim()
    .toLowerCase();

  const isCloud = cloudFlag === "true";

  const uploader = isCloud
    ? uploadCloud.single("image")
    : uploadLocal.single("image");

  uploader(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// PUBLIC ROUTES
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// ADMIN-PROTECTED ROUTES
router.post("/", protectAdmin, selectUploader, createCategory);
router.put("/:id", protectAdmin, selectUploader, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
