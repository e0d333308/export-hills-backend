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

// ---------------------------
// ✅ Proper CORS Configuration
// ---------------------------
app.use(cors({
  origin: [
    "https://exporthillsglobal.com", // your frontend (cPanel)
    "http://localhost:5173"          // optional: local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors());

// ---------------------------
// ✅ Middleware
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// ✅ File Serving (Static)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "./public/uploads")));

// ---------------------------
// ✅ Routes
// ---------------------------
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

// ---------------------------
// ✅ Server Start
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
