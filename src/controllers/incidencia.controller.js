import Incidencia from "../models/incidencia.model.js";
import ConfiguracionBloqueo from "../models/bloqueo.model.js";
import PreguntaSecreta from "../models/preguntasecreta.model.js";

// Crear Incidencia
export const crearIncidencia = async (req, res) => {
  try {
    const incidencia = new Incidencia(req.body);
    const nuevaIncidencia = await incidencia.save();
    res.status(201).json(nuevaIncidencia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Configuración de Bloqueo
export const configurarBloqueo = async (req, res) => {
  try {
    const configuracion = await ConfiguracionBloqueo.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json(configuracion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD de Preguntas Secretas
export const agregarPreguntaSecreta = async (req, res) => {
  try {
    const pregunta = new PreguntaSecreta(req.body);
    const nuevaPregunta = await pregunta.save();
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
