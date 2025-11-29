// UPDATED + FINAL PERFECT VERSION

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import fs from "fs";

const getImagePath = (req) => {
  if (req.file) {
    if (req.query.cloud === "true" && req.file.path) {
      return req.file.path; // Cloudinary URL
    }
    return `/uploads/${req.file.filename}`; // Local
  }
  return null;
};

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = new Category({
      name,
      description,
      image: getImagePath(req), // if no image, null
    });

    await category.save();
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("CATEGORY CREATE ERROR →", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat._id }).select(
          "name _id"
        );
        return { ...cat, products };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ categoryId: category._id }).select(
      "name _id"
    );

    res.json({ ...category, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CATEGORY (FINAL)
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update text fields
    if (name) category.name = name;
    if (description) category.description = description;

    // If a new file is uploaded → replace image
    if (req.file) {
      // Delete old local image if exists
      if (
        category.image &&
        category.image.startsWith("/uploads") &&
        fs.existsSync(`.${category.image}`)
      ) {
        fs.unlinkSync(`.${category.image}`);
      }

      category.image = getImagePath(req, category.image);
    }

    // DO NOT TOUCH IMAGE if no file uploaded
    // (remove your old "else if (req.body.image)" block)

    await category.save();

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.log("CATEGORY UPDATE ERROR →", error);
    res.status(500).json({
      message: "Error saving category",
      error: error.message,
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Delete local image
    if (
      category.image &&
      category.image.startsWith("/uploads") &&
      fs.existsSync(`.${category.image}`)
    ) {
      fs.unlinkSync(`.${category.image}`);
    }

    await Product.deleteMany({ categoryId: category._id });
    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
