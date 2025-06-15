"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contex/AuthContext"
import ClientLayout from "../layouts/ClientLayaut"

const MisPedidos = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPedido, setSelectedPedido] = useState(null)

  // URL de la API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

  // Función para obtener los pedidos del usuario
  const fetchMisPedidos = async () => {
    if (authLoading) {
      console.log("Esperando a que termine de cargar la autenticación...")
      return
    }

    if (!user || !user.id) {
      console.log("Usuario no disponible:", user)
      setError("Usuario no autenticado. Por favor inicia sesión.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("=== FETCHING MIS PEDIDOS ===")
      console.log("Usuario:", user)
      console.log("URL:", `${API_URL}/pedidos/usuario/${user.id}`)
      console.log("Token:", localStorage.getItem("token"))

      const response = await fetch(`${API_URL}/pedidos/usuario/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("Error response:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          errorData = { message: errorText || "Error del servidor" }
        }

        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Mis pedidos recibidos:", data)
      setPedidos(data)
    } catch (error) {
      console.error("Error fetching mis pedidos:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("=== USEEFFECT MIS PEDIDOS ===")
    console.log("authLoading:", authLoading)
    console.log("user:", user)

    if (!authLoading) {
      fetchMisPedidos()
    }
  }, [user, authLoading])

  // Función para obtener el badge del estado
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "En preparación":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
            </svg>
            Entregado
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            {estado}
          </span>
        )
    }
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Modal para ver detalles del pedido
  const PedidoModal = ({ pedido, onClose }) => {
    if (!pedido) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalles del Pedido #{pedido.id}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
                {getEstadoBadge(pedido.estado)}
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Fecha del pedido:</span>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(pedido.fecha)}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Dirección de entrega:</span>
                <p className="font-medium text-gray-900 dark:text-white">{pedido.direccionEnvio}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Información de contacto:</span>
                <div className="mt-1">
                  <p className="font-medium text-gray-900 dark:text-white">{pedido.clienteNombre}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{pedido.clienteEmail}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{pedido.clienteTelefono}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Productos:</span>
                <div className="mt-2 space-y-2">
                  {pedido.detallePedido?.map((detalle, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{detalle.producto?.Nombre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cantidad: {detalle.cantidad}</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice((detalle.producto?.Precio || 0) * detalle.cantidad)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(pedido.total)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pago en efectivo al entregar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estados de carga y error
  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {authLoading ? "Verificando autenticación..." : "Cargando tus pedidos..."}
            </p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (!user) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Acceso Restringido</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Necesitas iniciar sesión para ver tus pedidos.</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Error al cargar pedidos</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={fetchMisPedidos}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors mr-2"
              >
                Reintentar
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Pedidos</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Aquí puedes ver el estado de todos tus pedidos, {user?.nombre || "Usuario"}
            </p>

            {/* Botón de debug */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Debug Info:</strong> Usuario ID: {user?.id}, Total pedidos: {pedidos.length}
              </p>
              <button
                onClick={fetchMisPedidos}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Recargar Pedidos
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En Preparación</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {pedidos.filter((p) => p.estado === "En preparación").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Listo para Entrega</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {pedidos.filter((p) => p.estado === "Listo para entrega").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entregados</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {pedidos.filter((p) => p.estado === "Entregado").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de pedidos */}
          {pedidos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes pedidos aún</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">¡Haz tu primer pedido y aparecerá aquí!</p>
              <button
                onClick={() => (window.location.href = "/menu")}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pedido #{pedido.id}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(pedido.fecha)}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">{getEstadoBadge(pedido.estado)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                          {formatPrice(pedido.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Productos</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {pedido.detallePedido?.length || 0} items
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Método de pago</p>
                        <p className="font-medium text-gray-900 dark:text-white">Efectivo al entregar</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                        <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                          {pedido.direccionEnvio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Productos:{" "}
                          {pedido.detallePedido
                            ?.slice(0, 2)
                            .map((d) => d.producto?.Nombre)
                            .join(", ")}
                          {pedido.detallePedido?.length > 2 && ` y ${pedido.detallePedido.length - 2} más...`}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPedido(pedido)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles */}
        {selectedPedido && <PedidoModal pedido={selectedPedido} onClose={() => setSelectedPedido(null)} />}
      </div>
    </ClientLayout>
  )
}

export default MisPedidos
