import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import prisma from "../db.js";

// Middleware para verificar token y autenticación
export const authRequired = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, authentication denied" });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const user = await await prisma.users.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid token, authentication denied" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "User not verified", isVerified: user.isVerified });
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            rol: user.tipoUsuarioId, // Verificamos tipoUsuarioId para roles
        };

        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.clearCookie("token"); // 🔹 Borra el token si es inválido
        return res.status(401).json({ message: "Invalid token, authentication denied" });
    }
};

// 📌 Middleware para restringir acceso solo a administradores
export const adminRequired = async (req, res, next) => {
    if (!req.user || req.user.rol !== 1) {  // 🔹 1 = Admin en tipoUsuarioId
        return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next();
};
