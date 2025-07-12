"use client"

import { useState, useEffect } from "react"
import { BarChart3, MapPin, Users, DollarSign, Calendar, Trophy, RefreshCw } from "lucide-react"
import AdminLayout from "../layouts/AdminLayout.jsx"
import {
  obtenerPlatillosMasVendidos,
  obtenerZonasConMasEnvios,
  obtenerIngresosPorDia,
  obtenerClientesFrecuentes,
} from "../api/auth.js"

const Reportes = () => {
  // Estados para los datos
  const [platillosMasVendidos, setPlatillosMasVendidos] = useState([])
  const [zonasConMasEnvios, setZonasConMasEnvios] = useState([])
  const [ingresosPorDia, setIngresosPorDia] = useState([])
  const [clientesFrecuentes, setClientesFrecuentes] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState({
    platillos: true,
    zonas: true,
    ingresos: true,
    clientes: true,
  })

  // Estados de error
  const [errors, setErrors] = useState({})

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("platillos")

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    cargarTodosLosDatos()
  }, [])

  const cargarTodosLosDatos = async () => {
    await Promise.all([
      cargarPlatillosMasVendidos(),
      cargarZonasConMasEnvios(),
      cargarIngresosPorDia(),
      cargarClientesFrecuentes(),
    ])
  }

  const cargarPlatillosMasVendidos = async () => {
    try {
      setLoading((prev) => ({ ...prev, platillos: true }))
      const data = await obtenerPlatillosMasVendidos()
      setPlatillosMasVendidos(data.platillosMasVendidos || [])
      setErrors((prev) => ({ ...prev, platillos: null }))
    } catch (error) {
      console.error("Error al cargar platillos:", error)
      setErrors((prev) => ({ ...prev, platillos: error.message }))
    } finally {
      setLoading((prev) => ({ ...prev, platillos: false }))
    }
  }

  const cargarZonasConMasEnvios = async () => {
    try {
      setLoading((prev) => ({ ...prev, zonas: true }))
      const data = await obtenerZonasConMasEnvios()
      setZonasConMasEnvios(data.zonasConMasEnvios || [])
      setErrors((prev) => ({ ...prev, zonas: null }))
    } catch (error) {
      console.error("Error al cargar zonas:", error)
      setErrors((prev) => ({ ...prev, zonas: error.message }))
    } finally {
      setLoading((prev) => ({ ...prev, zonas: false }))
    }
  }

  const cargarIngresosPorDia = async () => {
    try {
      setLoading((prev) => ({ ...prev, ingresos: true }))
      const data = await obtenerIngresosPorDia()
      setIngresosPorDia(data.ingresosPorDia || [])
      setErrors((prev) => ({ ...prev, ingresos: null }))
    } catch (error) {
      console.error("Error al cargar ingresos:", error)
      setErrors((prev) => ({ ...prev, ingresos: error.message }))
    } finally {
      setLoading((prev) => ({ ...prev, ingresos: false }))
    }
  }

  const cargarClientesFrecuentes = async () => {
    try {
      setLoading((prev) => ({ ...prev, clientes: true }))
      const data = await obtenerClientesFrecuentes()
      setClientesFrecuentes(data.clientesFrecuentes || [])
      setErrors((prev) => ({ ...prev, clientes: null }))
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      setErrors((prev) => ({ ...prev, clientes: error.message }))
    } finally {
      setLoading((prev) => ({ ...prev, clientes: false }))
    }
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Función para refrescar todos los datos
  const handleRefreshAll = () => {
    cargarTodosLosDatos()
  }

  // Componente de carga
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando...</span>
    </div>
  )

  // Componente de error
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">⚠️</div>
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar datos</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">{message}</p>
          </div>
        </div>
        <button onClick={onRetry} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  )

  // Calcular estadísticas generales
  const totalIngresos = ingresosPorDia.reduce((sum, item) => sum + item.total, 0)
  const totalPedidos = clientesFrecuentes.reduce((sum, cliente) => sum + cliente.cantidadPedidos, 0)
  const totalClientes = clientesFrecuentes.length

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reportes y Estadísticas</h1>
            <p className="text-gray-600 dark:text-gray-400">Análisis detallado del rendimiento del negocio</p>
          </div>
          <button
            onClick={handleRefreshAll}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mt-4 sm:mt-0"
          >
            <RefreshCw size={16} />
            Actualizar Todo
          </button>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(totalIngresos)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pedidos</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPedidos}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Activos</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalClientes}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {[
              { id: "platillos", label: "Platillos Más Vendidos", icon: Trophy },
              { id: "zonas", label: "Zonas de Envío", icon: MapPin },
              { id: "ingresos", label: "Ingresos por Día", icon: Calendar },
              { id: "clientes", label: "Clientes Frecuentes", icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <li key={id} className="mr-2">
                <button
                  className={`inline-flex items-center gap-2 p-4 rounded-t-lg text-sm font-medium ${
                    activeTab === id
                      ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                      : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Tab de Platillos Más Vendidos */}
          {activeTab === "platillos" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Platillos Más Vendidos</h2>
                <button
                  onClick={cargarPlatillosMasVendidos}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading.platillos ? (
                <LoadingSpinner />
              ) : errors.platillos ? (
                <ErrorMessage message={errors.platillos} onRetry={cargarPlatillosMasVendidos} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platillosMasVendidos.map((platillo, index) => (
                    <div
                      key={platillo.productoId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 dark:text-orange-400 font-bold">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{platillo.nombre}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(platillo.precio)}</p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {platillo.cantidadVendida} vendidos
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab de Zonas con Más Envíos */}
          {activeTab === "zonas" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Zonas con Más Envíos</h2>
                <button
                  onClick={cargarZonasConMasEnvios}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading.zonas ? (
                <LoadingSpinner />
              ) : errors.zonas ? (
                <ErrorMessage message={errors.zonas} onRetry={cargarZonasConMasEnvios} />
              ) : (
                <div className="space-y-4">
                  {zonasConMasEnvios.slice(0, 10).map((zona, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{zona.zona}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Zona de entrega #{index + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600 dark:text-blue-400">{zona.cantidad}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">envíos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab de Ingresos por Día */}
          {activeTab === "ingresos" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ingresos por Día</h2>
                <button
                  onClick={cargarIngresosPorDia}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading.ingresos ? (
                <LoadingSpinner />
              ) : errors.ingresos ? (
                <ErrorMessage message={errors.ingresos} onRetry={cargarIngresosPorDia} />
              ) : (
                <div className="space-y-3">
                  {ingresosPorDia.slice(0, 15).map((ingreso, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{formatDate(ingreso.fecha)}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos del día</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">{formatPrice(ingreso.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab de Clientes Frecuentes */}
          {activeTab === "clientes" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clientes Más Frecuentes</h2>
                <button
                  onClick={cargarClientesFrecuentes}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading.clientes ? (
                <LoadingSpinner />
              ) : errors.clientes ? (
                <ErrorMessage message={errors.clientes} onRetry={cargarClientesFrecuentes} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Pedidos</th>
                        <th className="px-6 py-3">Total Gastado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFrecuentes.slice(0, 10).map((cliente, index) => (
                        <tr
                          key={cliente.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 font-medium">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 dark:text-purple-400 font-bold text-xs">
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {cliente.nombre} {cliente.apellidos}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cliente.email}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900/20 dark:text-blue-400">
                              {cliente.cantidadPedidos} pedidos
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                            {formatPrice(cliente.totalGastado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Reportes
