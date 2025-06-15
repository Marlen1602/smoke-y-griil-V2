import prisma from "../db.js";
import { cloudinary } from "../libs/cloudinary.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      orderBy: { ID_Producto: 'desc' }
    });
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
    const producto = await prisma.productos.findUnique({
      where: { ID_Producto: parseInt(id) }
    });

    if (!producto) {
      logger.warn("Producto no encontrado", { id });
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    logger.info("Producto consultado por ID", { id });
    res.json(producto);
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
    const nuevoProducto = await prisma.productos.create({
      data: {
        Nombre,
        Descripcion,
        ID_Categoria: parseInt(ID_Categoria),
        TieneTamanos: tieneTamanosValue,
        Precio: Precio !== undefined && Precio !== "" ? parseFloat(Precio) : null,
        Disponible: disponibleValue,
        Imagen: imageUrl,
      },
    });
    logger.info("Producto creado correctamente", {
      usuario,
      productoId: nuevoProducto.ID_Producto,
    });
    await logSecurityEvent(
      usuario,
      "Creación de producto",
      false,
      `Producto "${Nombre}" creado con ID ${nuevoProducto.ID_Producto}`
    );

    res.json({ message: "Producto creado correctamente", ID_Producto: nuevoProducto.ID_Producto, Imagen: imageUrl });
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
     // 🔹 Actualizar campo Imagen del producto
    const productoActualizado = await prisma.productos.update({
      where: { ID_Producto: parseInt(id) },
      data: { Imagen: result.secure_url },
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

  if (Nombre == null || Descripcion == null || ID_Categoria == null) {
    logger.warn("Actualización fallida: faltan datos", { usuario });
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    await prisma.productos.update({
      where: { ID_Producto: parseInt(id) },
      data: {
        Nombre,
        Descripcion,
        ID_Categoria: parseInt(ID_Categoria),
        TieneTamanos: TieneTamanos === true || TieneTamanos === "true" ? 1 : 0,
        Precio: Precio ? parseFloat(Precio) : null,
        Disponible: Disponible === true || Disponible === "true" ? 1 : 0,
      },
    });
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
    await prisma.productos.delete({
      where: { ID_Producto: parseInt(id) },
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

