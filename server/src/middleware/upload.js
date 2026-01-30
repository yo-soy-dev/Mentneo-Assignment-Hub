import multer from "multer";
import fs from "fs";
import path from "path";

const baseUpload = path.join(process.cwd(), "server", "uploads");

const dirs = ["docs", "images", "videos"];

dirs.forEach((dir) => {
  const fullPath = path.join(baseUpload, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, path.join(baseUpload, "images"));
    else if (file.mimetype.startsWith("video")) cb(null, path.join(baseUpload, "videos"));
    else cb(null, path.join(baseUpload, "docs"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
