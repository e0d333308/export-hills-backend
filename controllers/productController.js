import Product from "../models/Product.js";
import fs from "fs";

// 🧩 Safe JSON parser
const safeJSONParse = (value, fallback = []) => {
  try {
    if (typeof value === "string") return JSON.parse(value);
    return value || fallback;
  } catch {
    return fallback;
  }
};

// ➕ Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      description,
      bulletPoints,
      specifications,
      seoMeta,
      image,
    } = req.body;

    const product = new Product({
      name,
      categoryId,
      description,
      bulletPoints: safeJSONParse(bulletPoints, []),
      specifications: safeJSONParse(specifications, []),
      seoMeta: safeJSONParse(seoMeta, {}),
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created successfully", product });
  } catch (error) {
    console.error("❌ Product creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      description,
      bulletPoints,
      specifications,
      seoMeta,
      image,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name) product.name = name;
    if (categoryId) product.categoryId = categoryId;
    if (description) product.description = description;
    if (bulletPoints) product.bulletPoints = safeJSONParse(bulletPoints, []);
    if (specifications) product.specifications = safeJSONParse(specifications, []);
    if (seoMeta) product.seoMeta = safeJSONParse(seoMeta, {});

    // ✅ Handle image replacement
    if (req.file) {
      if (product.image && fs.existsSync(`.${product.image}`)) {
        fs.unlinkSync(`.${product.image}`);
      }
      product.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      product.image = image;
    }

    await product.save();
    res.json({ message: "✅ Product updated successfully", product });
  } catch (error) {
    console.error("❌ Product update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image && fs.existsSync(`.${product.image}`)) {
      fs.unlinkSync(`.${product.image}`);
    }

    await product.deleteOne();
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Product deletion error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
