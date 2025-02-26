import Incidencia from '../models/incidencia.model.js';

// Obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    // Buscar todas las incidencias sin filtrar por eliminación
    const incidencias = await Incidencia.findAll();

    // Verificar si no se encontraron incidencias
    if (!incidencias || incidencias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron incidencias.' });
    }

    // Responder con las incidencias encontradas
    res.status(200).json(incidencias);
  } catch (error) {
    // En caso de error, responder con un mensaje de error detallado
    console.error(error); // Puedes quitar esto en producción
    res.status(500).json({ message: 'Error al obtener las incidencias', error: error.message });
  }
};
