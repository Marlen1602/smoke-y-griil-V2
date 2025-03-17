import React, { useState, useEffect } from "react";
import Footer from "../pages/Footer.jsx";
import Header from "./PrincipalNavBar";
import Breadcrumbs from "../pages/Breadcrumbs.jsx";
import { getEmpresaProfile } from "../api/auth.js";

const visionPage = () => {
  const [vision, setVision] = useState("");

  // Obtener la misión desde la base de datos
  const fetchVision = async () => {
    try {
      const response = await getEmpresaProfile();
      setVision(response.data.Vision);
    } catch (error) {
      console.error("Error al obtener la visión:", error);
    }
  };

  useEffect(() => {
    fetchVision();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* 🔹 Encabezado */}
      <Header />

      {/* 🔹 Breadcrumbs */}
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* 🔹 Contenido principal con diseño mejorado */}
      <div className="flex-grow container mx-auto px-6 py-12 flex justify-center items-center">
        <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 border-l-8 border-orange-500">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4 text-center">
            Nuestra Visión
          </h1>

          {/* 🔹 Mostrar la misión obtenida desde la BD */}
          <p className="text-lg text-gray-700 text-center">
            {vision || "Cargando misión..."}
          </p>
        </div>
      </div>

      {/* 🔹 Footer siempre pegado abajo */}
      <Footer />
    </div>
  );
};

export default visionPage;
