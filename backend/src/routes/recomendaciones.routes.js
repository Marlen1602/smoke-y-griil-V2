import { Router } from "express";
import { getRecomendacionesPorProducto } from "../services/recomendacion.service.js";

const router = Router();

// Ruta POST para obtener recomendaciones
router.post("/recomendaciones", async (req, res) => {
  const { producto } = req.body;

  if (!producto) {
    return res.status(400).json({ error: "Producto requerido" });
  }

  try {
    const resultados = await getRecomendacionesPorProducto(producto, 5);
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
});

export default router;
