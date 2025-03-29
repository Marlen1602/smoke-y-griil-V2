import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: "dbvbgueus", // nombre de Cloudinary
  api_key: process.env.api_key,       //  API Key de Cloudinary
  api_secret: process.env.api_secret, //API Secret de Cloudinary

});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smokey-grill", // Carpeta de Cloudinary
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

export { cloudinary, storage };

