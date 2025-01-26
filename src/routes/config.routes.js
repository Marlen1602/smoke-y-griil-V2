import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getConfig, updateConfig}from "../controllers/config.controller.js";

const router = Router();
router.get('/configuracion',  getConfig);

router.put('/configuracion/:id', authRequired, updateConfig);

export default router;