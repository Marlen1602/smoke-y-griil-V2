import express from "express";
import { 
  obtenerPlatillosMasVendidos, 
  obtenerZonasConMasEnvios, 
  obtenerIngresosPorDia,
  obtenerClientesFrecuentes,
 
} from '../controllers/reportes.controller.js';
import { authRequired } from "../middlewares/validateToken.js";
const router = express.Router();

router.get("/reportes/platillos-mas-vendidos",authRequired, obtenerPlatillosMasVendidos);
router.get("/reportes/zonas-mas-envios", authRequired, obtenerZonasConMasEnvios);
router.get("/reportes/ingresos-por-dia", authRequired, obtenerIngresosPorDia);
router.get("/reportes/clientes-frecuentes",authRequired, obtenerClientesFrecuentes);

export default router;
