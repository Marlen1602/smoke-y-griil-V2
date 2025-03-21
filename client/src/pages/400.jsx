import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../contex/AuthContext"
import AdminLayout from "../layouts/AdminLayout.jsx"
import UserLayout from "../layouts/ClientLayaut.jsx"
import PublicLayout from "../layouts/PublicLayaut.jsx"
import serverErrorImage from "../assets/error500.png" // Asegúrate de tener esta imagen

const Error500 = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  // Contenido principal de la página de error
  const pageContent = (
    <div className="flex flex-col items-center justify-center flex-grow text-center px-6 py-12 relative">
      {/* Ilustración */}
      <div className="relative w-full max-w-md">
        <img
          src={serverErrorImage || "/placeholder.svg"}
          alt="Error del servidor"
          className="w-64 md:w-80 mx-auto drop-shadow-lg"
        />
      </div>

      {/* Texto de Error */}
      <h1 className="text-6xl font-extrabold text-orange-600 mt-6 drop-shadow-md">¡500!</h1>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">¡Error del servidor! 🔧</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-lg">
        Lo sentimos, algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo.
      </p>

      {/* Botón de Regresar */}
      <Link
        to="/"
        className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all transform hover:scale-105"
      >
        🔄 Intentar nuevamente
      </Link>
    </div>
  )

  // Renderizar con el layout apropiado según el tipo de usuario
  if (!isAuthenticated || !user) {
    return <PublicLayout>{pageContent}</PublicLayout>
  }

  switch (user.tipoUsuarioId) {
    case 1: // Administrador
      return <AdminLayout>{pageContent}</AdminLayout>
    case 2: // Cliente
      return <UserLayout>{pageContent}</UserLayout>
    default:
      return <PublicLayout>{pageContent}</PublicLayout>
  }
}

export default Error500

