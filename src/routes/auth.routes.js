import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    login,
    register,
    logout,
    profile,
    unlockUser,
    blockUser
} from "../controllers/auth.controller.js";
import { getUsers, updatePassword } from "../controllers/users.controller.js"
import { authRequired, adminRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { sendCodeForReset, verifyCode } from "../controllers/codeVerification.controller.js";


const router = Router();

// 📌 Protección contra ataques de fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    keyGenerator: (req) => req.body.email || req.ip,
    message: "Demasiados intentos fallidos en esta cuenta. Intenta más tarde."
});

// Rutas de autenticación
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", loginLimiter, validateSchema(loginSchema), login);
router.post("/logout", authRequired, logout);
router.get("/profile", authRequired, profile);

//  Ruta para enviar código de verificación al email
router.post("/send-code-for-reset", sendCodeForReset);
//  Ruta para verificar el código ingresado por el usuario
router.post("/verify-code-password", verifyCode);
//  Ruta para actualizar la contraseña después de la verificación
router.put("/update-password", updatePassword);


//  Solo administradores pueden gestionar usuarios
router.get("/usuarios", authRequired, adminRequired, getUsers);
router.put("/unlock/:id", authRequired, adminRequired, unlockUser);
router.put("/block/:id", authRequired, adminRequired, blockUser);

export default router;
