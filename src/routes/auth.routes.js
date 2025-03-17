import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { login,register,logout,profile,validateRegister,unlockUser,blockUser} from "../controllers/auth.controller.js";
import {authRequired} from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
import {verifyEmail} from "../controllers/emailVerification.controller.js";
import { getUserByEmail, updatePassword,getUsers } from "../controllers/users.controller.js";
import { sendCodeForReset, verifyCode } from "../controllers/codeVerification.controller.js";


const router = Router();

// Middleware para validar campos y evitar inyecciones
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rate limiting para evitar ataques de fuerza bruta en login y reset password
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos por usuario (NO por IP)
    keyGenerator: (req) => req.body.email || req.ip, // Se basa en el email, no en la IP
    message: "Demasiados intentos fallidos en esta cuenta. Intenta más tarde."
    
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 3, // Máximo 3 intentos por IP
    message: "Demasiadas solicitudes de recuperación de contraseña. Intenta más tarde."
});

// Rutas de autenticación con validaciones
router.post(
    "/register",
    (req, res, next) => {
        console.log("Datos recibidos en /register:", req.body); // Verificar datos enviados
        next();
    },
    validateSchema(registerSchema),
    validateRegister,
    register
);

router.post(
    "/login",
    loginLimiter,
    validateSchema(loginSchema),
    login
);

router.post("/verify-email", verifyEmail);
router.post("/logout", authRequired, logout);
router.get("/profile", authRequired, profile);

// Bloqueo y desbloqueo de usuarios con validación de ID
router.put(
    "/unlock/:id",
    param("id").isUUID().withMessage("El ID debe ser un UUID válido"),
    validarCampos,
    unlockUser
);

router.put(
    "/block/:id",
    param("id").isUUID().withMessage("El ID debe ser un UUID válido"),
    validarCampos,
    blockUser
);

// Verificación de autenticación
router.get("/authenticated", authRequired, (req, res) => {
    res.json({ message: "Authenticated" });
});

// Manejo de usuarios con validación de email
router.get(
    "/users/:email",
    param("email").isEmail().withMessage("Debe ser un correo válido"),
    validarCampos,
    getUserByEmail
);

// Recuperación de contraseña con rate limiting
router.post(
    "/email-reset-password",
    resetPasswordLimiter,
    sendCodeForReset
);

router.post("/verify-code-password", verifyCode);
router.put("/update-password", updatePassword);

// Listado de usuarios (solo para administradores, aplicar middleware si es necesario)
router.get("/usuarios", authRequired, getUsers);

export default router;
