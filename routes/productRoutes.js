import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadLocal, uploadCloud } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);

// Admin CRUD
router.post("/", protectAdmin, (req, res, next) => {
  req.query.cloud === "true"
    ? uploadCloud.single("image")(req, res, next)
    : uploadLocal.single("image")(req, res, next);
}, createProduct);

router.put("/:id", protectAdmin, (req, res, next) => {
  req.query.cloud === "true"
    ? uploadCloud.single("image")(req, res, next)
    : uploadLocal.single("image")(req, res, next);
}, updateProduct);

router.delete("/:id", protectAdmin, deleteProduct);

export default router;
