import { useState, useEffect } from "react"
import { useAuth } from "../contex/AuthContext"
import { Link } from "react-router-dom"
import { getEmpresaProfile } from "../api/auth.js"
import Footer from "../pages/Footer.jsx"
import { useTheme } from "../contex/ThemeContext.jsx"

const AdminLayout = ({ children }) => {
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

  // Aplicar clase dark al elemento html cuando isDarkMode es true
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Aplicar estilos globales para elementos de formulario en modo oscuro
    const style = document.createElement("style")
    if (isDarkMode) {
      style.textContent = `
        .dark input, 
        .dark textarea, 
        .dark select {
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
          border-color: #374151 !important;
        }
        .dark input::placeholder, 
        .dark textarea::placeholder {
          color: #9ca3af !important;
        }
        .dark .bg-white {
          background-color: #1f2937 !important;
        }
        .dark .text-gray-700 {
          color: #f3f4f6 !important;
        }
        .dark .border-gray-200 {
          border-color: #374151 !important;
        }
      `
    } else {
      style.textContent = ""
    }

    // Añadir o actualizar el estilo en el head
    const existingStyle = document.getElementById("dark-mode-styles")
    if (existingStyle) {
      existingStyle.remove()
    }
    style.id = "dark-mode-styles"
    document.head.appendChild(style)

    return () => {
      if (document.getElementById("dark-mode-styles")) {
        document.getElementById("dark-mode-styles").remove()
      }
    }
  }, [isDarkMode])

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar - oculto en móviles */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 shadow-md">
        {/* Logo en la parte superior del sidebar */}
        <div className="p-4 border-b dark:border-gray-700">
          {empresa.Logo && <img src={empresa.Logo || "/placeholder.svg"} className="h-12 w-auto" alt="Logo" />}
          <span className="font-bold text-lg dark:text-white">{empresa.Nombre}</span>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/paginaAdministrador"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/empresa"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Perfil de la empresa
              </Link>
            </li>
            <li>
              <Link
                to="/documentos"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Documentos Regulatorios
              </Link>
            </li>
            <li>
              <Link
                to="/incidencias"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Monitor de incidencias
              </Link>
            </li>
            <li>
              <Link
                to="/configuracion"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Usuarios
              </Link>
            </li>
            <li>
              <Link
                to="/productos"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Productos
              </Link>
            </li>
            <li>
              <Link
                to="/predicciones"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Predicciones
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón de modo oscuro y cerrar sesión */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center p-2 w-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mb-2"
          >
            {isDarkMode ? (
              <>
                <svg
                  className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                Modo Claro
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-3 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Modo Oscuro
              </>
            )}
          </button>
          <button
            onClick={logout}
            className="flex items-center p-2 w-full text-red hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal - ocupa todo el ancho en móviles */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
        {/* Barra superior para móviles */}
        <div className="md:hidden bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center">
            {empresa.Logo && <img src={empresa.Logo || "/placeholder.svg"} className="h-8 w-auto mr-2" alt="Logo" />}
            <span className="font-bold dark:text-white">{empresa.Nombre}</span>
          </div>
          <button
            className="text-gray-700 dark:text-gray-200 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
            <ul className="p-4 space-y-2">
              <li>
                <Link
                  to="/paginaAdministrador"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/empresa"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Perfil de la empresa
                </Link>
              </li>
              <li>
                <Link
                  to="/documentos"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Documentos Regulatorios
                </Link>
              </li>
              <li>
                <Link
                  to="/incidencias"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Monitor de incidencias
                </Link>
              </li>
              <li>
                <Link
                  to="/configuracion"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Usuarios
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/predicciones"
                  className="block p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Predicciones
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {isDarkMode ? "🌞 Modo Claro" : "🌙 Modo Oscuro"}
                </button>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="flex items-center w-full p-2 text-red hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Contenido de la página */}
        <div className="flex-grow p-4 text-gray-900 dark:text-gray-100">{children}</div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}

export default AdminLayout

