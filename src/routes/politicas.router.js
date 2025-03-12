import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getPoliticas,
    getPolitica,
    createPolitica,
    updatePolitica,
    deletePolitica,
    getPolicyHistory
} from "../controllers/politicas.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPoliticaschema } from "../schemas/politicas.schema.js";

const router = Router();

router.get("/politicas",  getPoliticas);
router.post("/politicas", authRequired, validateSchema(createPoliticaschema), createPolitica);
router.get("/politicas/:id", authRequired, getPolitica);
router.put("/politicas/:id", authRequired, updatePolitica);
router.delete("/politicas/:id", authRequired, deletePolitica);

// Nueva ruta para obtener historial
router.get("/politicas/:id/history", authRequired, getPolicyHistory);

export default router;
