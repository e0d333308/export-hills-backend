import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --------------------------------------
// ✅ CORS CONFIGURATION (WORKS WITH FRONTEND)
// --------------------------------------
app.use(
  cors({
    origin: [
      "https://exporthillsglobal.com",
      "https://www.exporthillsglobal.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// --------------------------------------
// ✅ MIDDLEWARE
// --------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------
// ✅ STATIC FILES (SERVE UPLOADS PUBLICLY)
// --------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists (important for Render)
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve uploads publicly (for image access)
app.use("/uploads", express.static(uploadsDir));

// --------------------------------------
// ✅ ROUTES
// --------------------------------------
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// --------------------------------------
// ✅ TEST ROUTE
// --------------------------------------
app.get("/api/status", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Backend active and running 🚀" });
});

// --------------------------------------
// ✅ START SERVER
// --------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} and ready for uploads!`)
);
