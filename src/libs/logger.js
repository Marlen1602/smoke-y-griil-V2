import winston from "winston";
import path from "path";
import fs from "fs";

// Asegurar que la carpeta de logs exista
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuración de winston para guardar logs en un archivo
const logger = winston.createLogger({
  level: "error", // Solo guardará errores
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "errors.log") })
  ]
});

export default logger;
