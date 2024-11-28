import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación
import { useTheme } from "../contex/ThemeContext"; // Importamos el contexto del modo oscuro

const ClientPage = () => {
  const { logout } = useAuth(); // Usamos la función de logout desde el contexto
  const { isDarkMode } = useTheme(); // Usamos el estado del modo oscuro

  const handleSignup = async () => {
    console.log("Cerrando sesión...");
    logout();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-4 shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-black text-white"}`}>
        {/* Logo and navigation */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <nav>
            <ul className="flex space-x-4">
              <li className="hover:text-gray-400 cursor-pointer">Inicio</li>
              <li className="hover:text-gray-400 cursor-pointer">Perfil</li>
              <li className="hover:text-gray-400 cursor-pointer">Pedidos</li>
            </ul>
          </nav>
        </div>
        {/* Logout option */}
        <button className="hover:text-gray-400 cursor-pointer" onClick={handleSignup}>
          Cerrar Sesión
        </button>
      </header>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            ¡Bienvenido a tu Panel de Usuario!
          </h1>
          <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
            Aquí puedes gestionar tus pedidos y actualizar tu información personal.
          </p>
          <button className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition">
            Ver mis pedidos
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400"
            alt="Dashboard Illustration"
            className="w-full"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 px-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"}`}>
        <div className="container mx-auto flex justify-between">
          <div>
            <img src={logo} alt="Logo" className="h-16" />
          </div>
          <div className="flex space-x-12">
            <ul className="space-y-2">
              <li>Servicios</li>
              <li>Ayuda</li>
              <li>Soporte</li>
            </ul>
            <ul className="space-y-2">
              <li>Privacidad</li>
              <li>Términos</li>
              <li>Contacto</li>
            </ul>
            <div className="flex space-x-4">
              <i className="fab fa-facebook text-2xl"></i>
              <i className="fab fa-instagram text-2xl"></i>
              <i className="fab fa-twitter text-2xl"></i>
              <i className="fab fa-tiktok text-2xl"></i>
            </div>
          </div>
        </div>
        <p className={`text-center mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
          © 2024 smoke & grill. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ClientPage;

