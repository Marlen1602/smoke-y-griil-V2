import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getPoliticas,
    getPolitica,
    createPolitica,
    updatePolitica,
    deletePolitica
} from "../controllers/politicas.controller.js";

    const router = Router()

router.get('/politicas',authRequired,getPoliticas);
router.get('/politicas/:id',authRequired,getPolitica);
router.post('/politicas',authRequired,createPolitica);
router.delete('/politicas/:id',authRequired,deletePolitica);
router.put('/politicas/:id',authRequired,updatePolitica);

export default router;