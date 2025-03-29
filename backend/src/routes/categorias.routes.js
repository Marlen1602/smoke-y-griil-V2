import { Router } from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categorias.controller.js";

const router = Router();

// 📌 Rutas de categorías
router.get("/categorias", getCategorias);           // Obtener todas las categorías
router.get("/categorias/:id", getCategoriaById);    // Obtener una categoría por ID
router.post("/categorias", createCategoria);        // Crear una nueva categoría
router.put("/categorias/:id", updateCategoria);     // Actualizar una categoría
router.delete("/categorias/:id", deleteCategoria);  // Eliminar una categoría

export default router;