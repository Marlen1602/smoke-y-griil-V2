import { Router } from "express";
import {
  getRedesSociales,
  createRedSocial,
  updateRedSocial,
  deleteRedSocial,
} from "../controllers/redes.controller.js";

const router = Router();

router.get("/redes_sociales", getRedesSociales); // Obtener todas las redes
router.post("/redes_sociales", createRedSocial); // Crear una red social
router.put("/redes_sociales/:id", updateRedSocial); // Actualizar una red social
router.delete("/redes_sociales/:id", deleteRedSocial); // Eliminar una red social

export default router;
