import React, { useState } from 'react';
import AuthModal from './AuthModal'; // Asegúrate de importar el componente modal
import imagen from '../assets/image.png';
import logo from '../assets/logo.png';
import { useTheme } from "../contex/ThemeContext.jsx" // Importa el contexto para el modo oscuro

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme(); // Obtener el estado y la función para alternar el modo oscuro

  const handleLoginClick = () => {
    setShowModal(true); // Abre el modal cuando el usuario hace clic en "Ingreso"
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  return (
    <div className={`bg-white dark:bg-gray-900 dark:text-white min-h-screen`}>
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center p-4 shadow-md bg-black dark:bg-gray-800">
        {/* Menú y logo */}
        <div className="flex items-center space-x-4">
          <button className="text-white text-2xl">
            <i className="fas fa-bars"></i>
          </button>
          <img src={logo} alt="Logo" className="h-16 md:h-24 w-auto" />
          <div className="hidden md:flex items-center text-sm text-gray-400 dark:text-gray-300">
            <i className="fas fa-map-marker-alt"></i>
            <span className="ml-1">Ubicación</span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full md:flex-1 mx-0 md:mx-6 my-4 md:my-0">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Iconos de ingreso, carrito y modo oscuro */}
        <div className="flex items-center space-x-6 text-white">
          <button
            onClick={toggleTheme}
            className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <i className="fas fa-search text-xl"></i>
          <div className="flex items-center text-sm">
            <i
              className="fas fa-user text-xl cursor-pointer"
              onClick={handleLoginClick}
            ></i>
            <span
              className="ml-2 cursor-pointer"
              onClick={handleLoginClick}
            >
              Ingreso
            </span>
          </div>
          <i className="fas fa-shopping-cart text-xl"></i>
        </div>
      </header>

      {/* Modal de autenticación */}
      {showModal && <AuthModal onClose={handleCloseModal} />}

      {/* Sección principal */}
      <main className="flex flex-col md:flex-row items-center justify-center p-6 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2">
          <img src={imagen} alt="imagen" className="w-3/4 mx-auto md:w-full" />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            ¡Disfruta de envío gratis!
          </h1>
          <p className="text-lg text-gray-800 dark:text-gray-300 mb-4">
            Para todos tus platillos favoritos
          </p>
          <button
            className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition"
            onClick={handleLoginClick}
          >
            ¡Pide ahora!
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto flex flex-wrap justify-between space-y-6 md:space-y-0">
          <div className="w-full md:w-auto">
            <img src={logo} alt="Logo" className="h-12 mx-auto md:mx-0" />
          </div>
          <div className="w-full md:w-auto flex flex-wrap justify-around md:justify-between space-y-4 md:space-y-0">
            <ul className="space-y-2 text-center md:text-left">
              <li>Misión</li>
              <li>Quiénes Somos</li>
              <li>Visión</li>
              <li>Comentarios</li>
            </ul>
            <ul className="space-y-2 text-center md:text-left">
              <li>Consumo Responsable</li>
              <li>Términos y Condiciones</li>
              <li>Aviso de Privacidad</li>
            </ul>
            <div className="flex justify-center md:justify-start space-x-4">
              <i className="fab fa-facebook text-2xl"></i>
              <i className="fab fa-instagram text-2xl"></i>
              <i className="fab fa-twitter text-2xl"></i>
              <i className="fab fa-tiktok text-2xl"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;