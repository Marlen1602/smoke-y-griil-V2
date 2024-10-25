import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación

const ClientPage = () => {
  const { logout } = useAuth(); // Usamos la función de login desde el contexto
  const handleSignup = async () => {
    console.log("object")
    logout();
  }
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md bg-black">
        {/* Logo and navigation */}
        <div className="text-white flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <nav className="text-white">
            <ul className="flex space-x-4">
              <li className="hover:text-gray-300 cursor-pointer">Inicio</li>
              <li className="hover:text-gray-300 cursor-pointer">Perfil</li>
              <li className="hover:text-gray-300 cursor-pointer">Pedidos</li>
            </ul>
          </nav>
        </div>
        {/* Logout option */}
        <button className="text-white cursor-pointer" onClick={handleSignup}>Cerrar Sesión</button>
      </header>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">¡Bienvenido a tu Panel de Usuario!</h1>
          <p className="text-lg text-gray-800 mb-6"> Aquí puedes gestionar tus pedidos y actualizar tu información personal.</p>
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
      <footer className="bg-gray-900 text-white py-6 px-4">
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
        <p className="text-center mt-4 text-gray-400 text-sm">
          © 2024 smoke & grill. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};
export default ClientPage;
