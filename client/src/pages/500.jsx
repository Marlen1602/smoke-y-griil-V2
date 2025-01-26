import React from "react";

const Error500 = () => (
  <div
    className="error-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 text-center text-white"
  >
    {/* Hamburguesa quemada */}
    <div
      className="relative flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg"
      style={{
        animation: "shake 0.5s infinite",
        borderRadius: "16px",
      }}
    >
      {/* Pan superior quemado */}
      <div
        className="w-48 h-12 bg-gray-600 rounded-t-full shadow-md relative"
      ></div>

      {/* Ingredientes quemados */}
      <div className="w-44 h-5 bg-gray-500 rounded-full my-1"></div>
      <div className="w-44 h-5 bg-gray-600 rounded-full my-1"></div>
      <div className="w-44 h-5 bg-gray-700 rounded-full my-1"></div>

      {/* Pan inferior quemado */}
      <div
        className="w-48 h-12 bg-gray-700 rounded-b-full shadow-md"
      ></div>
    </div>

    {/* Texto */}
    <h1 className="text-4xl font-bold text-white mt-8">
      500 - Error Interno del Servidor
    </h1>
    <p className="text-lg text-gray-300 mt-4">
      Algo salió mal en nuestro lado de la cocina. Estamos trabajando para
      solucionarlo. Por favor, vuelve más tarde.
    </p>
    <a
      href="/"
      className="mt-6 px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 hover:text-gray-100 transition-transform transform hover:scale-110"
    >
      Volver al Inicio
    </a>
  </div>
);

export default Error500;
