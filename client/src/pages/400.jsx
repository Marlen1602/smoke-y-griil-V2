import React from "react";

const Error400 = () => (
  <div
    className="error-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-center"
  >
    {/* Hamburguesa desarmada */}
    <div
      className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-lg"
      style={{
        animation: "float 4s ease-in-out infinite",
        borderRadius: "16px",
      }}
    >
      {/* Pan superior desordenado */}
      <div
        className="w-48 h-12 bg-yellow-500 rounded-t-full shadow-md mb-6"
        style={{
          transform: "rotate(-15deg)",
        }}
      ></div>

      {/* Ingredientes desordenados */}
      <div
        className="w-44 h-5 bg-green-500 rounded-full mb-4"
        style={{
          transform: "rotate(10deg)",
        }}
      ></div>
      <div
        className="w-44 h-5 bg-red rounded-full mb-4"
        style={{
          transform: "rotate(-8deg)",
        }}
      ></div>
      <div
        className="w-44 h-5 bg-yellow-600 rounded-full mb-4"
        style={{
          transform: "rotate(5deg)",
        }}
      ></div>

      {/* Pan inferior desordenado */}
      <div
        className="w-48 h-12 bg-yellow-400 rounded-b-full shadow-md mt-6"
        style={{
          transform: "rotate(15deg)",
        }}
      ></div>
    </div>

    {/* Texto */}
    <h1 className="text-4xl font-bold text-gray-800 mt-8">
      400 - Solicitud Incorrecta
    </h1>
    <p className="text-lg text-gray-600 mt-4">
      Parece que algo salió mal con tu solicitud. ¡Intentemos de nuevo!
    </p>
    <a
      href="/"
      className="mt-6 px-8 py-3 bg-orange-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-orange-700 hover:text-gray-100 transition-transform transform hover:scale-110"
    >
      Volver al Inicio
    </a>
  </div>
);

export default Error400;
