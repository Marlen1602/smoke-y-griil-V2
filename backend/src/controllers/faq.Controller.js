import Preguntas from "../models/faq.js";

// 🔹 Obtener todas las preguntas frecuentes
export const getPreguntas = async (req, res) => {
  try {
    const preguntas = await Preguntas.findAll({ order: [["fecha", "DESC"]] });
    res.status(200).json(preguntas);
  } catch (error) {
    console.error("Error al obtener preguntas frecuentes:", error);
    res.status(500).json({ error: "Error al obtener preguntas frecuentes" });
  }
};

// 🔹 Crear una nueva pregunta frecuente
export const addPregunta = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;

    if (!pregunta || !respuesta) {
      return res.status(400).json({ error: "Se requieren pregunta y respuesta" });
    }

    const nuevaPregunta = await Preguntas.create({ pregunta, respuesta });
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    console.error("Error al agregar la pregunta frecuente:", error);
    res.status(500).json({ error: "Error al agregar la pregunta frecuente" });
  }
};

// 🔹 Eliminar una pregunta por ID
export const deletePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const pregunta = await Preguntas.findByPk(id);

    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    await pregunta.destroy();
    res.status(200).json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la pregunta frecuente:", error);
    res.status(500).json({ error: "Error al eliminar la pregunta frecuente" });
  }
};