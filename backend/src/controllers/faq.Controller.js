import prisma from "../db.js";
import logger from "../libs/logger.js";

// 🔹 Obtener todas las preguntas frecuentes
export const getPreguntas = async (req, res) => {
  try {
    const preguntas = await prisma.preguntas.findMany({ 
      orderBy: {
      fecha: 'desc',
      },
    });
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

    const nuevaPregunta = await prisma.preguntas.create({ 
      data: {
        pregunta,
        respuesta,
        fecha: new Date(),
      },
    });
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
    const pregunta = await prisma.preguntas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pregunta) {
      logger.warn("Intento de eliminar pregunta inexistente", { id, usuario });
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

     await prisma.preguntas.delete({
      where: { id: parseInt(id) },
    });
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