import { Router } from "express";
import { login,register,logout,profile,validateRegister} from "../controllers/auth.controller.js";
import {authRequired} from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
import {verifyEmail} from "../controllers/emailVerification.controller.js"
const router = Router();

router.post("/register",validateSchema(registerSchema) ,validateRegister,register);

router.post("/login", validateSchema(loginSchema), login);

router.post("/verify-email", verifyEmail);

router.post("/logout",logout);

router.get("/profile", authRequired, profile);




export default router