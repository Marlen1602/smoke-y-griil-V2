import { useState, useEffect, useContext } from "react"
import Breadcrumbs from "../pages/Breadcrumbs.jsx"
import { getEmpresaProfile } from "../api/auth.js"
import { AuthContext } from "../contex/AuthContext"
import AdminLayout from "../layouts/AdminLayout.jsx"
import UserLayout from "../layouts/ClientLayaut.jsx"
import PublicLayout from "../layouts/PublicLayaut.jsx"

const VisionPage = () => {
  const [vision, setVision] = useState("")
  const { user, isAuthenticated } = useContext(AuthContext)

  // Obtener la visión desde la base de datos
  const fetchVision = async () => {
    try {
      const response = await getEmpresaProfile()
      setVision(response.data.Vision)
    } catch (error) {
      console.error("Error al obtener la visión:", error)
    }
  }

  useEffect(() => {
    fetchVision()
  }, [])

  // Contenido de la página
  const pageContent = (
    <>
      {/* 🔹 Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* 🔹 Contenido principal con diseño mejorado */}
      <div className="flex-grow container mx-auto px-6 py-12 flex justify-center items-center">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-8 border-l-8 border-orange-500">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4 text-center">Nuestra Visión</h1>

          {/* 🔹 Mostrar la visión obtenida desde la BD */}
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">{vision || "Cargando visión..."}</p>
        </div>
      </div>
    </>
  )

  // Renderizar con el layout apropiado según el tipo de usuario
  if (!isAuthenticated || !user) {
    return <PublicLayout>{pageContent}</PublicLayout>
  }

  // Usar tipoUsuarioId en lugar de role
  switch (user.tipoUsuarioId) {
    case 1: // Administrador
      return <AdminLayout>{pageContent}</AdminLayout>
    case 2: // Cliente
      return <UserLayout>{pageContent}</UserLayout>
    default:
      //return <PublicLayout>{pageContent}</PublicLayout>
  }
}

export default VisionPage

