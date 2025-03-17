import { sequelize } from "../db.js";
import { cloudinary } from "../libs/cloudinary.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [productos] = await sequelize.query(
      "SELECT * FROM productos ORDER BY ID_Producto DESC"
    );
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [producto] = await sequelize.query(
      "SELECT * FROM productos WHERE ID_Producto = ?",
      { replacements: [id] }
    );
    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;
  try {
    const [result] = await sequelize.query(
      "INSERT INTO productos (Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible) VALUES (?, ?, ?, ?, ?, ?)",
      { replacements: [Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio || null, Disponible] }
    );
    res.json({ message: "Producto creado correctamente", ID_Producto: result.insertId });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;
  try {
    await sequelize.query(
      "UPDATE productos SET Nombre = ?, Descripcion = ?, ID_Categoria = ?, TieneTamanos = ?, Precio = ?, Disponible = ? WHERE ID_Producto = ?",
      { replacements: [Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio || null, Disponible, id] }
    );
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query("DELETE FROM productos WHERE ID_Producto = ?", {
      replacements: [id],
    });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Subir imagen a Cloudinary y asociarla al producto
export const uploadImagen = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    await sequelize.query("UPDATE productos SET Imagen = ? WHERE ID_Producto = ?", {
      replacements: [result.secure_url, id],
    });
    res.json({ message: "Imagen subida correctamente", url: result.secure_url });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
