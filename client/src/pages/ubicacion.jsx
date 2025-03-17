import React, { useState, useEffect } from "react";
import { getEmpresaProfile } from "../api/auth";
import Header from "./PrincipalNavBar";
import Breadcrumbs from "../pages/Breadcrumbs.jsx";
import Footer from "../pages/Footer";

const UbicacionPage = () => {
  const [empresa, setEmpresa] = useState({ Direccion: "", Horario: "", Nombre: "" });

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile();
        setEmpresa(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de la empresa:", error);
      }
    };
    fetchEmpresaData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header />
      {/* 🔹 Breadcrumbs */}
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* 🔹 Contenedor con fondo atractivo */}
      <div className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-8">
          📍 Ubicación de {empresa.Nombre}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-10">
          {/* 📌 Mapa de Google */}
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <div className="overflow-hidden rounded-xl shadow-xl border-4 border-orange-500">
              <iframe
                className="w-full h-80 md:h-96"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.7507261981944!2d-98.4144672!3d21.1350343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d7269274b9b783%3A0x7e6bbe1a3c88de86!2sTaquer%C3%ADa%20Colalambre!5e0!3m2!1ses!2smx!4v1710523367223!5m2!1ses!2smx"
                allowFullScreen
                loading="lazy"
                title="Ubicación"
              ></iframe>
            </div>
          </div>

          {/* 📌 Datos de la ubicación */}
          <div className="w-full md:w-1/2 bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl text-white">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">📍 Dirección</h2>
            <p className="text-lg">{empresa.Direccion || "Cargando dirección..."}</p>

            <h2 className="text-2xl font-bold text-orange-400 mt-6 mb-4">🕒 Horarios de Atención</h2>
            <p className="text-lg">{empresa.Horario || "Cargando horarios..."}</p>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default UbicacionPage;
