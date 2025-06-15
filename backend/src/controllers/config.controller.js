import prisma from "../db.js";
import logger from "../libs/logger.js";

// 🔹 Obtener configuración actual
export const getConfig = async (req, res) => {
  try {
    const config = await prisma.configs.findFirst();

    if (!config) {
      logger.warn("No se encontró configuración en la base de datos");
      return res.status(404).json({ message: "No se encontró configuración" });
    }

    res.json({
      maxAttempts: config.maxAttempts,
      lockDuration: config.lockDuration
    });
  } catch (error) {
    logger.error("Error al obtener configuración", {
      modulo: "config.controller.js",
      error: error.message
    });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 🔹 Actualizar o crear configuración
export const updateConfig = async (req, res) => {
  const { maxAttempts, lockDuration } = req.body;

  try {
    let config = await prisma.configs.findFirst();

    if (config) {
      // Actualizar si ya existe
      config = await prisma.configs.update({
        where: { id: config.id },
        data: { maxAttempts, lockDuration }
      });
      logger.info("Configuración actualizada", {
        modulo: "config.controller.js",
        config
      });
    } else {
      // Crear si no existe
      config = await prisma.configs.create({
        data: { maxAttempts, lockDuration }
      });
      logger.info("Configuración creada", {
        modulo: "config.controller.js",
        config
      });
    }

    res.json(config);
  } catch (error) {
    logger.error("Error al actualizar configuración", {
      modulo: "config.controller.js",
      error: error.message
    });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

