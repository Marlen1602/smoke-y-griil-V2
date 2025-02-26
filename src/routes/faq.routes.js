import express from "express";
import { getPreguntas, addPregunta, deletePregunta } from "../controllers/faq.Controller.js";

const router = express.Router();

// Rutas para Preguntas Frecuentes (FAQ)
router.get("/preguntas", getPreguntas); // Obtener todas las preguntas
router.post("/preguntas", addPregunta); // Agregar nueva pregunta
router.delete("/preguntas/:id", deletePregunta); // Eliminar pregunta por ID

export default router;
