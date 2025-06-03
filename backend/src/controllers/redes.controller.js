import RedesSociales from "../models/redes.Model.js";
import logger, { logSecurityEvent } from "../libs/logger.js";
// Obtener todas las redes sociales
export const getRedesSociales = async (req, res) => {
  try {
    const redes = await RedesSociales.findAll();
      res.json(redes);
  } catch (error) {
    logger.error("Error al obtener redes sociales", { error: error.message });
    res.status(500).json({ message: "Error al obtener las redes sociales", error: error.message });
  }
};

// Crear una nueva red social
export const createRedSocial = async (req, res) => {
  try {
    const { nombre, link, ID_empresa } = req.body;
    const usuario = req.user?.username || "Anónimo";
    // Validar que los campos sean correctos
    if (!nombre || !link) {
      logger.warn("Creación fallida de red social: campos faltantes", { usuario });
      return res.status(400).json({ message: "El nombre y el link son obligatorios" });
    }

    const nuevaRed = await RedesSociales.create({
      nombre,
      link,
      ID_empresa: ID_empresa || 1, // Si no se envía ID_empresa, asignamos 1
    });
    logger.info("Red social creada", { usuario, redId: nuevaRed.id });

    await logSecurityEvent(
      usuario,
      "Creación de red social",
      false,
      `Se creó "${nombre}" con link ${link}`
    );
    res.status(201).json({ message: "Red social creada con éxito", data: nuevaRed });
  } catch (error) {
    logger.error("Error al crear red social", { error: error.message });
    res.status(500).json({ message: "Error al crear la red social", error: error.message });
  }
};

// Actualizar una red social por ID
export const updateRedSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, link } = req.body;
    const usuario = req.user?.username || "Anónimo";
    const red = await RedesSociales.findByPk(id);
    if (!red) {
      logger.warn("Intento de actualizar red social inexistente", { id, usuario });
      return res.status(404).json({ message: "Red social no encontrada" });
    }

    await red.update({ nombre, link });
    logger.info("Red social actualizada", { usuario, redId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de red social",
      false,
      `Red social ID ${id} actualizada a "${nombre}" (${link})`
    );

    res.json({ message: "Red social actualizada correctamente", data: red });
  } catch (error) {
    logger.error("Error al actualizar red social", { error: error.message });
    res.status(500).json({ message: "Error al actualizar la red social", error: error.message });
  }
};

// Eliminar una red social por ID
export const deleteRedSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.user?.username || "Anónimo";
    const red = await RedesSociales.findByPk(id);
    if (!red) {
      logger.warn("Intento de eliminar red social inexistente", { id, usuario });
      return res.status(404).json({ message: "Red social no encontrada" });
    }

    await red.destroy();
    logger.info("Red social eliminada", { usuario, redId: id });

    await logSecurityEvent(
      usuario,
      "Eliminación de red social",
      true,
      `Red social ID ${id} eliminada`
    );

    res.json({ message: "Red social eliminada correctamente" });
  } catch (error) {
    logger.error("Error al eliminar red social", { error: error.message });
    res.status(500).json({ message: "Error al eliminar la red social", error: error.message });
  }
};
