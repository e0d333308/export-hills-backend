import Product from "../models/Product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      description,
      bulletPoints,
      specifications, // ✅ new field
      seoMeta,
      image,
    } = req.body;

    const product = new Product({
      name,
      categoryId,
      description,
      bulletPoints: bulletPoints || [], // ✅ take array directly
      specifications: specifications || [], // ✅ take array directly
      seoMeta,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
