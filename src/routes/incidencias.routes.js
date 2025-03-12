import { Router } from "express";
import { getIncidencias } from "../controllers/incidencias.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Middleware para limitar solicitudes y prevenir ataques DDoS
const incidenciaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // Máximo 50 solicitudes por IP
    message: "Demasiadas solicitudes, intenta más tarde.",
});

// Rutas protegidas
router.get("/incidencias", authRequired, incidenciaLimiter, async (req, res, next) => {
    try {
        const incidencias = await getIncidencias();
        res.json(incidencias);
    } catch (error) {
        console.error("Error obteniendo incidencias:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
