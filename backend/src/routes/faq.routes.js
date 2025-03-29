import express from "express";
import { getPreguntas, addPregunta, deletePregunta } from "../controllers/faq.Controller.js";
import { body, param, validationResult } from "express-validator";
import { authRequired } from "../middlewares/validateToken.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Middleware para manejar validaciones
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rate limiting para evitar abuso en las solicitudes
const faqLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 20, // Máximo 20 solicitudes por IP
    message: "Demasiadas solicitudes. Intenta más tarde."
});

// Obtener todas las preguntas (público)router.get("/preguntas", getPreguntas);
router.get("/preguntas", getPreguntas);


// Agregar nueva pregunta (requiere autenticación y validación)
router.post(
    "/preguntas",
    authRequired,
    faqLimiter,
    [
        body("pregunta").isString().notEmpty().withMessage("La pregunta es obligatoria"),
        body("respuesta").isString().notEmpty().withMessage("La respuesta es obligatoria"),
        validarCampos,
    ],
    async (req, res, next) => {
        try {
            const pregunta = await addPregunta(req.body);
            res.status(201).json({ message: "Pregunta agregada", pregunta });
        } catch (error) {
            console.error("Error agregando pregunta:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

// Eliminar pregunta por ID (requiere autenticación y validación)
router.delete(
    "/preguntas/:id",
    authRequired,
    faqLimiter,
    [
        param("id").isUUID().withMessage("El ID debe ser un UUID válido"),
        validarCampos,
    ],
    async (req, res, next) => {
        try {
            await deletePregunta(req.params.id);
            res.json({ message: "Pregunta eliminada correctamente" });
        } catch (error) {
            console.error("Error eliminando pregunta:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

export default router;
