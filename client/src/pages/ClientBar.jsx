import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../contex/AuthContext"
import { useTheme } from "../contex/ThemeContext"

const ClientNavBar = () => {
  const { logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignup = async () => {
    console.log("Cerrando sesión...")
    logout()
  }

  return (
    <header className="flex flex-col shadow-md text-white bg-gray-950 dark:bg-gray-800 relative">
      {/* Barra principal del header */}
      <div className="flex flex-wrap justify-between items-center p-4 mt-4">
        {/* Logo and navigation */}
        <div className="flex items-center space-x-4">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="h-16 w-auto" />
          <nav>
            <ul className="flex space-x-4">
              <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/inicioCliente")}>
                Inicio
              </li>
              <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/perfil")}>
                Perfil
              </li>
              <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/pedidos")}>
                Pedidos
              </li>
              <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/MenuPrincipal")}>
                Menú
              </li>
            </ul>
          </nav>
        </div>

        {/* Iconos de ingreso, carrito y modo oscuro */}
        <div className="flex items-center space-x-6 text-white">
          <button
            onClick={toggleTheme}
            className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <i className="fas fa-shopping-cart text-xl cursor-pointer" onClick={() => navigate("/carrito")}></i>
          <button className="hover:text-gray-400 cursor-pointer" onClick={handleSignup}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default ClientNavBar

