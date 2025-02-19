import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contex/ThemeContext.jsx";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";
import { useSearch } from "../contex/SearchContext"; // Importar el contexto


const Header = ({ onSearch }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/menu");
    }
  };

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleOpenMaps = () => {
    const mapsUrl =
      "https://www.google.com/maps/place/Taquer%C3%ADa+Colalambre/@21.1349955,-98.4144672,3a,50.7y,283.47h,95.72t/data=!3m7!1e1!3m5!1sRUiW18igZu3ViDDHkDQfwg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-5.7182727014298536%26panoid%3DRUiW18igZu3ViDDHkDQfwg%26yaw%3D283.46798647937777!7i16384!8i8192!4m7!3m6!1s0x85d7269274b9b783:0x7e6bbe1a3c88de86!8m2!3d21.1350343!4d-98.4143591!10e5!16s%2Fg%2F11c0py_n1c?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D";
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-900  dark:text-white">
      {/* Encabezado con fondo negro y Breadcrumbs bien alineados */}
      <header class="flex flex-col shadow-md text-gray-950 bg-gray-950 dark:bg-gray-800 relative">
        {/* Contenedor del menú principal */}
        <div className="flex flex-wrap justify-between items-center p-4 mt-4">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-4">
            <button className="text-white text-2xl" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </button>
            <img src={logo} alt="Logo" className="h-16 md:h-24 w-auto" />

            {/* Ubicación con texto blanco */}
            <div
              className="hidden md:flex items-center text-white cursor-pointer"
              onClick={handleOpenMaps}
            >
              <i className="fas fa-map-marker-alt text-xl"></i>
              <span className="ml-1">Ubicación</span>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="w-full md:flex-1 mx-0 md:mx-6 my-4 md:my-0 flex items-center space-x-2 ">
          <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 flex">
            <input
              type="text"
              placeholder="Buscar en el menú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-full border dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button type="submit">
              <i className="fas fa-search text-xl text-white dark:text-white cursor-pointer ml-2"></i>
            </button>
          </form>
          </div>

          {/* Iconos de ingreso, carrito y modo oscuro */}
          <div className="flex items-center space-x-6 text-white">
            <button
              onClick={toggleTheme}
              className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <div className="flex items-center text-sm cursor-pointer" onClick={handleLoginClick}>
              <i className="fas fa-user text-xl"></i>
              <span className="ml-2">Ingreso</span>
            </div>
            <i className="fas fa-shopping-cart text-xl"></i>
          </div>
        </div>
      </header>
      {/* Modal de autenticación */}
      {showModal && <AuthModal onClose={handleCloseModal} />}

      {/* Menú lateral */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div
            className="absolute left-0 top-0 w-64 h-full bg-gray-950 dark:bg-gray-800 shadow-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-gray-500 dark:text-gray-300 text-xl mb-4"
              onClick={toggleMenu}
            >
              ✖
            </button>
            <nav className="space-y-4">
              <Link
                to="/menu"
                className="block text-white dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Menú
              </Link>
              <Link
                to="/reservaciones"
                className="block text-white dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Reservaciones
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

