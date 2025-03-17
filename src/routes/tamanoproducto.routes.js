import { Router } from "express";
import {
  getTamanos,
  getTamanoById,
  createTamano,
  updateTamano,
  deleteTamano,
} from "../controllers/tamano.controller.js";
import { authRequired  } from "../middlewares/validateToken.js";

const router = Router();

// 📌 Obtener todos los tamaños
router.get("/tamanos", getTamanos);

// 📌 Obtener un tamaño por ID
router.get("/tamanos/:id", getTamanoById);

// 📌 Crear un nuevo tamaño
router.post("/tamanos", authRequired , createTamano);

// 📌 Actualizar un tamaño existente
router.put("/tamanos/:id", authRequired , updateTamano);

// 📌 Eliminar un tamaño
router.delete("/tamanos/:id", authRequired , deleteTamano);

export default router;
