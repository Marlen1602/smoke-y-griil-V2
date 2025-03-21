import { Router } from "express";
import {
  getRedesSociales,
  createRedSocial,
  updateRedSocial,
  deleteRedSocial,
} from "../controllers/redes.controller.js";
import { authRequired, adminRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/redes_sociales",authRequired, getRedesSociales); // Obtener todas las redes
router.post("/redes_sociales", authRequired, adminRequired,createRedSocial); // Crear una red social
router.put("/redes_sociales/:id",authRequired, adminRequired, updateRedSocial); // Actualizar una red social
router.delete("/redes_sociales/:id", authRequired, adminRequired, deleteRedSocial); // Eliminar una red social

export default router;
