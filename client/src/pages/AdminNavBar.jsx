import { useState, useEffect } from "react"
import { useAuth } from "../contex/AuthContext"
import { Link } from "react-router-dom"
import { getEmpresaProfile } from "../api/auth.js"
import { useTheme } from "../contex/ThemeContext.jsx"

const AdminNavBar = () => {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false) // Estado para el menú móvil
  const { isDarkMode, toggleTheme } = useTheme()
  const [empresa, setEmpresa] = useState({ Logo: "" })

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile()
        setEmpresa(response.data)
      } catch (error) {
        console.error("Error al cargar logo", error)
      }
    }
    fetchEmpresaData()
  }, [])

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          {empresa.Logo && <img src={empresa.Logo || "/placeholder.svg"} className="h-12 w-auto" />}
          <span className="font-bold text-lg">{empresa.Nombre}</span>
        </div>

        {/* Menú para pantallas grandes */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/paginaAdministrador" className="hover:text-gray-300">
            Inicio
          </Link>
          <Link to="/empresa" className="hover:text-gray-300">
            Perfil de la empresa
          </Link>

          {/* Enlace directo a Documentos en lugar del menú desplegable */}
          <Link to="/documentos" className="hover:text-gray-300">
            Documentos Regulatorios
          </Link>

          <Link to="/incidencias" className="hover:text-gray-300">
            Monitor de incidencias
          </Link>
          <Link to="/configuracion" className="hover:text-gray-300">
            usuarios
          </Link>
          <Link to="/productos" className="hover:text-gray-300">
            Productos
          </Link>
        </nav>

        {/* Modo oscuro */}
        <button
          onClick={toggleTheme}
          className="ml-auto bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        {/* Botón Cerrar Sesión */}
        <button className="hidden md:block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={logout}>
          Cerrar Sesión
        </button>

        {/* Botón para abrir el menú móvil */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-black text-white">
          <ul className="space-y-4 p-4">
            <li>
              <Link to="/paginaAdministrador" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/empresa" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>
                Perfil de la empresa
              </Link>
            </li>
            <li>
              <Link to="/documento" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>
                Documentos Regulatorios
              </Link>
            </li>
            <li>
              <Link to="/incidencias" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>
                Monitor de incidencias
              </Link>
            </li>
            <li>
              <Link to="/configuracion" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>
                usuarios
              </Link>
            </li>
            <li>
              <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={logout}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default AdminNavBar

