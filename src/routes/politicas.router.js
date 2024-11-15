import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getPoliticas,
    getPolitica,
    createPolitica,
    updatePolitica,
    deletePolitica
} from "../controllers/politicas.controller.js";
import { createPoliticaschema } from "../schemas/politicas.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

    const router = Router()

router.get('/politicas',authRequired,getPoliticas);

router.post('/politicas',authRequired,validateSchema(createPoliticaschema), createPolitica);

router.get('/politicas/:id',authRequired,getPolitica);

router.put('/politicas/:id',authRequired,updatePolitica);

router.delete('/politicas/:id',authRequired,deletePolitica);

export default router;