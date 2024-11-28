import { Router } from "express";
import {
  getDeslindeLegal,
  createDeslindeLegal,
  updateDeslindeLegal,
  deleteDeslindeLegal,
  getDeslindeLegalHistory
} from "../controllers/deslindeLegal.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/deslindeLegal", authRequired, getDeslindeLegal);
router.post("/deslindeLegal", authRequired, createDeslindeLegal);
router.put("/deslindeLegal/:id", authRequired, updateDeslindeLegal);
router.delete("/deslindeLegal/:id", authRequired, deleteDeslindeLegal);
router.get("/deslindeLegal/history/:id", authRequired, getDeslindeLegalHistory);

export default router;

