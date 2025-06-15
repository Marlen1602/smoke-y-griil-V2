"use client"

import { useAuth } from "../contex/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getPreguntasRequest } from "../api/auth.js"
import Breadcrumbs from "../pages/Breadcrumbs"
import ClientLayout from "../layouts/ClientLayaut.jsx"

const ClientPage = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState(null)
  const [preguntas, setPreguntas] = useState([])

  // 🔹 Redirigir al login si el usuario no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.warn("⛔ No autenticado, redirigiendo a login...")
      navigate("/login")
    }
  }, [loading, isAuthenticated, navigate])

  // 🔹 Obtener preguntas frecuentes
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await getPreguntasRequest()
        setPreguntas(response.data)
      } catch (error) {
        console.error("Error al obtener preguntas frecuentes:", error)
      }
    }

    fetchPreguntas()
  }, [])

  //Navegar por mis pedidos
  const handleVerMisPedidos = () => {
    navigate("/pedidos")
  }

  // 🔹 Mostrar u ocultar respuestas
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // ⏳ Si todavía está cargando la autenticación, mostramos un mensaje
  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>
  }

  // 🚨 Si el usuario no existe, evitar errores y mostrar mensaje
  if (!user) {
    return <p className="text-center text-red">Error: No se pudo cargar la información del usuario.</p>
  }

  return (
    <ClientLayout>
      <Breadcrumbs />

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes bounce-letters {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 165, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.8);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animated-text {
          background: linear-gradient(-45deg, #ff6b35, #f7931e, #ffcc02, #ff6b35);
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bounce-letter {
          display: inline-block;
          animation: bounce-letters 2s infinite;
        }

        .bounce-letter:nth-child(1) { animation-delay: 0.1s; }
        .bounce-letter:nth-child(2) { animation-delay: 0.2s; }
        .bounce-letter:nth-child(3) { animation-delay: 0.3s; }
        .bounce-letter:nth-child(4) { animation-delay: 0.4s; }
        .bounce-letter:nth-child(5) { animation-delay: 0.5s; }
        .bounce-letter:nth-child(6) { animation-delay: 0.6s; }
        .bounce-letter:nth-child(7) { animation-delay: 0.7s; }
        .bounce-letter:nth-child(8) { animation-delay: 0.8s; }
        .bounce-letter:nth-child(9) { animation-delay: 0.9s; }
        .bounce-letter:nth-child(10) { animation-delay: 1s; }

        .location-card {
          animation: pulse-glow 2s infinite, float 3s ease-in-out infinite;
        }

        .delivery-zone {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className={`text-5xl font-bold mb-4 text-gray-800`}>¡Bienvenido, {user?.username || "Usuario"}!</h1>
          <p className={`text-lg mb-6 text-gray-800`}>
            Aquí puedes gestionar tus pedidos y actualizar tu información personal.
          </p>
          <button
            onClick={handleVerMisPedidos}
            className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition"
          >
            Ver mis pedidos
          </button>
        </div>

        {/* Sección animada de ubicación */}
        <div className="md:w-1/2 flex flex-col items-center space-y-6">
          {/* Nombre del restaurante animado */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="animated-text">
                {"SABOR EXPRESS".split("").map((letter, index) => (
                  <span key={index} className="bounce-letter">
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-semibold">🍕 Tu restaurante favorito 🍔</p>
          </div>

          {/* Tarjeta de ubicación */}
          <div className="location-card bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border-4 border-orange-400">
            <div className="text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nuestra Ubicación</h3>
              <p className="text-gray-600 mb-4">
                <strong>Av. Principal #123</strong>
                <br />
                Colonia Centro
                <br />
                Ciudad, Estado 12345
              </p>

              <div className="bg-green-100 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-semibold text-sm">✅ Zona de entrega activa</p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Radio: 5km</span>
              </div>
            </div>
          </div>

          {/* Zona de entrega */}
          <div className="delivery-zone rounded-2xl p-6 text-white text-center max-w-sm w-full">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-xl font-bold mb-3">Zona de Entrega</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Centro Histórico</span>
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Colonia Norte</span>
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Zona Residencial</span>
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Área Comercial</span>
              </p>
            </div>

            <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
              <p className="text-xs font-semibold">⚡ Entrega en 30-45 minutos</p>
              <p className="text-xs">Solo en zonas cercanas</p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white text-center max-w-sm w-full">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold">¡Importante!</span>
            </div>
            <p className="text-sm">
              Verificamos tu dirección antes de confirmar el pedido para asegurar que esté dentro de nuestra zona de
              entrega.
            </p>
          </div>
        </div>
      </main>

      {/* Sección de Preguntas Frecuentes */}
      <section className="bg-gray-100 dark:bg-gray-800 py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">¿Necesitas Ayuda?</h2>

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
                {activeFaq === index && <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.respuesta}</p>}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Cargando preguntas...</p>
          )}
        </div>
      </section>
    </ClientLayout>
  )
}

export default ClientPage
