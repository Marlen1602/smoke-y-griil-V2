import { Router } from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  uploadImagen,
} from "../controllers/producto.controller.js";
import multer from "multer";
import { storage } from "../libs/cloudinary.js";

const router = Router();
const upload = multer({ storage });

// 📌 Obtener todos los productos
router.get("/productos", getProductos);

// 📌 Obtener un producto por ID
router.get("/productos/:id", getProductoById);

// 📌 Crear un nuevo producto y subir imagen en la misma solicitud
router.post("/productos", upload.single("imagen"), createProducto);

// 📌 Actualizar un producto existente
router.put("/productos/:id", updateProducto);

// 📌 Eliminar un producto
router.delete("/productos/:id", deleteProducto);

// 📌 Subir imagen a Cloudinary
router.post("/productos/:id/upload", upload.single("imagen"), uploadImagen);

export default router;
