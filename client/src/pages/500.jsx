import React from "react";
import { Link } from "react-router-dom";
import Header from "./PrincipalNavBar";
import logo from "../assets/logo.png";
import brokenGrill from "../assets/error500.png"; // Imagen de parrilla rota

const Error500 = () => (
  <div className="bg-gradient-to-b  text-gray-900 min-h-screen flex flex-col">
    
    {/* Header */}
    <Header />

    {/* Contenido Principal */}
    <div className="flex flex-col items-center justify-center flex-grow text-center px-6 relative">
      
      {/* Ilustración de Parrilla Rota con Humo */}
      <div className="relative w-full max-w-md">
        
        {/* Imagen de Parrilla Rota */}
        <img
          src={brokenGrill}
          alt="Parrilla Rota"
          className="w-64 md:w-80 mx-auto drop-shadow-lg animate-pulse"
        />
      </div>

      {/* Mensaje de Error */}
      <h1 className="text-7xl font-extrabold text-orange-600 mt-6 drop-shadow-md">
        ¡500!
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        ¡La parrilla se rompió! 🔥
      </h2>
      <p className="text-lg text-gray-700 mt-3 max-w-lg">
        Nuestro chef está reparándola. Vuelve más tarde o intenta refrescar la página.
      </p>

      {/* Botón de Regreso */}
      <Link
        to="/"
        className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
      >
        🔄 <span>Volver al Inicio</span>
      </Link>
    </div>

    
          {/* Footer */}
                    <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 mt-10">
                      <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
                        {/* Logo */}
                        <div className="w-full md:w-auto flex justify-center md:justify-start">
                          <img src={logo} alt="Logo" className="h-12" />
                        </div>
              
                        {/* Enlaces */}
                        <div className="w-full md:w-auto flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-8">
                          <ul className="space-y-2 text-center md:text-left">
                            <li>Misión</li>
                            <li>Quiénes Somos</li>
                            <li>Visión</li>
                            
                          </ul>
                          <ul className="space-y-2 text-center md:text-left">
                            
                            <li>Términos y Condiciones</li>
                            <li>Aviso de Privacidad</li>
                          </ul>
                        </div>
              
                        {/* Redes Sociales */}
                        <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
                          <i className="fab fa-facebook text-2xl"></i>
                          <i className="fab fa-instagram text-2xl"></i>
                          <i className="fab fa-tiktok text-2xl"></i>
                        </div>
                      </div>
                    </footer>
  </div>
);

export default Error500;

