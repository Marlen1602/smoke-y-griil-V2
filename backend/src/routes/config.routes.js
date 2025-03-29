import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getConfig, updateConfig } from "../controllers/config.controller.js";
import { param, body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const router = Router();

// Middleware para manejar errores de validación
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Protección con autenticación para evitar accesos no autorizados
router.get("/configuracion", authRequired, async (req, res, next) => {
    try {
        const config = await getConfig();
        res.json(config);
    } catch (error) {
        console.error("Error obteniendo configuración:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Limitar intentos de actualización de configuración para evitar abusos
const updateConfigLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 5, // Máximo 5 solicitudes por IP
    message: "Demasiadas solicitudes de actualización. Intenta más tarde."
});

// Validación y actualización de configuración
router.put(
    "/configuracion/:id",
    authRequired,
    updateConfigLimiter,
    [
        param("id").isUUID().withMessage("El ID debe ser un UUID válido"),
        body("key").isString().notEmpty().withMessage("La clave de configuración es obligatoria"),
        body("value").notEmpty().withMessage("El valor de configuración es obligatorio"),
        validarCampos,
    ],
    async (req, res, next) => {
        try {
            const result = await updateConfig(req.params.id, req.body);
            res.json({ message: "Configuración actualizada", result });
        } catch (error) {
            console.error("Error actualizando configuración:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

export default router;
