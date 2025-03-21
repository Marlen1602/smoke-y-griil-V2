import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../contex/AuthContext"
import AdminLayout from "../layouts/AdminLayout.jsx"
import UserLayout from "../layouts/ClientLayaut.jsx"
import PublicLayout from "../layouts/PublicLayaut.jsx"
import sadBurger from "../assets/hamburguesa.png"

const Error404 = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  // Contenido principal de la página de error
  const pageContent = (
    <div className="flex flex-col items-center justify-center flex-grow text-center px-6 py-8 relative">
      {/* Ilustración de Error */}
      <div className="relative w-80 max-w-80">
        <img src={sadBurger || "/placeholder.svg"} alt="Hamburguesa triste" className="drop-shadow-lg" />
      </div>

      {/* Texto de Error */}
      <h1 className="text-7xl font-extrabold text-orange-600 mt-0 drop-shadow-md">¡404!</h1>
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mt-2">¡Oops! La cocina está vacía...</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mt-3 max-w-lg">
        Parece que este plato no está en nuestro menú. ¿Te gustaría volver a la página principal?
      </p>

      {/* Botón de Volver */}
      <Link
        to="/"
        className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg transition-all transform hover:scale-105"
      >
        Volver al inicio
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

export default Error404

