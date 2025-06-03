import Preguntas from "../models/faq.js";
import logger from "../libs/logger.js";

// 🔹 Obtener todas las preguntas frecuentes
export const getPreguntas = async (req, res) => {
  try {
    const preguntas = await Preguntas.findAll({ order: [["fecha", "DESC"]] });
    res.status(200).json(preguntas);
  } catch (error) {
    logger.error("Error al obtener preguntas frecuentes", {
      error: error.message,
      modulo: "faq.controller.js",
    });
    res.status(500).json({ error: "Error al obtener preguntas frecuentes" });
  }
};

// 🔹 Crear una nueva pregunta frecuente
export const addPregunta = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;
    const usuario = req.user?.username || "Anónimo";
    if (!pregunta || !respuesta) {
      logger.warn("Intento fallido de agregar pregunta frecuente (campos vacíos)", { usuario });
      return res.status(400).json({ error: "Se requieren pregunta y respuesta" });
    }

    const nuevaPregunta = await Preguntas.create({ pregunta, respuesta });
    logger.info("Pregunta frecuente agregada correctamente", {
      usuario,
      preguntaId: nuevaPregunta.id,
    });
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    logger.error("Error al agregar pregunta frecuente", {
      error: error.message,
      modulo: "faq.controller.js",
    });
      res.status(500).json({ error: "Error al agregar la pregunta frecuente" });
  }
};

// 🔹 Eliminar una pregunta por ID
export const deletePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.user?.username || "Anónimo";
    const pregunta = await Preguntas.findByPk(id);

    if (!pregunta) {
      logger.warn("Intento de eliminar pregunta inexistente", { id, usuario });
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    await pregunta.destroy();
    logger.info("Pregunta frecuente eliminada correctamente", {
      preguntaId: id,
      usuario,
    });
    res.status(200).json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    logger.error("Error al eliminar pregunta frecuente", {
      error: error.message,
      modulo: "faq.controller.js",
    });
    res.status(500).json({ error: "Error al eliminar la pregunta frecuente" });
  }
};