import { Router } from "express";
import {
  getTamanos,
  getTamanoById,
  createTamano,
  updateTamano,
  deleteTamano,
} from "../controllers/tamano.controller.js";

const router = Router();

// 📌 Obtener todos los tamaños
router.get("/tamanos",getTamanos);

// 📌 Obtener un tamaño por ID
router.get("/tamanos/:id",getTamanoById);

// 📌 Crear un nuevo tamaño
router.post("/tamanos",createTamano);

// 📌 Actualizar un tamaño existente
router.put("/tamanos/:id",updateTamano);

// 📌 Eliminar un tamaño
router.delete("/tamanos/:id",deleteTamano);

export default router;
