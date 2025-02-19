import { Router } from "express";
import {
  getAllMenuItems,
  getMenuItemsByCategory,
  createMenuItem,
  deleteMenuItem,
  searchMenuItems
} from "../controllers/menuController.js";

const router = Router();

// Obtener todos los elementos del menú
router.get("/", getAllMenuItems);

// Ruta para buscar elementos del menú
router.get("/search", searchMenuItems);

// Obtener elementos por categoría
router.get("/:category", getMenuItemsByCategory);

// Crear un nuevo elemento del menú
router.post("/", createMenuItem);

// Eliminar un elemento del menú
router.delete("/:id", deleteMenuItem);



export default router; // Exportación por defecto

