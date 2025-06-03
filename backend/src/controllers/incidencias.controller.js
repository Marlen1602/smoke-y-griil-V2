import Incidencia from "../models/incidencia.model.js";

// Obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll();

    if (!incidencias || incidencias.length === 0) {
      return res.status(404).json({ message: "No se encontraron incidencias." });
    }

    res.status(200).json(incidencias);
  } catch (error) {
    logger.error("Error en getIncidencias:", error); // Más detalles del error
    res.status(500).json({ message: "Error al obtener las incidencias", error: error.message });
  }
};
