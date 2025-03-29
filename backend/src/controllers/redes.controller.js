import RedesSociales from "../models/redes.Model.js";

// Obtener todas las redes sociales
export const getRedesSociales = async (req, res) => {
  try {
    const redes = await RedesSociales.findAll();
    res.json(redes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las redes sociales", error: error.message });
  }
};

// Crear una nueva red social
export const createRedSocial = async (req, res) => {
  try {
    const { nombre, link, ID_empresa } = req.body;

    // Validar que los campos sean correctos
    if (!nombre || !link) {
      return res.status(400).json({ message: "El nombre y el link son obligatorios" });
    }

    const nuevaRed = await RedesSociales.create({
      nombre,
      link,
      ID_empresa: ID_empresa || 1, // Si no se envía ID_empresa, asignamos 1
    });

    res.status(201).json({ message: "Red social creada con éxito", data: nuevaRed });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la red social", error: error.message });
  }
};

// Actualizar una red social por ID
export const updateRedSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, link } = req.body;

    const red = await RedesSociales.findByPk(id);
    if (!red) {
      return res.status(404).json({ message: "Red social no encontrada" });
    }

    await red.update({ nombre, link });

    res.json({ message: "Red social actualizada correctamente", data: red });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la red social", error: error.message });
  }
};

// Eliminar una red social por ID
export const deleteRedSocial = async (req, res) => {
  try {
    const { id } = req.params;

    const red = await RedesSociales.findByPk(id);
    if (!red) {
      return res.status(404).json({ message: "Red social no encontrada" });
    }

    await red.destroy();
    res.json({ message: "Red social eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la red social", error: error.message });
  }
};
