"use client"

import { useState, useEffect, useContext } from "react"
import Breadcrumbs from "../pages/Breadcrumbs.jsx"
import { obtenerDocumentos } from "../api/auth.js"
import { AuthContext } from "../contex/AuthContext"
import AdminLayout from "../layouts/AdminLayout.jsx"
import UserLayout from "../layouts/ClientLayaut.jsx"
import PublicLayout from "../layouts/PublicLayaut.jsx"

const PrivacidadPage = () => {
  const [privacidad, setPrivacidad] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, isAuthenticated } = useContext(AuthContext)

  // Obtener las políticas de privacidad desde la base de datos
  const fetchPoliticas = async () => {
    setLoading(true)
    try {
      const response = await obtenerDocumentos()
      // Buscar en la respuesta el documento con el nombre "Políticas de privacidad"
      const politicasData = response.data.find((doc) => doc.nombre === "Politicas de privacidad")

      if (politicasData) {
        setPrivacidad(politicasData.contenido)
      } else {
        setError("No se encontraron las políticas de privacidad.")
      }
    } catch (error) {
      console.error("Error al obtener las políticas de privacidad:", error)
      setError("Error al cargar las políticas de privacidad. Por favor, intente nuevamente más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoliticas()
  }, [])

  // Función para formatear el contenido de las políticas
  const formatearPoliticas = (texto) => {
    if (!texto) return null

    // Dividir el texto en secciones basadas en números seguidos de punto
    const secciones = texto.split(/(\d+\.\s)/g)

    if (secciones.length <= 1) {
      // Si no hay secciones numeradas, devolver el texto completo
      return <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{texto}</p>
    }

    // Agrupar los encabezados con su contenido
    const contenidoFormateado = []
    let tituloActual = ""

    secciones.forEach((seccion, index) => {
      if (seccion.match(/^\d+\.\s/)) {
        // Es un título de sección
        tituloActual = seccion
      } else if (tituloActual && seccion.trim()) {
        // Es contenido de sección
        contenidoFormateado.push(
          <div key={index} className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {tituloActual}
              {seccion.split("\n")[0]}
            </h3>
            {seccion
              .split("\n")
              .slice(1)
              .map(
                (parrafo, i) =>
                  parrafo.trim() && (
                    <p key={i} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                      {parrafo}
                    </p>
                  ),
              )}
          </div>,
        )
        tituloActual = ""
      }
    })

    return contenidoFormateado
  }

  // Contenido de la página
  const pageContent = (
    <>
        <Breadcrumbs />

      {/* Contenido principal */}
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Barra lateral naranja y encabezado */}
          <div className="flex flex-col md:flex-row">
            <div className="w-2 md:w-2 bg-orange-500 flex-shrink-0"></div>
            <div className="flex-grow p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-6 text-center">
                Políticas de Privacidad
              </h1>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red dark:bg-red border-l-4 border-red p-4 mb-4">
                  <p className="text-white dark:text-white">{error}</p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 mb-6">
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Bienvenido a Smoke y Grill. Nos comprometemos a proteger la privacidad y seguridad de nuestros
                      clientes y usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, compartimos y
                      protegemos su información personal.
                    </p>
                  </div>

                  <div className="space-y-4">{formatearPoliticas(privacidad)}</div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Última actualización: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Renderizar con el layout apropiado según el tipo de usuario
  if (!isAuthenticated || !user) {
    return <PublicLayout>{pageContent}</PublicLayout>
  }

  switch (user.tipoUsuarioId) {
    case 1: // Administrador
      return <AdminLayout>{pageContent}</AdminLayout>
    case 2: // Cliente
      return <UserLayout>{pageContent}</UserLayout>
    default:
      return <PublicLayout>{pageContent}</PublicLayout>
  }
}

export default PrivacidadPage


