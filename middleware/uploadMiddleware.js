// middleware/uploadMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ===========================
// 🔹 1. LOCAL STORAGE
// ===========================
const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const clean = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + clean);
  },
});

// ===========================
// 🔹 2. CLOUDINARY STORAGE
// ===========================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "exportHills",
      resource_type: "image",
      format: "webp",
      public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
    };
  },
});

// ===========================
// 🔹 3. EXPORT FINAL UPLOADERS
// ===========================
export const uploadLocal = multer({
  storage: localStorage,
});

export const uploadCloud = multer({
  storage: cloudStorage,
});
