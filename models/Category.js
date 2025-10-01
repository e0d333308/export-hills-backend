import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String }, // <-- Added field
    image: { type: String }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
