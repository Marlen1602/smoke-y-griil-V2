import logger from "../libs/logger.js";

export const registrarErrorFrontend = async (req, res) => {
  const { message, source, lineno, colno, stack } = req.body;

  try {
    logger.error("Error desde el frontend", {
      message,
      source,
      lineno,
      colno,
      stack,
      fecha: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error al registrar error del frontend:", error);
    res.status(500).json({ message: "No se pudo guardar el error del frontend" });
  }
};
