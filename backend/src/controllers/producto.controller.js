import { sequelize } from "../db.js";
import { cloudinary } from "../libs/cloudinary.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [productos] = await sequelize.query(
      "SELECT * FROM productos ORDER BY ID_Producto DESC"
    );
    res.json(productos);
  } catch (error) {
    logger.error("Error al obtener productos", { error: error.message });
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
      logger.warn("Producto no encontrado", { id });
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    logger.info("Producto consultado por ID", { id });
    res.json(producto[0]);
  } catch (error) {
    logger.error("Error al obtener producto por ID", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;
  const usuario = req.user?.username || "Anónimo";
  let imageUrl = null;

  try {
    // 🔹 Verificar si hay imagen en la solicitud y subirla a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;  // Guardamos la URL de Cloudinary
    }

     // 🔹 Convertir los valores booleanos a enteros (0 o 1)
     const tieneTamanosValue = TieneTamanos === "true" || TieneTamanos === true ? 1 : 0;
     const disponibleValue = Disponible === "true" || Disponible === true ? 1 : 0;
     

    // 🔹 Insertar producto en la base de datos con la URL de la imagen
    const [result] = await sequelize.query(
      "INSERT INTO productos (Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      { replacements: [Nombre, Descripcion, ID_Categoria, tieneTamanosValue, Precio || null, disponibleValue, imageUrl] }
    );
    logger.info("Producto creado correctamente", {
      usuario,
      productoId: result.insertId,
    });
    await logSecurityEvent(
      usuario,
      "Creación de producto",
      false,
      `Producto "${Nombre}" creado con ID ${result.insertId}`
    );

    res.json({ message: "Producto creado correctamente", ID_Producto: result.insertId, Imagen: imageUrl });
  } catch (error) {
    logger.error("Error al crear producto", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Subir imagen a Cloudinary y asociarla al producto
export const uploadImagen = async (req, res) => {
  const { id } = req.params;
  const usuario = req.user?.username || "Anónimo";
  try {
    if (!req.file) {
      logger.warn("Subida de imagen fallida: sin archivo", { usuario });
      return res.status(400).json({ message: "No se ha subido ninguna imagen" });
    }

    // 🔹 Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // 🔹 Guardar la URL en la base de datos
    await sequelize.query("UPDATE productos SET Imagen = ? WHERE ID_Producto = ?", {
      replacements: [result.secure_url, id],
    });
    logger.info("Imagen de producto actualizada", { usuario, productoId: id });

    res.json({ message: "Imagen subida correctamente", url: result.secure_url });
  } catch (error) {
    logger.error("Error al subir imagen de producto", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;

  const usuario = req.user?.username || "Anónimo";

  if (!Nombre || !Descripcion || !ID_Categoria || !Disponible) {
    logger.warn("Actualización fallida: faltan datos", { usuario });
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    await sequelize.query(
      "UPDATE productos SET Nombre = ?, Descripcion = ?, ID_Categoria = ?, TieneTamanos = ?, Precio = ?, Disponible = ? WHERE ID_Producto = ?",
      { replacements: [Nombre, Descripcion, ID_Categoria, TieneTamanos ? 1 : 0, Precio || null, Disponible ? 1 : 0, id] }
    );
    logger.info("Producto actualizado correctamente", { usuario, productoId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de producto",
      false,
      `Producto ID ${id} actualizado`
    );

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    logger.error("Error al actualizar producto", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// Eliminar un producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const usuario = req.user?.username || "Anónimo";
  try {
    await sequelize.query("DELETE FROM productos WHERE ID_Producto = ?", {
      replacements: [id],
    });
    logger.info("Producto eliminado", { usuario, productoId: id });

    await logSecurityEvent(
      usuario,
      "Eliminación de producto",
      true,
      `Producto ID ${id} eliminado`
    );
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar producto", { error: error.message });
    res.status(500).json({ message: "Error en el servidor" });
  }
};

