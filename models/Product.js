import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    bulletPoints: [{ type: String }], // highlights
    specifications: [{ type: String }], // ✅ new field
    seoMeta: {
      title: { type: String },
      description: { type: String },
    },
    image: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
