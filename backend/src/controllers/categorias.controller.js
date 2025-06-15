import prisma from "../db.js"; // Asegúrate de que la ruta sea correcta
import logger, { logSecurityEvent } from "../libs/logger.js";

// 🔹 Obtener todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany({ orderBy: {ID_Categoria:"asc"},});
    res.json(categorias);
  } catch (error) {
    logger.error("Error al obtener las categorías", { modulo: "categorias.controller.js", error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// 🔹 Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
      const categoria = await prisma.categorias.findUnique({
        where:{ID_Categoria:parseInt(id),}
      });
      if (!categoria) {
        logger.warn(`Categoría con ID ${id} no encontrada`, { modulo: "categorias.controller.js" });
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      logger.error(`Error al obtener categoría con ID ${id}`, { modulo: "categorias.controller.js", error: error.message });
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Crear una nueva categoría
  export const createCategoria = async (req, res) => {
    const { nombre } = req.body;
    const usuario = req.user?.username || "Anónimo";
    try {
      if (!nombre) {
        logger.warn("Intento fallido de crear categoría sin nombre", { modulo: "categorias.controller.js", usuario });

        await logSecurityEvent(
          usuario,
          "Intento fallido creación categoría",
          true,
          "Campo nombre vacío"
        );
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }
      const nuevaCategoria = await prisma.categorias.create({ 
        data:{Nombre: nombre },});
      logger.info("Categoría creada exitosamente", { modulo: "categorias.controller.js", usuario, categoriaId: nuevaCategoria.ID_Categoria, });

      await logSecurityEvent(
        usuario,
        "Creación de categoría",
        false,
        `Categoría "${nombre}" creada con ID: ${nuevaCategoria.ID_Categoria}`
      );

      res.status(201).json(nuevaCategoria);

    } catch (error) {
      logger.error("Error al crear categoría", { modulo: "categorias.controller.js", error: error.message });
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Actualizar una categoría existente
  export const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const usuario = req.user?.username || "Anónimo";
    try {
      const categoria = await prisma.categorias.findUnique({
        where:{ID_Categoria:parseInt(id)},
      });
      if (!categoria) {
        logger.warn(`Intento de actualizar categoría inexistente (ID: ${id})`, { modulo: "categorias.controller.js", usuario });

      await logSecurityEvent(
        usuario,
        "Intento fallido actualización categoría",
        true,
        `Categoría ID ${id} no encontrada`
      );
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      const categoriaActualizada = await prisma.categorias.update({
      where: { ID_Categoria: parseInt(id) },
      data: { Nombre: nombre },
    });

      logger.info("Categoría actualizada exitosamente", { modulo: "categorias.controller.js", usuario, categoriaId: id });

      await logSecurityEvent(
        usuario,
        "Actualización de categoría",
        false,
        `Categoría ID ${id} actualizada de "${categoria.Nombre}" a "${nombre}"`
      );
  
      res.json({ message: "Categoría actualizada correctamente", categoriaActualizada });
    } catch (error) {
      logger.error("Error al actualizar categoría", { modulo: "categorias.controller.js", error: error.message });
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Eliminar una categoría
  export const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    const usuario = req.user?.username || "Anónimo";
    try {
      const categoria = await prisma.categorias.findUnique({
        where:{ID_Categoria:parseInt(id)},
      });
      if (!categoria) {
        logger.warn(`Intento de eliminar categoría inexistente (ID: ${id})`, { modulo: "categorias.controller.js", usuario });

      await logSecurityEvent(
        usuario,
        "Intento fallido eliminación categoría",
        true,
        `Categoría ID ${id} no encontrada`
      );
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      await prisma.categorias.delete({
        where:{ID_Categoria:parseInt(id)},
        });
      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      logger.error("Error al eliminar categoría", { modulo: "categorias.controller.js", error: error.message });
      res.status(500).json({ message: "Error en el servidor" });
    }
  };