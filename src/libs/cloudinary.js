import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: 'dbvbgueus', // nombre de Cloudinary
  api_key: '374619935212288',       //  API Key de Cloudinary
  api_secret: 'Ba3cxa6aOvFb6BdkN_xF3OuLhyM', //API Secret de Cloudinary

});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smokey-grill", // Cambia esto por el nombre de tu carpeta en Cloudinary
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

export { cloudinary, storage };

