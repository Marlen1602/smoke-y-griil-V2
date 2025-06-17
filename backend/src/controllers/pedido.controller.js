import prisma from "../db.js"

export const registrarPedido = async (req, res) => {
  const { usuarioId, productos, total, direccionEnvio, datosUsuario } = req.body

  console.log("=== PEDIDO CONTROLLER DEBUG ===")
  console.log("usuarioId:", usuarioId)
  console.log("direccionEnvio:", direccionEnvio)
  console.log("productos recibidos:", productos)
  console.log("total:", total)
  console.log("datosUsuario:", datosUsuario)

  try {
    // Validar que se proporcionaron productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron productos" })
    }

    // Validar que el usuario existe
    const usuarioExiste = await prisma.users.findUnique({
      where: { id: usuarioId },
    })

    if (!usuarioExiste) {
      console.log("Usuario no encontrado:", usuarioId)
      return res.status(400).json({ message: "Usuario no encontrado" })
    }

    // NO ACTUALIZAR la tabla users - en su lugar guardar en el pedido
    console.log("Guardando información del cliente específica para este pedido")

    // Obtener todos los IDs de productos que se están intentando agregar
    const productosIds = productos.map((p) => p.id)
    console.log("IDs de productos a validar:", productosIds)

    // Verificar que todos los productos existen en la base de datos
    const productosExistentes = await prisma.productos.findMany({
      where: {
        ID_Producto: {
          in: productosIds,
        },
      },
    })

    console.log(
      "Productos encontrados en BD:",
      productosExistentes.map((p) => ({ ID_Producto: p.ID_Producto, Nombre: p.Nombre })),
    )

    // Verificar si algún producto no existe
    const productosExistentesIds = productosExistentes.map((p) => p.ID_Producto)
    const productosNoEncontrados = productosIds.filter((id) => !productosExistentesIds.includes(id))

    if (productosNoEncontrados.length > 0) {
      console.log("Productos NO encontrados:", productosNoEncontrados)
      return res.status(400).json({
        message: "Algunos productos no existen en la base de datos",
        productosNoEncontrados: productosNoEncontrados,
        productosDisponibles: productosExistentes.map((p) => ({
          ID_Producto: p.ID_Producto,
          Nombre: p.Nombre,
        })),
      })
    }

    // Crear el pedido con información específica del cliente para este pedido
    const pedido = await prisma.pedidos.create({
      data: {
        usuarioId,
        total,
        direccionEnvio,
        // Guardar información específica del cliente para este pedido
        clienteNombre: datosUsuario?.name || usuarioExiste.nombre,
        clienteEmail: datosUsuario?.email || usuarioExiste.email,
        clienteTelefono: datosUsuario?.phone || null,
        estado: "En preparación",
        detallePedido: {
          create: productos.map((p) => ({
            productoId: p.id,
            cantidad: p.cantidad,
          })),
        },
      },
      include: {
        detallePedido: {
          include: {
            producto: true,
          },
        },
        usuario: true,
      },
    })

    console.log("Pedido creado exitosamente:", pedido.id)
    res.status(201).json(pedido)
  } catch (error) {
    console.error("Error al registrar el pedido:", error)
    res.status(500).json({ message: "Error al registrar el pedido", error: error.message })
  }
}

export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedidos.findMany({
      include: {
        usuario: true,
        detallePedido: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })

    res.json(pedidos)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    res.status(500).json({ message: "Error al obtener pedidos" })
  }
}

// Obtener pedidos de un usuario específico
export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params

    console.log("Obteniendo pedidos para usuario:", usuarioId)

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.users.findUnique({
      where: { id: Number.parseInt(usuarioId) },
    })

    if (!usuarioExiste) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Obtener pedidos del usuario
    const pedidos = await prisma.pedidos.findMany({
      where: {
        usuarioId: Number.parseInt(usuarioId),
      },
      include: {
        usuario: true,
        detallePedido: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })

    console.log(`Encontrados ${pedidos.length} pedidos para el usuario ${usuarioId}`)
    res.json(pedidos)
  } catch (error) {
    console.error("Error al obtener pedidos del usuario:", error)
    res.status(500).json({ message: "Error al obtener pedidos del usuario" })
  }
}


export const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params
  const { nuevoEstado } = req.body

  try {
    const pedido = await prisma.pedidos.update({
      where: { id: Number(id) },
      data: { estado: nuevoEstado },
    })

    res.json(pedido)
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error)
    res.status(500).json({ message: "No se pudo actualizar el estado" })
  }
}

// Función auxiliar para debugging - obtener todos los productos
export const obtenerTodosLosProductos = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      select: {
        ID_Producto: true,
        Nombre: true,
        Precio: true,
        Disponible: true,
      },
    })

    console.log("Todos los productos en BD:", productos)
    res.json({
      total: productos.length,
      productos: productos,
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).json({ message: "Error al obtener productos" })
  }
}
 //Función para buscar pedido por id 
 // Obtener un pedido por su ID
export const obtenerPedidoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await prisma.pedidos.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
        detallePedido: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    console.error("Error al obtener pedido por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
