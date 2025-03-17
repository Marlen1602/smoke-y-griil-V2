import React from "react";
import { Link } from "react-router-dom";
import Header from "./PrincipalNavBar";
import Footer from './footer.jsx';
import logo from "../assets/logo.png";
import confusedGrill from "../assets/error400.png"; // Imagen de la parrilla confundida

const Error400 = () => (
  <div className="bg-gradient-to-br text-gray-900 min-h-screen flex flex-col">
    
    {/* Header */}
    <Header />

    {/* Contenido Principal */}
    <div className="flex flex-col items-center justify-center flex-grow text-center px-6 relative">
      
      {/* Ilustración */}
      <div className="relative w-full max-w-md">
        <img
          src={confusedGrill}
          alt="Parrilla confundida"
          className="w-64 md:w-80 mx-auto drop-shadow-lg "
        />
      </div>

      {/* Texto de Error */}
      <h1 className="text-6xl font-extrabold text-orange-600 mt-6 drop-shadow-md">
        ¡400!
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        ¡Algo no está bien con tu pedido! 🤔
      </h2>
      <p className="text-lg text-gray-600 mt-3 max-w-lg">
        Parece que hubo un error en la solicitud. Verifica la información e intenta nuevamente.
      </p>

      {/* Botón de Regresar */}
      <Link
        to="/"
        className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all transform hover:scale-105"
      >
        🔄 Volver al Inicio
      </Link>
    </div>
    <Footer/>
  </div>
);

export default Error400;
