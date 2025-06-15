import prisma from "../db.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener todos los tamaños
export const getTamanos = async (req, res) => {
  try {
    const tamanos = await prisma.tamanosproductos.findMany({
      orderBy: {
        ID_Tama_o: 'desc'
      }
    });
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
    const tamano = await prisma.tamanosproductos.findUnique({
      where: { ID_Tama_o: parseInt(id) }
    });
    if (!tamano) {
      logger.warn("Tamaño no encontrado por ID", { id });
      return res.status(404).json({ message: "Tamaño no encontrado" });
    }
    logger.info("Tamaño consultado por ID", { id });
    res.json(tamano);
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
     const nuevoTamano = await prisma.tamanosproductos.create({
      data: {
        ID_Producto: parseInt(ID_Producto),
        Tama_o: Nombre, // Mapeado desde `Tamaño`
        Precio: parseFloat(Precio),
      },
    });
    logger.info("Tamaño creado correctamente", {
      usuario,
      tamanoId: nuevoTamano.ID_Tama_o,
      productoId: ID_Producto,
    });

    await logSecurityEvent(
      usuario,
      "Creación de tamaño",
      false,
      `Tamaño "${Nombre}" (Precio: ${Precio}) agregado al producto ID ${ID_Producto}`
    );
    res.json({ message: "Tamaño creado correctamente", ID_Tamaño: nuevoTamano.ID_Tama_o });
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
   const tamanoActualizado = await prisma.tamanosproductos.update({
      where: { ID_Tama_o: parseInt(id) },
      data: {
        Tama_o: Nombre, // Campo mapeado de "Tamaño"
        Precio: parseFloat(Precio),
      },
    });
    logger.info("Tamaño actualizado", { usuario, tamanoId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de tamaño",
      false,
      `Tamaño ID ${id} actualizado a "${Nombre}" con precio ${Precio}`
    );
    res.json({ message: "Tamaño actualizado correctamente",data: tamanoActualizado });
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
    // Verificar si existe antes de eliminar
    const tamano = await prisma.tamanosproductos.findUnique({
      where: { ID_Tama_o: parseInt(id) }
    });
    if (!tamano) {
      logger.warn("Intento de eliminar tamaño inexistente", { id, usuario });
      return res.status(404).json({ message: "Tamaño no encontrado" });
    }
     // Eliminar tamaño
    await prisma.tamanosproductos.delete({
      where: { ID_Tama_o: parseInt(id) }
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
