import prisma from "../db.js";
import { cloudinary } from "../libs/cloudinary.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      orderBy: { ID_Producto: 'desc' },
      include: { categorias: true }
    });
    res.json(productos);
  } catch (error) {
    logger.error("Error al obtener productos", {
      error: error.message,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const producto = await prisma.productos.findUnique({
      where: { ID_Producto: parseInt(req.params.id) },
      include: { categorias: true }
    });

    if (!producto) {
      logger.warn("Producto no encontrado por ID", {
        id: req.params.id,
        usuario: req.user?.username || "Anónimo",
      });
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    logger.error("Error al obtener el producto", {
      error: error.message,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;
  const usuario = req.user?.username || "Anónimo";
  let imageUrl = null;

  try {
    // Validar campos obligatorios
    if (!Nombre || !Descripcion) {
      logger.warn("Intento de creación de producto sin campos obligatorios", { usuario });
      return res.status(400).json({ error: "Nombre y descripción son obligatorios" });
    }

    // Subir imagen a Cloudinary si existe
    if (req.file) {
          imageUrl = req.file.path;
    }

    // Convertir valores booleanos
    const tieneTamanosValue =
      TieneTamanos === true || TieneTamanos === "true" || TieneTamanos === 1 || TieneTamanos === "1";
    const disponibleValue =
      Disponible === true || Disponible === "true" || Disponible === 1 || Disponible === "1";


    // Crear el producto
    const nuevoProducto = await prisma.productos.create({
      data: {
        Nombre,
        Descripcion,
        ID_Categoria: ID_Categoria ? parseInt(ID_Categoria) : null,
        TieneTamanos: tieneTamanosValue,
        Precio: !tieneTamanosValue && !isNaN(parseFloat(Precio)) ? parseFloat(Precio) : 0,
        Disponible: disponibleValue,
        Imagen: imageUrl,
      },
    });

    logger.info("Producto creado correctamente", { 
      usuario, 
      productoId: nuevoProducto.ID_Producto 
    });

    await logSecurityEvent(
      usuario,
      "Creación de producto",
      false,
      `Producto "${Nombre}" creado con ID ${nuevoProducto.ID_Producto}`
    );

    res.status(201).json({
      message: "Producto creado correctamente",
      producto: nuevoProducto
    });
  } catch (error) {
    logger.error("Error al crear producto", {
      error: error.message,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, ID_Categoria, TieneTamanos, Precio, Disponible } = req.body;
  const usuario = req.user?.username || "Anónimo";

  try {
    // Verificar si el producto existe
    const productoExistente = await prisma.productos.findUnique({
      where: { ID_Producto: parseInt(id) }
    });

    if (!productoExistente) {
      logger.warn("Intento de actualizar producto inexistente", { 
        id: id, 
        usuario 
      });
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Convertir valores booleanos
    const tieneTamanosValue =
      TieneTamanos === true || TieneTamanos === "true" || TieneTamanos === 1 || TieneTamanos === "1";
    const disponibleValue =
      Disponible === true || Disponible === "true" || Disponible === 1 || Disponible === "1";

    // Preparar datos para actualización
    const updateData = {
      Nombre,
      Descripcion,
      TieneTamanos: tieneTamanosValue,
      Disponible: disponibleValue,
      Precio: !tieneTamanosValue && !isNaN(parseFloat(Precio)) ? parseFloat(Precio) :  productoExistente.Precio,
      ID_Categoria: ID_Categoria ? parseInt(ID_Categoria) : null
    };

    // Actualizar el producto
    const productoActualizado = await prisma.productos.update({
      where: { ID_Producto: parseInt(id) },
      data: updateData
    });

    logger.info("Producto actualizado correctamente", { 
      id: productoActualizado.ID_Producto, 
      usuario 
    });

    await logSecurityEvent(
      usuario,
      "Actualización de producto",
      false,
      `Producto ID ${productoActualizado.ID_Producto} actualizado`
    );

    res.json({
      message: "Producto actualizado correctamente",
      producto: productoActualizado
    });
  } catch (error) {
    logger.error("Error al actualizar producto", {
      error: error.message,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Subir imagen de producto
export const uploadImagen = async (req, res) => {
  const { id } = req.params;
  const usuario = req.user?.username || "Anónimo";

  try {
    // Verificar si el producto existe
    const producto = await prisma.productos.findUnique({
      where: { ID_Producto: parseInt(id) }
    });

    if (!producto) {
      logger.warn("Intento de subir imagen a producto inexistente", { 
        id: id, 
        usuario 
      });
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si se subió una imagen
    if (!req.file) {
      logger.warn("Intento de subir imagen sin archivo", { usuario });
      return res.status(400).json({ error: "No se ha subido ninguna imagen" });
    }

    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Actualizar la imagen del producto
    const productoActualizado = await prisma.productos.update({
      where: { ID_Producto: parseInt(id) },
      data: { Imagen: result.secure_url }
    });

    logger.info("Imagen de producto actualizada correctamente", { 
      id: productoActualizado.ID_Producto, 
      usuario 
    });

    res.json({
      message: "Imagen subida correctamente",
      producto: productoActualizado
    });
  } catch (error) {
    logger.error("Error al subir imagen de producto", {
      error: error.message,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const usuario = req.user?.username || "Anónimo";

  try {
    // Verificar si el producto existe
    const producto = await prisma.productos.findUnique({
      where: { ID_Producto: parseInt(id) }
    });

    if (!producto) {
      logger.warn("Intento de eliminar producto inexistente", { 
        id: id, 
        usuario 
      });
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Eliminar registros relacionados primero
    await prisma.tamanosproductos.deleteMany({
      where: { ID_Producto: parseInt(id) }
    });

    await prisma.detalle_pedido.deleteMany({
      where: { productoId: parseInt(id) }
    });

    // Ahora eliminar el producto
    await prisma.productos.delete({
      where: { ID_Producto: parseInt(id) }
    });

    logger.info("Producto eliminado correctamente", { 
      id: id, 
      usuario 
    });

    await logSecurityEvent(
      usuario,
      "Eliminación de producto",
      true,
      `Producto "${producto.Nombre}" (ID ${producto.ID_Producto}) eliminado`
    );

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar producto", {
      error: error.message,
      stack: error.stack,
      modulo: "productos.controller.js",
    });
    res.status(500).json({ error: "Error al eliminar el producto: " + error.message });
  }
};