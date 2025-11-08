import React, { useState, useEffect } from "react";
import { getEmpresaProfile } from "../api/auth";
import Header from "./PrincipalNavBar";
import Breadcrumbs from "../pages/Breadcrumbs.jsx";
import Footer from "../pages/footer";

const UbicacionPage = () => {
  const [empresa, setEmpresa] = useState({ Direccion: "", Horario: "", Nombre: "" });
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelMode, setTravelMode] = useState("driving"); // 'driving' o 'walking'

  // Coordenadas del restaurante Smoke & Grill
  const restauranteCoords = { lat: 21.1350343, lon: -98.4144672 };

  // === Obtener información de la empresa ===
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

  // === Fórmula de Haversine (calcular distancia en km) ===
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distancia en kilómetros
  };

  // === Obtener ubicación del usuario ===
  const obtenerUbicacion = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, lon });
          setError(null);

          const dist = calcularDistancia(lat, lon, restauranteCoords.lat, restauranteCoords.lon);
          setDistance(dist.toFixed(2));
        },
        (err) => {
          setError("No se pudo obtener tu ubicación. Activa el GPS o concede permisos.");
          console.error("Error al obtener ubicación:", err);
        }
      );
    } else {
      setError("La geolocalización no está disponible en este dispositivo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header />
      <Breadcrumbs />

      <div className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-8">
          📍 Ubicación de {empresa.Nombre || "Smoke & Grill"}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-10">
          {/* 📌 Mapa del restaurante */}
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

            {/* 🔸 Botón para activar geolocalización */}
            <div className="mt-6 text-center">
              <button
                onClick={obtenerUbicacion}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-700 transition"
              >
                Obtener mi ubicación actual
              </button>
            </div>

            {/*  Mostrar distancia y opciones */}
            {userLocation && distance && (
              <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                <p className="font-semibold">Tu ubicación fue detectada correctamente.</p>
                <p>
                  Estás a <strong>{distance} km</strong> de {empresa.Nombre || "Smoke & Grill"} 🚶‍♂️
                </p>

                {/* Selector de modo de viaje */}
                <div className="mt-3 flex justify-center items-center space-x-3">
                  <label className="font-medium">Modo de viaje:</label>
                  <select
                    value={travelMode}
                    onChange={(e) => setTravelMode(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-800 dark:text-white"
                  >
                    <option value="driving">🚗 En auto</option>
                    <option value="walking">🚶‍♀️ Caminando</option>
                  </select>
                </div>

                {/* Botón para abrir Google Maps */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${restauranteCoords.lat},${restauranteCoords.lon}&travelmode=${travelMode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-lg transition"
                >
                  Ver ruta en Google Maps 🗺️
                </a>
              </div>
            )}

            {/* Mostrar errores */}
            {error && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* 📌 Información del restaurante */}
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
