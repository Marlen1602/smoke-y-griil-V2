import express from "express";
import { registrarErrorFrontend } from "../controllers/log.controller.js";

const router = express.Router();

router.post("/log-error", registrarErrorFrontend);

export default router;
