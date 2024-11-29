import { Router } from "express";
import { getIncidencias } from "../controllers/incidencias.controller.js";

const router = Router();

router.get('/incidencias',  getIncidencias);
    
export default router;