import { useAuth } from "../contex/AuthContext"; 
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getPreguntasRequest } from "../api/auth.js";
import Breadcrumbs from "../pages/Breadcrumbs";
import ClientLayout from "../layouts/ClientLayaut.jsx";

const ClientPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [preguntas, setPreguntas] = useState([]);

  // 🔹 Redirigir al login si el usuario no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.warn("⛔ No autenticado, redirigiendo a login...");
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // 🔹 Obtener preguntas frecuentes
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await getPreguntasRequest();
        setPreguntas(response.data);
      } catch (error) {
        console.error("Error al obtener preguntas frecuentes:", error);
      }
    };

    fetchPreguntas();
  }, []);

  // 🔹 Mostrar u ocultar respuestas
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // ⏳ Si todavía está cargando la autenticación, mostramos un mensaje
  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  // 🚨 Si el usuario no existe, evitar errores y mostrar mensaje
  if (!user) {
    return <p className="text-center text-red-500">Error: No se pudo cargar la información del usuario.</p>;
  }

  return (
    <ClientLayout>
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className={`text-5xl font-bold mb-4 text-gray-800`}>
            ¡Bienvenido, {user?.username || "Usuario"}!
          </h1>
          <p className={`text-lg mb-6 text-gray-800`}>
            Aquí puedes gestionar tus pedidos y actualizar tu información personal.
          </p>
          <button className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition">
            Ver mis pedidos
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400"
            alt="Dashboard Illustration"
            className="w-full"
          />
        </div>
      </main>

      {/* Sección de Preguntas Frecuentes */}
      <section className="bg-gray-100 dark:bg-gray-800 py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          ¿Necesitas Ayuda?
        </h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {preguntas.length > 0 ? (
            preguntas.map((faq, index) => (
              <div key={faq.id} className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-700">
                <button
                  className="w-full text-left flex justify-between items-center font-semibold text-gray-800 dark:text-white"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.pregunta}
                  <span>{activeFaq === index ? "▲" : "▼"}</span>
                </button>
                {activeFaq === index && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.respuesta}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Cargando preguntas...</p>
          )}
        </div>
      </section>

      </ClientLayout>

  );
};

export default ClientPage;
