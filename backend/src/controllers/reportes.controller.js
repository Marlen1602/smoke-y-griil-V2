import prisma from "../db.js"

//Platillo mas vendido
export const obtenerPlatillosMasVendidos = async (req, res) => {
  try {
    const resultados = await prisma.detalle_Pedido.groupBy({
      by: ["productoId"],
      _sum: {
        cantidad: true,
      },
      orderBy: {
        _sum: {
          cantidad: "desc",
        },
      },
      take: 10,
    });

    const productos = await Promise.all(
      resultados.map(async (r) => {
        const producto = await prisma.productos.findUnique({
          where: { ID_Producto: r.productoId },
          select: { Nombre: true, Precio: true, Imagen: true },
        });
        return {
          productoId: r.productoId,
          nombre: producto?.Nombre,
          precio: producto?.Precio,
          imagen: producto?.Imagen,
          cantidadVendida: r._sum.cantidad,
        };
      })
    );

    res.json({ platillosMasVendidos: productos });
  } catch (error) {
    console.error("Error en platillos más vendidos:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

//Zonas con mas envios 
export const obtenerZonasConMasEnvios = async (req, res) => {
  try {
    const pedidos = await prisma.pedidos.findMany({
      select: { direccionEnvio: true },
    });

    const conteoZonas = {};

    pedidos.forEach((pedido) => {
      const zona = pedido.direccionEnvio.trim();
      conteoZonas[zona] = (conteoZonas[zona] || 0) + 1;
    });

    const resultado = Object.entries(conteoZonas)
      .map(([zona, cantidad]) => ({ zona, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    res.json({ zonasConMasEnvios: resultado });
  } catch (error) {
    console.error("Error al obtener zonas con más envíos:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

//Ingresos por dia 
export const obtenerIngresosPorDia = async (req, res) => {
  try {
    const pedidos = await prisma.pedidos.findMany({
      select: {
        fecha: true,
        total: true,
      },
    });

    const ingresosPorDia = {};

    pedidos.forEach((pedido) => {
      const dia = new Date(pedido.fecha).toISOString().split("T")[0];
      ingresosPorDia[dia] = (ingresosPorDia[dia] || 0) + Number(pedido.total);
    });

    const resultado = Object.entries(ingresosPorDia)
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json({ ingresosPorDia: resultado });
  } catch (error) {
    console.error("Error al calcular ingresos por día:", error);
    res.status(500).json({ message: "Error al calcular ingresos" });
  }
};

//Clientes mas frecuentes 
export const obtenerClientesFrecuentes = async (req, res) => {
  try {
    const pedidos = await prisma.pedidos.findMany({
      select: {
        usuarioId: true,
        total: true,
      },
    });

    const conteoClientes = {};

    pedidos.forEach((pedido) => {
      const id = pedido.usuarioId;
      if (!conteoClientes[id]) {
        conteoClientes[id] = { cantidadPedidos: 0, totalGastado: 0 };
      }
      conteoClientes[id].cantidadPedidos += 1;
      conteoClientes[id].totalGastado += Number(pedido.total);
    });

    const usuarios = await prisma.users.findMany({
      where: {
        id: { in: Object.keys(conteoClientes).map(Number) },
      },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
      },
    });

    const resultado = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      cantidadPedidos: conteoClientes[u.id].cantidadPedidos,
      totalGastado: conteoClientes[u.id].totalGastado,
    })).sort((a, b) => b.cantidadPedidos - a.cantidadPedidos);

    res.json({ clientesFrecuentes: resultado });
  } catch (error) {
    console.error("Error al obtener clientes frecuentes:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};



