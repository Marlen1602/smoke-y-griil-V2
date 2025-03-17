import React, { useState, useEffect } from "react";
import { useAuth } from "../contex/AuthContext";
import { Link } from "react-router-dom";
import { getEmpresaProfile } from "../api/auth.js";
import { useTheme } from "../contex/ThemeContext.jsx";

const AdminNavBar = () => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // Estado para el menú móvil
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado del menú desplegable
  const { isDarkMode, toggleTheme } = useTheme();
   const [empresa, setEmpresa] = useState({ Logo: ""});

   useEffect(() => {
      const fetchEmpresaData = async () => {
        try {
          const response = await getEmpresaProfile();
          setEmpresa(response.data);
        } catch (error) {
          console.error("Error al cargar logo", error);
        }
      };
      fetchEmpresaData();
    }, []);

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
        {empresa.Logo && <img src={empresa.Logo} className="h-12 w-auto" />}
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

          {/* Nuevo menú desplegable */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-gray-300 flex items-center space-x-2"
            >
              <span>Documentos Regulatorios</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48">
                <Link
                  to="/politicas"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Políticas de Privacidad
                </Link>
                <Link
                  to="/terminosCondiciones"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Términos y Condiciones
                </Link>
                <Link
                  to="/deslindeLegal"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Deslinde Legal
                </Link>
              </div>
            )}
          </div>

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
        <button
          className="hidden md:block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={logout}
        >
          Cerrar Sesión
        </button>

        {/* Botón para abrir el menú móvil */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-black text-white">
          <ul className="space-y-4 p-4">
            <li>
              <Link
                to="/paginaAdministrador"
                className="block hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/empresa"
                className="block hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Perfil de la empresa
              </Link>
            </li>
            <li>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="block hover:text-gray-300 w-full text-left"
              >
                Documentos Regulatorios
              </button>
              {dropdownOpen && (
                <ul className="pl-4 space-y-2">
                  <li>
                    <Link
                      to="/politicas"
                      className="block hover:text-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Políticas de Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terminosCondiciones"
                      className="block hover:text-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/deslindeLegal"
                      className="block hover:text-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Deslinde Legal
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                to="/incidencias"
                className="block hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Monitor de incidencias
              </Link>
            </li>
            <li>
              <Link
                to="/configuracion"
                className="block hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                usuarios
              </Link>
            </li>
            <li>
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={logout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default AdminNavBar;
