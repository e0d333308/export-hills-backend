import express from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
} from "../controllers/productController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);


export default router;
