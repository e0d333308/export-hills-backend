import multer from "multer";
import path from "path";
import fs from "fs";

// 🟢 Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🟡 Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // 🧹 Fix spaces & unsafe characters in filenames
    const cleanName = file.originalname.replace(/\s+/g, "_"); // "PVC Granunels.webp" → "PVC_Granunels.webp"
    const uniqueName = `${Date.now()}-${cleanName}`;
    cb(null, uniqueName);
  },
});

// ✅ Allow only image types (JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only JPEG, PNG, WEBP are allowed."), false);
};

// 🚀 Final multer setup
const upload = multer({ storage, fileFilter });

export default upload;
