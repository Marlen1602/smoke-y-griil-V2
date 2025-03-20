import React, { useState, useEffect,useContext } from "react";
import Breadcrumbs from "../pages/Breadcrumbs.jsx";
import { getEmpresaProfile } from "../api/auth.js";
import { AuthContext } from "../contex/AuthContext"
import AdminLayout from "../layouts/AdminLayout.jsx"
//import UserLayout from "../layouts/UserLayout"
import PublicLayout from "../layouts/PublicLayaut.jsx"

const QuienesPage = () => {
  const [quienes, setQuienes] = useState("");
   const { user, isAuthenticated } = useContext(AuthContext)

  // Obtener la misión desde la base de datos
  const fetchQuienes = async () => {
    try {
      const response = await getEmpresaProfile();
      setQuienes(response.data.Eslogan);
    } catch (error) {
      console.error("Error al obtener quienes somos:", error);
    }
  };

  useEffect(() => {
    fetchQuienes();
  }, []);

   // Contenido de la página
   const pageContent = (
    <>

      {/* 🔹 Breadcrumbs */}
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* 🔹 Contenido principal con diseño mejorado */}
      <div className="flex-grow container mx-auto px-6 py-12 flex justify-center items-center">
        <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 border-l-8 border-orange-500">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4 text-center">
            ¿Quienes Somos?
          </h1>

          {/* 🔹 Mostrar la misión obtenida desde la BD */}
          <p className="text-lg text-gray-700 text-center">
            {quienes || "Cargando misión..."}
          </p>
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
};

export default QuienesPage;