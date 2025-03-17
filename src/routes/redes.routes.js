import { Router } from "express";
import {
  getRedesSociales,
  createRedSocial,
  updateRedSocial,
  deleteRedSocial,
} from "../controllers/redes.controller.js";

const router = Router();

router.get("/", getRedesSociales); // Obtener todas las redes
router.post("/", createRedSocial); // Crear una red social
router.put("/:id", updateRedSocial); // Actualizar una red social
router.delete("/:id", deleteRedSocial); // Eliminar una red social

export default router;
