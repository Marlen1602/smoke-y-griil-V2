import { Router } from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  uploadImagen,
} from "../controllers/producto.controller.js";
import { authRequired  } from "../middlewares/validateToken.js";
import multer from "multer";
import { storage } from "../libs/cloudinary.js";

const router = Router();
const upload = multer({ storage });

// 📌 Obtener todos los productos
router.get("/productos", getProductos);

// 📌 Obtener un producto por ID
router.get("/productos/:id", getProductoById);

// 📌 Crear un nuevo producto
router.post("/productos", authRequired , createProducto);

// 📌 Actualizar un producto existente
router.put("/productos/:id", authRequired , updateProducto);

// 📌 Eliminar un producto
router.delete("/productos/:id", authRequired , deleteProducto);

// 📌 Subir imagen a Cloudinary
router.post("/productos/:id/upload", authRequired , upload.single("imagen"), uploadImagen);

export default router;
