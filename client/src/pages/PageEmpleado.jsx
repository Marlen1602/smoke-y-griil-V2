import { useState, useEffect } from "react"

export default function EmployeePanel() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("pedidos-actuales")
  const [useMockData, setUseMockData] = useState(false)

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
      detallePedido: [
        {
          cantidad: 1,
          producto: { Nombre: "Pizza Margherita" },
        },
        {
          cantidad: 2,
          producto: { Nombre: "Coca Cola" },
        },
      ],
    },
  ]

  // Función para obtener pedidos desde la API
  const fetchPedidos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Si usamos datos de prueba
      if (useMockData) {
        setTimeout(() => {
          setPedidos(mockPedidos)
          setLoading(false)
        }, 1000)
        return
      }

      // Intentar conectar con la API real
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
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
      console.log("Datos de pedidos recibidos:", data) // Debug para ver la estructura
      if (data.length > 0) {
        console.log("Primer pedido completo:", data[0]) // Ver el primer pedido completo
      }
      setPedidos(data)
    } catch (error) {
      console.error("Error fetching pedidos:", error)
      setError(`${error.message}. ¿Quieres usar datos de prueba?`)
    } finally {
      setLoading(false)
    }
  }

  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchPedidos()
  }, [])

  const handleCerrarSesion = () => {
    localStorage.removeItem("token")
    // Redirigir al login
    window.location.href = "/login"
  }

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
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

      // Actualizar el estado local
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
    switch (estado) {
      case "En preparación":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            En Preparación
          </span>
        )
      case "Listo para entrega":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Listo para Entrega
          </span>
        )
      case "Entregado":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
            </svg>
            Entregado
          </span>
        )
      default:
        return null
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "En preparación":
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        )
      case "Listo para entrega":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "Entregado":
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
          </svg>
        )
      default:
        return null
    }
  }

  // Formatear los datos del pedido para mostrar - USAR CAMPOS ESPECÍFICOS DEL PEDIDO
  const formatearPedido = (pedido) => {
    console.log("Formateando pedido:", pedido) // Debug

    return {
      id: pedido.id,
      // PRIORIZAR información específica del pedido sobre información del usuario
      cliente: pedido.clienteNombre || pedido.usuario?.nombre || pedido.usuario?.email || "Cliente desconocido",
      telefono: pedido.clienteTelefono || pedido.usuario?.telefono || "No disponible",
      direccion: pedido.direccionEnvio || "Dirección no disponible",
      items:
        pedido.detallePedido?.map(
          (detalle) => `${detalle.producto?.Nombre || detalle.producto?.nombre || "Producto"} (x${detalle.cantidad})`,
        ) || [],
      total: Number(pedido.total) || 0, // Asegurar que sea un número
      estado: pedido.estado || "Desconocido",
      fecha: pedido.fecha,
      metodoPago: "Efectivo al entregar",
    }
  }

  const pedidosActivos = pedidos.filter((p) => p.estado !== "Entregado")
  const historialPedidos = pedidos.filter((p) => p.estado === "Entregado")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={fetchPedidos}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                setUseMockData(true)
                setError(null)
                fetchPedidos()
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Usar Datos de Prueba
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Asegúrate de que tu servidor backend esté ejecutándose en el puerto correcto (revisa tu variable
            VITE_API_URL)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Panel de Empleado</h1>
                  <p className="text-sm text-gray-500">Gestión de Pedidos</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={fetchPedidos}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                title="Actualizar pedidos"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              <button
                onClick={handleCerrarSesion}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("pedidos-actuales")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pedidos-actuales"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Pedidos Actuales ({pedidosActivos.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("historial")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "historial"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Historial ({historialPedidos.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Pedidos Actuales */}
        {activeTab === "pedidos-actuales" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Pedidos Actuales</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {pedidosActivos.length} pedidos pendientes
              </span>
            </div>

            {pedidosActivos.length === 0 ? (
              <div className="bg-white shadow rounded-lg">
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-center">No hay pedidos pendientes</p>
                  <p className="text-gray-400 text-sm mt-2">Los nuevos pedidos aparecerán aquí automáticamente</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pedidosActivos.map((pedidoRaw) => {
                  const pedido = formatearPedido(pedidoRaw)
                  return (
                    <div key={pedido.id} className="bg-white shadow rounded-lg hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold">Pedido #{pedido.id}</h3>
                          {getEstadoIcon(pedido.estado)}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Cliente:</h4>
                            <p className="text-sm text-gray-900 font-medium">{pedido.cliente}</p>
                            <p className="text-sm text-gray-600">{pedido.telefono}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Dirección de envío:</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{pedido.direccion}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Pedido:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {pedido.items.map((item, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <span className="font-semibold text-lg">${pedido.total.toFixed(2)}</span>
                              <p className="text-xs text-gray-500">{pedido.metodoPago}</p>
                            </div>
                            {getEstadoBadge(pedido.estado)}
                          </div>

                          <div className="text-xs text-gray-500">Creado: {new Date(pedido.fecha).toLocaleString()}</div>

                          {/* Botones de cambio de estado */}
                          <div className="space-y-2">
                            {pedido.estado === "En preparación" && (
                              <button
                                onClick={() => cambiarEstadoPedido(pedido.id, "Listo para entrega")}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Marcar Listo para Entrega
                              </button>
                            )}

                            {pedido.estado === "Listo para entrega" && (
                              <button
                                onClick={() => cambiarEstadoPedido(pedido.id, "Entregado")}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
                                </svg>
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Historial de Pedidos</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {historialPedidos.length} pedidos completados
              </span>
            </div>

            {historialPedidos.length === 0 ? (
              <div className="bg-white shadow rounded-lg">
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-center">No hay pedidos completados</p>
                  <p className="text-gray-400 text-sm mt-2">Los pedidos entregados aparecerán aquí</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {historialPedidos.map((pedidoRaw) => {
                  const pedido = formatearPedido(pedidoRaw)
                  return (
                    <div key={pedido.id} className="bg-white shadow rounded-lg">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="font-semibold text-lg">Pedido #{pedido.id}</h3>
                              {getEstadoBadge(pedido.estado)}
                            </div>

                            <div className="mb-3">
                              <p className="text-gray-900 font-medium">{pedido.cliente}</p>
                              <p className="text-gray-600 text-sm">{pedido.telefono}</p>
                              <p className="text-gray-600 text-sm">{pedido.direccion}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {pedido.items.map((item, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>

                            <div className="text-sm text-gray-500 space-y-1">
                              <p>Creado: {new Date(pedido.fecha).toLocaleString()}</p>
                              <p>Método de pago: {pedido.metodoPago}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">${pedido.total.toFixed(2)}</p>
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
  )
}
