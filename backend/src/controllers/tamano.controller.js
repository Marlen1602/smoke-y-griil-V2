import { sequelize } from "../db.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener todos los tamaños
export const getTamanos = async (req, res) => {
  try {
    const [tamanos] = await sequelize.query("SELECT * FROM tamanosproductos ORDER BY ID_Tamaño DESC");
        res.json(tamanos);
  } catch (error) {
    logger.error("Error al obtener tamaños", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener un tamaño por ID
export const getTamanoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [tamano] = await sequelize.query("SELECT * FROM tamanosproductos WHERE ID_Tamaño = ?", {
      replacements: [id],
    });
    if (tamano.length === 0) {
      logger.warn("Tamaño no encontrado por ID", { id });
      return res.status(404).json({ message: "Tamaño no encontrado" });
    }
    logger.info("Tamaño consultado por ID", { id });
    res.json(tamano[0]);
  } catch (error) {
    logger.error("Error al obtener tamaño por ID", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Crear un nuevo tamaño
export const createTamano = async (req, res) => {
  const { ID_Producto, Nombre, Precio } = req.body;
  const usuario = req.user?.username || "Anónimo";
  try {
    const [result] = await sequelize.query(
      "INSERT INTO tamanosproductos (ID_Producto, Nombre, Precio) VALUES (?, ?, ?)",
      { replacements: [ID_Producto, Nombre, Precio] }
    );
    logger.info("Tamaño creado correctamente", {
      usuario,
      tamanoId: result.insertId,
      productoId: ID_Producto,
    });

    await logSecurityEvent(
      usuario,
      "Creación de tamaño",
      false,
      `Tamaño "${Nombre}" (Precio: ${Precio}) agregado al producto ID ${ID_Producto}`
    );
    res.json({ message: "Tamaño creado correctamente", ID_Tamaño: result.insertId });
  } catch (error) {
    logger.error("Error al crear tamaño", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar un tamaño
export const updateTamano = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Precio } = req.body;
  const usuario = req.user?.username || "Anónimo";
  try {
    await sequelize.query("UPDATE tamanosproductos SET Nombre = ?, Precio = ? WHERE ID_Tamaño = ?", {
      replacements: [Nombre, Precio, id],
    });
    logger.info("Tamaño actualizado", { usuario, tamanoId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de tamaño",
      false,
      `Tamaño ID ${id} actualizado a "${Nombre}" con precio ${Precio}`
    );
    res.json({ message: "Tamaño actualizado correctamente" });
  } catch (error) {
    logger.error("Error al actualizar tamaño", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar un tamaño
export const deleteTamano = async (req, res) => {
  const { id } = req.params;
  const usuario = req.user?.username || "Anónimo";
  try {
    await sequelize.query("DELETE FROM tamanosproductos WHERE ID_Tamaño = ?", {
      replacements: [id],
    });
    logger.info("Tamaño eliminado", { usuario, tamanoId: id });

    await logSecurityEvent(
      usuario,
      "Eliminación de tamaño",
      true,
      `Tamaño ID ${id} eliminado del sistema`
    );

    res.json({ message: "Tamaño eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar tamaño", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};
