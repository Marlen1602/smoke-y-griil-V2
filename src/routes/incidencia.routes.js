import express from "express";
import {
  crearIncidencia,
  configurarBloqueo,
  agregarPreguntaSecreta,
} from "../controllers/incidencia.controller.js";

const router = express.Router();

// Rutas de incidencias
router.post("/incidencias", crearIncidencia);

// Configuración de bloqueo
router.put("/configuracion-bloqueo/:id", configurarBloqueo);

// Preguntas Secretas
router.post("/preguntas-secretas", agregarPreguntaSecreta);

export default router;

