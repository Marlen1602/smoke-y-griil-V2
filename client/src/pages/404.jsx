import React from "react";

const Error404 = () => (
  <div
    className="error-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-center"
    >
    {/* Cuerda */}
    <div className="h-20 w-1 bg-gray-600"></div>

    {/* Hamburguesa */}
    <div
      className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-lg"
      style={{
        animation: "float 4s ease-in-out infinite",
        borderRadius: "16px",
      }}
    >
      {/* Pan superior */}
      <div className="w-48 h-12 bg-yellow-500 rounded-t-full shadow-md relative">
        <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-4 left-10 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-3 right-6 w-2 h-2 bg-white rounded-full"></div>

        {/* Cara triste */}
        <div className="absolute flex flex-col items-center justify-center w-full h-full">
          {/* Ojos */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          {/* Boca triste */}
          <div
            className="mt-2 text-black text-3xl font-bold"
            style={{
              transform: "rotate(90deg)",
              display: "inline-block",
            }}
          >
            (
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="w-44 h-5 bg-green-500 rounded-full my-0.5"></div>
      <div className="w-44 h-5 bg-red rounded-full my-0.5"></div>
      <div className="w-44 h-5 bg-yellow-600 rounded-full my-0.5"></div>

      {/* Pan inferior */}
      <div className="w-48 h-12 bg-yellow-400 rounded-b-full shadow-md"></div>
    </div>

    {/* Texto */}
    <h1 className="text-4xl font-bold text-gray-800 mt-8">
      404 - ¡Página No Encontrada!
    </h1>
    <p className="text-lg text-gray-600 mt-4">
      Parece que esta página se escapó del menú.
    </p>
    <a
      href="/"
      className="mt-6 px-8 py-3 bg-orange-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-orange-700 hover:text-gray-100 transition-transform transform hover:scale-110"
    >
      Volver al Inicio
    </a>
  </div>
);

export default Error404;
