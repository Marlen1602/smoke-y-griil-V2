import { Router } from "express";
import { getEmpresaProfile, updateEmpresaProfile } from "../controllers/empresa.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import multer from "multer";
import { storage } from "../libs/cloudinary.js";

const router = Router();
const upload = multer({ storage });

// Ruta para obtener el perfil de la empresa
router.get("/", authRequired, getEmpresaProfile);

// Ruta para actualizar el perfil de la empresa (incluye subir logo)
router.put("/:id", authRequired, upload.single("logo"), updateEmpresaProfile);

export default router;






