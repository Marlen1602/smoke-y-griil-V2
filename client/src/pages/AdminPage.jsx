"use client"
import { useAuth } from "../contex/AuthContext"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout.jsx"
import Breadcrumbs from "../pages/Breadcrumbs"
import { Users, Package, BarChart3, Settings, ArrowRight, Clock, Calendar } from "lucide-react"

const AdminPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async () => {
    console.log("object")
    logout()
  }

  // Accesos rápidos a las secciones existentes
  const quickActions = [
    {
      title: "Gestionar Usuarios",
      description: "Administrar cuentas de usuario",
      icon: Users,
      color: "bg-blue-500",
      route: "/configuracion",
    },
    {
      title: "Productos",
      description: "Gestionar catálogo de productos",
      icon: Package,
      color: "bg-green-500",
      route: "/productos",
    },
    {
      title: "Reportes",
      description: "Ver estadísticas y reportes",
      icon: BarChart3,
      color: "bg-purple-500",
      route: "/reportes",
    },
    {
      title: "Configuración",
      description: "Perfil de la empresa",
      icon: Settings,
      color: "bg-gray-500",
      route: "/empresa",
    },
  ]

  const currentTime = new Date()
  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Breadcrumbs />

        {/* Header mejorado con saludo personalizado */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Bienvenido, {user?.nombre || "Administrador"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Panel de control de Smoke & Grill - Gestiona tu negocio desde aquí
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="flex items-center gap-2 text-xl font-mono font-bold text-orange-600 dark:text-orange-400">
                <Clock size={20} />
                {formatTime(currentTime)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Calendar size={14} />
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Sección principal mejorada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenido principal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                ¡Bienvenido al Panel de Administrador!
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
                Aquí puedes gestionar toda la información de Smoke & Grill. Utiliza los accesos rápidos para navegar por
                las diferentes secciones.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/reportes")}
                  className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center gap-2"
                >
                  Ver Reportes y Estadísticas
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate("/productos")}
                  className="w-full md:w-80 h-12 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center gap-2"
                >
                  Gestionar Productos
                  <Package size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta de estadísticas visuales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <div className="text-white text-6xl">🏪</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smoke & Grill</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Sistema de gestión integral para tu restaurante</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Disponible</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seguro</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.route)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Explora las diferentes secciones del panel para gestionar tu restaurante de manera eficiente.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminPage
