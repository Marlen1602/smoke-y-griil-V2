import React, { useState, useEffect } from "react";
import { getIncidencias } from "../api/auth.js";
import AdminNavBar from "./AdminNavBar";
import Footer from './Footer.jsx';

const IncidenciasPage = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios únicos
  const [selectedUsuario, setSelectedUsuario] = useState(null); // Usuario seleccionado para mostrar incidencias
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await getIncidencias(); // Llamada a la API
        const data = response.data;

        // Obtener lista única de usuarios
        const uniqueUsuarios = Array.from(
          new Set(data.map((incidencia) => incidencia.usuario))
        );

        setUsuarios(uniqueUsuarios);
        setIncidencias(data); // Guardar todas las incidencias
        setLoading(false); // Desactivar el estado de carga
      } catch (err) {
        setError("Error al cargar las incidencias"); // Manejo de errores
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchIncidencias(); // Llamar a la función cuando se monta el componente
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Mostrar un mensaje de carga mientras las incidencias están siendo obtenidas
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <div className="text-xl font-bold animate-pulse">Cargando...</div>
      </div>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <div className="text-xl font-bold text-red">{error}</div>
      </div>
    );
  }

  // Filtrar incidencias del usuario seleccionado
  const incidenciasFiltradas = selectedUsuario
    ? incidencias.filter((incidencia) => incidencia.usuario === selectedUsuario)
    : [];

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:to-gray-800 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-4xl font-extrabold text-center mt-8 text-gray-800 dark:text-gray-100">
        Usuarios e Incidencias
      </h1>
      <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {usuarios.map((usuario, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {usuario}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Usuario con {incidencias.filter((incidencia) => incidencia.usuario === usuario).length} incidencias registradas.
              </p>
            </div>
            <button
              onClick={() => setSelectedUsuario(usuario)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md"
            >
              Ver Incidencias
            </button>
          </div>
        ))}
      </div>

      {/* Modal flotante para incidencias del usuario */}
      {selectedUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl w-full max-w-3xl relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red text-2xl transition duration-200"
              onClick={() => setSelectedUsuario(null)}
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
              Incidencias de {selectedUsuario}
            </h2>
            <div className="overflow-y-auto max-h-96">
              {incidenciasFiltradas.map((incidencia) => (
                <div
                  key={incidencia._id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 mb-4"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {incidencia.tipo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Estado:{" "}
                    <span
                      className={`font-bold ${
                        incidencia.estado ? "text-red" : "text-green-500"
                      }`}
                    >
                      {incidencia.estado ? "Bloqueado" : "Activo"}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Motivo: {incidencia.motivo}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Fecha: {new Date(incidencia.fecha).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IncidenciasPage;



