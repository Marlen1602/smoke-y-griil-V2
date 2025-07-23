"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, RefreshCw, LogOut, User, Clock, CheckCircle, Truck, Filter, X } from "lucide-react"

export default function EmployeePanel() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("pedidos-actuales")
  const [useMockData, setUseMockData] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)

  // Datos de prueba para desarrollo
  const mockPedidos = [
    {
      id: 1,
      total: 25.5,
      estado: "En preparación",
      fecha: new Date().toISOString(),
      direccionEnvio: "Av. Principal 123, Col. Centro",
      clienteNombre: "María García",
      clienteEmail: "maria@email.com",
      clienteTelefono: "+52 555-0123",
      usuario: {
        nombre: "María García",
        email: "maria@email.com",
      },
      detalle_pedido: [
        {
          cantidad: 1,
          productos: { Nombre: "Pizza Margherita", Precio: 15.5 },
        },
        {
          cantidad: 2,
          productos: { Nombre: "Coca Cola", Precio: 5.0 },
        },
      ],
    },
    {
      id: 2,
      total: 35.0,
      estado: "Listo para entrega",
      fecha: new Date(Date.now() - 3600000).toISOString(),
      direccionEnvio: "Calle Secundaria 456, Col. Norte",
      clienteNombre: "Juan Pérez",
      clienteEmail: "juan@email.com",
      clienteTelefono: "+52 555-0124",
      usuario: {
        nombre: "Juan Pérez",
        email: "juan@email.com",
      },
      detalle_pedido: [
        {
          cantidad: 2,
          productos: { Nombre: "Hamburguesa Clásica", Precio: 12.0 },
        },
        {
          cantidad: 1,
          productos: { Nombre: "Papas Fritas", Precio: 8.0 },
        },
      ],
    },
    {
      id: 3,
      total: 18.0,
      estado: "Entregado",
      fecha: new Date(Date.now() - 7200000).toISOString(),
      direccionEnvio: "Plaza Central 789, Col. Sur",
      clienteNombre: "Ana López",
      clienteEmail: "ana@email.com",
      clienteTelefono: "+52 555-0125",
      usuario: {
        nombre: "Ana López",
        email: "ana@email.com",
      },
      detalle_pedido: [
        {
          cantidad: 1,
          productos: { Nombre: "Ensalada César", Precio: 18.0 },
        },
      ],
    },
  ]

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Función para obtener pedidos desde la API
  const fetchPedidos = async () => {
    try {
      setLoading(true)
      setError(null)

      if (useMockData) {
        setTimeout(() => {
          console.log("Usando datos mock:", mockPedidos)
          setPedidos(mockPedidos)
          setLoading(false)
        }, 1000)
        return
      }

      const baseURL = import.meta.env.VITE_API_URL
      console.log("VITE_API_URL:", baseURL)
      console.log("=== FETCHING PEDIDOS (EMPLOYEE PANEL) ===")
      console.log("URL:", `${baseURL}/pedidos`)

      const response = await fetch(`${baseURL}/pedidos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON válido. Verifica que tu servidor esté ejecutándose.")
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error del servidor" }))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Datos de pedidos recibidos:", data)
      setPedidos(data)
    } catch (error) {
      console.error("Error fetching pedidos:", error)
      setError(`${error.message}. ¿Quieres usar datos de prueba?`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  const handleCerrarSesion = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL
      const response = await fetch(`${baseURL}/pedidos/${pedidoId}/estado`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEstado }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON válido")
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error del servidor" }))
        throw new Error(errorData.message || "Error al actualizar estado")
      }

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) => (pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido)),
      )
      alert("Estado actualizado correctamente")
    } catch (error) {
      console.error("Error updating pedido:", error)
      alert(`Error: ${error.message}`)
    }
  }

  const getEstadoBadge = (estado) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
    switch (estado) {
      case "En preparación":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
            <Clock className="w-3 h-3 mr-1" />
            En Preparación
          </span>
        )
      case "Listo para entrega":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Listo para Entrega
          </span>
        )
      case "Entregado":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
            <Truck className="w-3 h-3 mr-1" />
            Entregado
          </span>
        )
      default:
        return null
    }
  }

  const getProductName = (producto) => {
    return producto?.Nombre || producto?.nombre || "Producto sin nombre"
  }

  const getProductPrice = (producto) => {
    return producto?.Precio || producto?.precio || 0
  }

  const formatearPedido = (pedido) => {
    const detalles = pedido.detalle_pedido || pedido.detallePedido || []
    const items = detalles.map((detalle) => {
      const producto = detalle.productos || detalle.producto
      const nombreProducto = getProductName(producto)
      const cantidad = detalle.cantidad || 0
      return `${nombreProducto} (x${cantidad})`
    })

    return {
      id: pedido.id,
      cliente: pedido.clienteNombre || pedido.usuario?.nombre || pedido.usuario?.email || "Cliente desconocido",
      telefono: pedido.clienteTelefono || pedido.usuario?.telefono || "No disponible",
      direccion: pedido.direccionEnvio || "Dirección no disponible",
      items: items,
      total: Number(pedido.total) || 0,
      estado: pedido.estado || "Desconocido",
      fecha: pedido.fecha,
      metodoPago: "Efectivo al entregar",
    }
  }

  // Filtrar pedidos por estado
  const filtrarPedidos = (pedidosList) => {
    if (filtroEstado === "todos") return pedidosList
    return pedidosList.filter((p) => p.estado === filtroEstado)
  }

  // Contadores por estado
  const contadores = {
    total: pedidos.length,
    "En preparación": pedidos.filter((p) => p.estado === "En preparación").length,
    "Listo para entrega": pedidos.filter((p) => p.estado === "Listo para entrega").length,
    Entregado: pedidos.filter((p) => p.estado === "Entregado").length,
  }

  const pedidosActivos = filtrarPedidos(pedidos.filter((p) => p.estado !== "Entregado"))
  const historialPedidos = filtrarPedidos(pedidos.filter((p) => p.estado === "Entregado"))

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={fetchPedidos}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => {
                  setUseMockData(true)
                  setError(null)
                  fetchPedidos()
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Usar Datos de Prueba
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Panel de Empleado</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de Pedidos</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Contadores rápidos */}
                <div className="hidden lg:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                      {contadores["En preparación"]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200 font-medium">
                      {contadores["Listo para entrega"]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-800 dark:text-green-200 font-medium">{contadores["Entregado"]}</span>
                  </div>
                </div>

                {/* Botón de modo oscuro */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={darkMode ? "Modo claro" : "Modo oscuro"}
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

                {/* Botón actualizar */}
                <button
                  onClick={fetchPedidos}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Actualizar pedidos"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Actualizar</span>
                </button>

                {/* Botón cerrar sesión */}
                <button
                  onClick={handleCerrarSesion}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Filter className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{contadores.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Preparación</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{contadores["En preparación"]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Listo</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {contadores["Listo para entrega"]}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entregado</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{contadores["Entregado"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y Tabs */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("pedidos-actuales")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "pedidos-actuales"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Pedidos Actuales ({pedidosActivos.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("historial")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "historial"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Historial ({historialPedidos.length})</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Filtros por estado */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>

                {showFilters && (
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                      className="text-sm border-0 bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="En preparación">En preparación</option>
                      <option value="Listo para entrega">Listo para entrega</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                    {filtroEstado !== "todos" && (
                      <button
                        onClick={() => setFiltroEstado("todos")}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pedidos Actuales */}
          {activeTab === "pedidos-actuales" && (
            <div className="space-y-6">
              {pedidosActivos.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      {filtroEstado === "todos"
                        ? "No hay pedidos pendientes"
                        : `No hay pedidos en estado: ${filtroEstado}`}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Los nuevos pedidos aparecerán aquí automáticamente
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pedidosActivos.map((pedidoRaw) => {
                    const pedido = formatearPedido(pedidoRaw)
                    return (
                      <div
                        key={pedido.id}
                        className="bg-white dark:bg-gray-800 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedido #{pedido.id}</h3>
                            {getEstadoBadge(pedido.estado)}
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Cliente:</h4>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{pedido.cliente}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{pedido.telefono}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                                Dirección de envío:
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {pedido.direccion}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Pedido:</h4>
                              {pedido.items.length > 0 ? (
                                <div className="space-y-1">
                                  {pedido.items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-red-500 dark:text-red-400 italic">
                                  No se encontraron productos
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                              <div>
                                <span className="font-bold text-xl text-gray-900 dark:text-white">
                                  ${pedido.total.toFixed(2)}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{pedido.metodoPago}</p>
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Creado: {new Date(pedido.fecha).toLocaleString()}
                            </div>

                            {/* Botones de cambio de estado */}
                            <div className="space-y-2 pt-2">
                              {pedido.estado === "En preparación" && (
                                <button
                                  onClick={() => cambiarEstadoPedido(pedido.id, "Listo para entrega")}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Marcar Listo para Entrega
                                </button>
                              )}
                              {pedido.estado === "Listo para entrega" && (
                                <button
                                  onClick={() => cambiarEstadoPedido(pedido.id, "Entregado")}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center transition-colors"
                                >
                                  <Truck className="w-4 h-4 mr-2" />
                                  Marcar como Entregado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Historial de Pedidos */}
          {activeTab === "historial" && (
            <div className="space-y-6">
              {historialPedidos.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Truck className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">No hay pedidos completados</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Los pedidos entregados aparecerán aquí
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {historialPedidos.map((pedidoRaw) => {
                    const pedido = formatearPedido(pedidoRaw)
                    return (
                      <div
                        key={pedido.id}
                        className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                  Pedido #{pedido.id}
                                </h3>
                                {getEstadoBadge(pedido.estado)}
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-gray-900 dark:text-white font-medium">{pedido.cliente}</p>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm">{pedido.telefono}</p>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm">{pedido.direccion}</p>
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                  <p>Creado: {new Date(pedido.fecha).toLocaleString()}</p>
                                  <p>Método de pago: {pedido.metodoPago}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {pedido.items.length > 0 ? (
                                  pedido.items.map((item, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                                    >
                                      {item}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-sm text-red-500 dark:text-red-400 italic">Sin productos</span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ${pedido.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
