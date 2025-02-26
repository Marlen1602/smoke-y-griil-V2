import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import User from '../models/user.model.js';

export const authRequired = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "No token, authentication denied" });
    }

    try {
        const user = jwt.verify(token, TOKEN_SECRET);

        if (!user) {
            return res.status(401).json({ message: "Invalid token, authentication denied" });
        }

        // Buscar al usuario en la base de datos
        const userDb = await User.findByPk(user.id);

        if (!userDb) {
            return res.status(401).json({ message: "Invalid token, authentication denied" });
        }

        if (!userDb.isVerified) {
            return res.status(401).json({ message: "User not verified", isVerified: userDb.isVerified });
        }

        // Adjuntar la información del usuario al objeto de solicitud (req.user)
        req.user = {
            id: userDb.id,
            username: userDb.username,
            nombre: userDb.nombre,
            apellidos: userDb.apellidos,
            email: userDb.email,
            createAt: userDb.createdAt,
            updatedAt: userDb.updatedAt,
            iat: user.iat,
            exp: user.exp,
        };

        // Continuar con el siguiente middleware o controlador
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ message: "Invalid token, authentication denied" });
    }
};
