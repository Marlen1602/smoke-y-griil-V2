import { Router } from "express";
import { getIncidencias } from "../controllers/incidencias.controller.js";
import rateLimit from "express-rate-limit";
import { authRequired, adminRequired } from "../middlewares/validateToken.js";

const router = Router();

// Middleware para limitar solicitudes y prevenir ataques DDoS
const incidenciaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // Máximo 50 solicitudes por IP
    message: "Demasiadas solicitudes, intenta más tarde.",
});

// Rutas protegidas
router.get("/incidencias",authRequired, adminRequired , incidenciaLimiter, getIncidencias);

export default router;

