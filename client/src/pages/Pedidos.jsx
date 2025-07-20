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

  // Estados para recomendaciones
  const [recomendaciones, setRecomendaciones] = useState([])
  const [loadingRecomendaciones, setLoadingRecomendaciones] = useState(false)
  const [errorRecomendaciones, setErrorRecomendaciones] = useState(null)

  // Estado para verificar si la autenticación está completamente lista
  const [authReady, setAuthReady] = useState(false)

  // URL de la API
  const API_URL = import.meta.env.VITE_API_URL

  // Datos de productos de ejemplo
  const productosEjemplo = {
    24: {
      nombre: "Pizza Margherita",
      precio: 15.99,
      descripcion: "Pizza clásica con tomate, mozzarella y albahaca fresca",
      imagen: "/placeholder.svg?height=200&width=200&text=Pizza+Margherita",
    },
    54: {
      nombre: "Hamburguesa BBQ",
      precio: 12.5,
      descripcion: "Hamburguesa con carne, queso, cebolla caramelizada y salsa BBQ",
      imagen: "/placeholder.svg?height=200&width=200&text=Hamburguesa+BBQ",
    },
    71: {
      nombre: "Ensalada César",
      precio: 9.99,
      descripcion: "Ensalada fresca con pollo, crutones y aderezo césar",
      imagen: "/placeholder.svg?height=200&width=200&text=Ensalada+César",
    },
    67: {
      nombre: "Tacos al Pastor",
      precio: 8.75,
      descripcion: "Tacos tradicionales con carne al pastor, piña y cilantro",
      imagen: "/placeholder.svg?height=200&width=200&text=Tacos+Pastor",
    },
    52: {
      nombre: "Pasta Alfredo",
      precio: 13.25,
      descripcion: "Pasta cremosa con salsa alfredo y pollo grillado",
      imagen: "/placeholder.svg?height=200&width=200&text=Pasta+Alfredo",
    },
  }

  // Función para verificar si la autenticación está lista
  const checkAuthReady = () => {
    const token = localStorage.getItem("token")
    const hasUser = user && user.id
    const notLoading = !authLoading

    console.log("=== VERIFICANDO AUTENTICACIÓN ===")
    console.log("Token existe:", !!token)
    console.log("Usuario existe:", hasUser)
    console.log("No está cargando:", notLoading)
    console.log("Usuario completo:", user)

    return token && hasUser && notLoading
  }

  // Función para obtener recomendaciones
  const fetchRecomendaciones = async () => {
    if (!checkAuthReady()) {
      console.log("Autenticación no está lista para recomendaciones")
      return
    }

    try {
      setLoadingRecomendaciones(true)
      setErrorRecomendaciones(null)

      console.log("=== FETCHING RECOMENDACIONES ===")
      console.log("Usuario ID:", user.id)

      // Obtener IDs de productos recomendados
      const recomendacionesResponse = await fetch(
        `https://recomendaciones-05r3.onrender.com/api/recomendar?usuarioId=${user.id}`,
      )

      if (!recomendacionesResponse.ok) {
        throw new Error(`Error ${recomendacionesResponse.status}: ${recomendacionesResponse.statusText}`)
      }

      const productosIds = await recomendacionesResponse.json()
      console.log("IDs de productos recomendados:", productosIds)

      if (!Array.isArray(productosIds) || productosIds.length === 0) {
        console.log("No hay productos recomendados")
        setRecomendaciones([])
        return
      }

      // Crear productos usando los IDs y datos de ejemplo
      const productosRecomendados = productosIds.map((id) => {
        const productoEjemplo = productosEjemplo[id]

        if (productoEjemplo) {
          return {
            id: id,
            nombre: productoEjemplo.nombre,
            precio: productoEjemplo.precio,
            descripcion: productoEjemplo.descripcion,
            imagen: productoEjemplo.imagen,
            tieneDetalles: true,
          }
        } else {
          // Producto genérico si no tenemos datos específicos
          return {
            id: id,
            nombre: `Producto Recomendado #${id}`,
            precio: 0,
            descripcion: "Producto especialmente recomendado para ti",
            imagen: `/placeholder.svg?height=200&width=200&text=Producto+${id}`,
            tieneDetalles: false,
          }
        }
      })

      console.log("Productos recomendados creados:", productosRecomendados)
      setRecomendaciones(productosRecomendados)
    } catch (error) {
      console.error("Error fetching recomendaciones:", error)
      setErrorRecomendaciones(error.message)
    } finally {
      setLoadingRecomendaciones(false)
    }
  }

  // Función para obtener los pedidos del usuario
  const fetchMisPedidos = async () => {
    if (!checkAuthReady()) {
      console.log("Autenticación no está lista para pedidos")
      setError("Esperando autenticación...")
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("=== FETCHING MIS PEDIDOS ===")
      console.log("Usuario:", user)
      console.log("URL:", `${API_URL}/pedidos/usuario/${user.id}`)

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/pedidos/usuario/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

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

      // Debug: Verificar estructura de datos
      if (data.length > 0) {
        console.log("Estructura del primer pedido:", data[0])
        console.log("Detalle del primer pedido:", data[0].detalle_pedido)
        if (data[0].detalle_pedido && data[0].detalle_pedido.length > 0) {
          console.log("Primer producto del primer pedido:", data[0].detalle_pedido[0])
          console.log("Datos del producto:", data[0].detalle_pedido[0].productos)
        }
      }

      setPedidos(data)
    } catch (error) {
      console.error("Error fetching mis pedidos:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Effect para verificar cuando la autenticación está lista
  useEffect(() => {
    console.log("=== USEEFFECT AUTH CHECK ===")
    console.log("authLoading:", authLoading)
    console.log("user:", user)
    console.log("token exists:", !!localStorage.getItem("token"))

    if (!authLoading) {
      const isReady = checkAuthReady()
      console.log("Auth ready:", isReady)
      setAuthReady(isReady)
    }
  }, [user, authLoading])

  // Effect para cargar datos cuando la autenticación esté lista
  useEffect(() => {
    console.log("=== USEEFFECT DATA LOADING ===")
    console.log("authReady:", authReady)

    if (authReady) {
      console.log("Cargando datos...")
      fetchMisPedidos()

      // Retrasar las recomendaciones un poco para asegurar que todo esté listo
      setTimeout(() => {
        fetchRecomendaciones()
      }, 500)
    }
  }, [authReady])

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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-gray-700">
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
    return `$${Number(price || 0).toFixed(2)}`
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

  // Función para obtener el nombre del producto de manera segura
  const getProductName = (producto) => {
    return producto?.Nombre || producto?.nombre || "Producto sin nombre"
  }

  // Función para obtener el precio del producto de manera segura
  const getProductPrice = (producto) => {
    return producto?.Precio || producto?.precio || 0
  }

  // Componente de Recomendaciones
  const RecomendacionesSection = () => {
    // No mostrar nada si la autenticación no está lista
    if (!authReady) {
      return null
    }

    if (loadingRecomendaciones) {
      return (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cargando recomendaciones...</h2>
            </div>
          </div>
        </div>
      )
    }

    if (errorRecomendaciones) {
      return (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Error al cargar recomendaciones</h2>
                <p className="text-gray-600 dark:text-gray-300">{errorRecomendaciones}</p>
              </div>
            </div>
            <button
              onClick={fetchRecomendaciones}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    if (!recomendaciones || recomendaciones.length === 0) {
      return null // No mostrar nada si no hay recomendaciones
    }

    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recomendado para ti</h2>
                <p className="text-gray-600 dark:text-gray-300">Basado en tu historial de pedidos</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {recomendaciones.filter((p) => p.tieneDetalles).length} de {recomendaciones.length} con detalles
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {recomendaciones.slice(0, 5).map((producto, index) => (
              <div
                key={producto.id || index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={producto.imagen || "/placeholder.svg"}
                    alt={producto.nombre}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recomendado
                    </span>
                  </div>
                  {!producto.tieneDetalles && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        ID: {producto.id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center justify-between">
                    {producto.tieneDetalles && producto.precio > 0 ? (
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatPrice(producto.precio)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ver en menú</span>
                    )}
                    <button
                      onClick={() => {
                        if (producto.tieneDetalles && producto.precio > 0) {
                          // Lógica para agregar al carrito
                          console.log("Agregar al carrito:", producto)
                          alert(`${producto.nombre} agregado al carrito!`)
                        } else {
                          // Redirigir al menú para ver el producto completo
                          window.location.href = "/menu"
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            producto.tieneDetalles && producto.precio > 0
                              ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                              : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          }
                        />
                      </svg>
                      {producto.tieneDetalles && producto.precio > 0 ? "Agregar" : "Ver"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recomendaciones.length > 5 && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  window.location.href = "/menu"
                }}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm"
              >
                Ver más recomendaciones →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Modal para ver detalles del pedido
  const PedidoModal = ({ pedido, onClose }) => {
    if (!pedido) return null

    console.log("Modal - Pedido completo:", pedido)
    console.log("Modal - Detalle pedido:", pedido.detalle_pedido)

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
                  {pedido.clienteTelefono && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{pedido.clienteTelefono}</p>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Productos:</span>
                <div className="mt-2 space-y-2">
                  {pedido.detalle_pedido && pedido.detalle_pedido.length > 0 ? (
                    pedido.detalle_pedido.map((detalle, index) => {
                      console.log(`Producto ${index}:`, detalle)
                      const producto = detalle.productos
                      const nombreProducto = getProductName(producto)
                      const precioProducto = getProductPrice(producto)
                      const cantidad = detalle.cantidad || 0
                      const subtotal = precioProducto * cantidad

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{nombreProducto}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Cantidad: {cantidad} × {formatPrice(precioProducto)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</p>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-600 dark:text-gray-400">No se encontraron productos en este pedido</p>
                    </div>
                  )}
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
  if (authLoading) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Verificando autenticación...</p>
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

  if (!authReady) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Preparando tu sesión...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Verificando token JWT y configuración de usuario
            </p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando tus pedidos...</p>
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
            {/* Botón de debug mejorado */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Debug Info:</strong> Usuario ID: {user?.id}, Total pedidos: {pedidos.length}, Recomendaciones:{" "}
                {recomendaciones.length}, Auth Ready: {authReady ? "✅" : "❌"}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={fetchMisPedidos}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  🔄 Recargar Pedidos
                </button>
                <button
                  onClick={fetchRecomendaciones}
                  className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  ⭐ Recargar Recomendaciones
                </button>
              </div>
            </div>
          </div>

          {/* Sección de Recomendaciones */}
          <RecomendacionesSection />

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
                          {pedido.detalle_pedido?.length || 0} items
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
                          {pedido.detalle_pedido && pedido.detalle_pedido.length > 0
                            ? pedido.detalle_pedido
                                .slice(0, 2)
                                .map((d) => getProductName(d.productos))
                                .join(", ")
                            : "Sin productos"}
                          {pedido.detalle_pedido?.length > 2 && ` y ${pedido.detalle_pedido.length - 2} más...`}
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
