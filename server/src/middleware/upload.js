// import dotenv from "dotenv";
// dotenv.config();

// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let folder = "docs";
//     if (file.mimetype.startsWith("image")) folder = "images";
//     else if (file.mimetype.startsWith("video")) folder = "videos";

//     return {
//       folder,
//       public_id: `${Date.now()}-${file.originalname}`,
//     };
//   },
// });

// export const upload = multer({ storage });


import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "docs";
    let resource_type = "raw";

    if (file.mimetype.startsWith("image")) {
      folder = "images";
      resource_type = "image";
    } 
    else if (file.mimetype.startsWith("video")) {
      folder = "videos";
      resource_type = "video";
    }

    return {
      folder,
      resource_type, // 🔥 MOST IMPORTANT
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

export const upload = multer({ storage });
