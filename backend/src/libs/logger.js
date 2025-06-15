import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import prisma from "../db.js";

// Formato para archivo
const fileLogFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const extra = Object.keys(meta).length ? JSON.stringify(meta) : "";
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${extra}`;
    })    
  );
  
  // Formato para consola
  const consoleLogFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  );
  
  //Logger principal
  const logger = createLogger({
    level: "info",
    transports: [
      // Consola con colores
      new transports.Console({ format: consoleLogFormat }),
  
      // Archivo diario 
      new DailyRotateFile({
        filename: "logs/%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: false,
        maxSize: "20m",
        maxFiles: "14d",
        auditFile: './Audit/.disabled-audit-log.json',
        format: fileLogFormat,
      }),
    ],
  });
  
  
//Función para registrar eventos en la base de datos
export const logSecurityEvent = async (usuario, tipo, estado, motivo) => {
    try {
      await prisma.incidencia.create({
      data: {
        usuario,
        tipo,
        estado,
        motivo,
        fecha: new Date(),
      },
    });
    } catch (error) {
        console.error("Error al registrar incidencia en la BD:", error);
    }
};
export default logger;

