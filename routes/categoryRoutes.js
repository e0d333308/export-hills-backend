import express from "express";
import multer from "multer";
import {
  createCategory,
  getCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
