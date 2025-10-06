import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --------------------------------------
// ✅ CORS CONFIGURATION (WORKS WITH FRONTEND)
// --------------------------------------
app.use(cors({
  origin: "https://exporthillsglobal.com",  // your live frontend domain
  credentials: true,                        // allow cookies/auth headers if needed
}));

// --------------------------------------
// ✅ MIDDLEWARE
// --------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------
// ✅ STATIC FILES (IMAGES, UPLOADS, ETC.)
// --------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "./public/uploads")));

// --------------------------------------
// ✅ ROUTES
// --------------------------------------
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);


app.get("/api/status", (req, res) => {
  res.status(200).json({ success: true, message: "Backend active and running 🚀" });
});

// --------------------------------------
// ✅ SERVER START
// --------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
