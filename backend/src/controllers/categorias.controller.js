import Categorias from "../models/categorias.model.js"; // Asegúrate de que la ruta sea correcta

// 🔹 Obtener todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categorias.findAll({ order: [["ID_Categoria", "ASC"]] });
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// 🔹 Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
      const categoria = await Categorias.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Crear una nueva categoría
  export const createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
      if (!nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }
  
      const nuevaCategoria = await Categorias.create({ nombre });
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Actualizar una categoría existente
  export const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
  
    try {
      const categoria = await Categorias.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      categoria.nombre = nombre || categoria.nombre;
      await categoria.save();
  
      res.json({ message: "Categoría actualizada correctamente", categoria });
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  // 🔹 Eliminar una categoría
  export const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
      const categoria = await Categorias.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      await categoria.destroy();
      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };