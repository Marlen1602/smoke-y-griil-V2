import prisma from "../db.js";
import logger from "../libs/logger.js";

// Obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    const incidencias = await prisma.incidencias.findMany({
    orderBy: { fecha: 'desc' },
    });

    if (!incidencias || incidencias.length === 0) {
      return res.status(404).json({ message: "No se encontraron incidencias." });
    }

    res.status(200).json(incidencias);
  } catch (error) {
    logger.error("Error en getIncidencias", {
      error: error.message,
      modulo: "incidencias.controller.js",
    });
    res.status(500).json({ message: "Error al obtener las incidencias", error: error.message });
  }
};
