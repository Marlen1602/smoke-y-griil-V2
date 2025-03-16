import { createLogger, format, transports } from "winston";
import Incidencia from "../models/incidencia.model.js"; // Importamos el modelo de incidencias

// Configuración de Winston
const logger = createLogger({
    level: "info", // Nivel de logs (info, warn, error)
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(), // Muestra los logs en la consola
        new transports.File({ filename: "logs/security.log" }) // Guarda logs en un archivo
    ]
});

// 📌 Función para registrar eventos en la base de datos
export const logSecurityEvent = async (usuario, tipo, estado, motivo) => {
    try {
        await Incidencia.create({
            usuario,
            tipo,
            estado,
            motivo,
            fecha: new Date(),
        });
    } catch (error) {
        console.error("Error al registrar incidencia en la BD:", error);
    }
};

export default logger;

