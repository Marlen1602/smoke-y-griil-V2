import React from "react";
import { Link } from "react-router-dom";
import Header from "./PrincipalNavBar";
import logo from "../assets/logo.png";
import Footer from './footer.jsx';
import sadBurger from "../assets/hamburguesa.png";

const Error404 = () => {
  return (
    <div className="bg-gradient-to-br text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenido de la Página */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-6 relative">
        {/* Ilustración de Error */}
        <div className="relative w-80 max-w-80">
          <img src={sadBurger} alt="Hamburguesa triste" />
        </div>

        {/* Texto de Error */}
        <h1 className="text-7xl font-extrabold text-orange-600 mt-0 drop-shadow-md">
          ¡404!
        </h1>
        <h2 className="text-3xl font-bold text-gray-700 mt-2">
          ¡Oops! La cocina está vacía...
        </h2>
        <p className="text-lg text-gray-500 mt-3 max-w-lg">
          Parece que este plato no está en nuestro menú. ¿Te gustaría volver a la página principal?
        </p>

        {/* Botón de Volver */}
        <Link
          to="/"
          className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg transition-all transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
<Footer/>
    </div>
  );
};

export default Error404;