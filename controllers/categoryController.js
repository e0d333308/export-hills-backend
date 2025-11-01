// controllers/categoryController.js
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import fs from "fs";

// ➕ Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({
      name,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get All Categories (with Products)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat._id }).select("name _id");
        return { ...cat, products };
      })
    );

    res.json(categoriesWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Single Category by ID (with Products)
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

// ✏️ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) category.name = name;
    if (description) category.description = description;

    if (req.file) {
      if (category.image && fs.existsSync(`.${category.image}`)) {
        fs.unlinkSync(`.${category.image}`);
      }
      category.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      category.image = image;
    }

    await category.save();
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (category.image && fs.existsSync(`.${category.image}`)) {
      fs.unlinkSync(`.${category.image}`);
    }

    await Product.deleteMany({ categoryId: category._id });
    await category.deleteOne();

    res.json({ message: "Category and its products deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
