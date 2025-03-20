import { Router } from "express";
import { getEmpresaProfile, updateEmpresaProfile } from "../controllers/empresa.controller.js";
import multer from "multer";
import { storage } from "../libs/cloudinary.js";

const router = Router();
const upload = multer({ storage });

// Ruta para obtener el perfil de la empresa
router.get("/", getEmpresaProfile);

// Ruta para actualizar el perfil de la empresa (permite subir logo opcionalmente)
router.put("/:id", upload.single("logo"), async (req, res, next) => {
  try {
    // Si se sube una imagen, se agrega al request para ser procesada en el controlador
    req.body.logo = req.file ? req.file.path : undefined;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error al procesar la imagen", error: error.message });
  }
}, updateEmpresaProfile);

export default router;



