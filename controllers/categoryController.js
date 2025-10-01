import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = new Category({
      name,
      description,
      // If file uploaded → use it. Else if JSON image path given → use that.
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Categories (with products)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    // Attach products to each category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat._id }).select("name _id");
        return {
          ...cat,
          products,
        };
      })
    );

    res.json(categoriesWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Category by ID (with products)
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ categoryId: category._id }).select("name _id");
    res.json({ ...category, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
