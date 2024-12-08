import Config from "../models/config.model.js";

// Obtener la configuración actual
export const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada." });
    }
    return res.status(200).json(config);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Actualizar la configuración
export const updateConfig = async (req, res) => {
  const { maxAttempts, lockDuration } = req.body;

  try {
    const config = await Config.findOneAndUpdate(
      {},
      { maxAttempts, lockDuration },
      { new: true, upsert: true } // Crear el documento si no existe
    );

    return res.status(200).json({
      message: "Configuración actualizada correctamente.",
      config,
    });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
