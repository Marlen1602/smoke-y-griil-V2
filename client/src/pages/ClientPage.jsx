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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [loading, isAuthenticated, navigate])

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

  const handleVerMisPedidos = () => {
    navigate("/pedidos")
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>
  }

  if (!user) {
    return <p className="text-center text-red-500">Error: No se pudo cargar la información del usuario.</p>
  }

  return (
    <ClientLayout>
      <Breadcrumbs />

      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0 bg-white dark:bg-gray-900 min-h-screen">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            ¡Bienvenido, {user?.username || "Usuario"}!
          </h1>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Aquí puedes gestionar tus pedidos y actualizar tu información personal.
          </p>
          <button
            onClick={handleVerMisPedidos}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Ver mis pedidos
          </button>
        </div>

        <div className="md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">SABOR EXPRESS</h2>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">📍 Nuestra Ubicación</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Col. Colalambre</strong>
                    <br />A un costado del Salón "La Huerta"
                    <br />
                    Huejutla, Hgo.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">⚠️ Importante</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Si vives en una zona muy retirada de nuestra ubicación, se nos hará imposible entregar tu pedido.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">🚚 Entrega:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">30-45 minutos</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Solo en zonas cercanas</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-gray-100 dark:bg-gray-800 py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">¿Necesitas Ayuda?</h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {preguntas.length > 0 ? (
            preguntas.map((faq, index) => (
              <div
                key={faq.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-md bg-white dark:bg-gray-700"
              >
                <button
                  className="w-full text-left flex justify-between items-center font-semibold text-gray-800 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.pregunta}
                  <span className="text-gray-500 dark:text-gray-400">{activeFaq === index ? "▲" : "▼"}</span>
                </button>
                {activeFaq === index && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-600">
                    {faq.respuesta}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Cargando preguntas...</p>
          )}
        </div>
      </section>
    </ClientLayout>
  )
}

export default ClientPage
