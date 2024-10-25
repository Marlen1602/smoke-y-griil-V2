import React, { useState } from 'react';
import AuthModal from './AuthModal'; // Asegúrate de importar el componente modal
import imagen from '../assets/image.png';
import logo from '../assets/logo.png';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    setShowModal(true); // Abre el modal cuando el usuario hace clic en "Ingreso"
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md bg-black">
        {/* Menú y logo */}
        <div className="text-white flex items-center space-x-4">
          <button className="text-2xl">
            <i className="fas fa-bars"></i>
          </button>
          <img src={logo} alt="Logo" className="h-24 w-auto" />
          <div className="text-white flex items-center text-sm text-white-700">
            <i className="fas fa-map-marker-alt text-white-500"></i>
            <span className="ml-1 text-white">Ubicación</span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full  p-2 rounded-full border border-black-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Iconos de ingreso y carrito */}
        <div className="flex items-center space-x-8 text-white">
          <i className="fas fa-search text-xl"></i>
          <div className="text-white-700 text-sm flex items-center">
            <i className="fas fa-user text-white-600 text-xl text-white" onClick={handleLoginClick}></i>
            <span className="ml-2 cursor-pointer text-white" onClick={handleLoginClick}>
              Ingreso
            </span>
          </div>
          <i className="fas fa-shopping-cart text-white-600 text-xl"></i>
        </div>
      </header>

      {/* Modal de autenticación */}
      {showModal && <AuthModal onClose={handleCloseModal} />}

      {/* Sección principal */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2">
          <img src={imagen} alt="imagen" className="w-4/4 mx-auto md:w-full" />
        </div>
        <div className="md:w-1/2 text-center md:text-left-2">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">¡Disfruta de envío gratis!</h1>
          <p className="text-lg text-gray-800 mb-4">Para todos tus platillos favoritos</p>
          <button
            className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition"
            onClick={handleLoginClick}
          >
            ¡Pide ahora!
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-4">
        <div className="container mx-auto flex justify-between">
          <div>
            <img src={logo} alt="Logo" className="h-16" />
          </div>
          <div className="flex space-x-72">
            <ul className="space-y-2">
              <li>Mision</li>
              <li>Quienes Somos </li>
              <li>Vision</li>
              <li>Comentarios</li>
            </ul>
            <ul className="space-y-2">
              <li>Consumo Responsable</li>
              <li>Términos y Condiciones</li>
              <li>Aviso de Privacidad</li>
            </ul>
            <div className="flex space-x-4">
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


