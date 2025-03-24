import React from 'react';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación
import AdminLayout from "../layouts/AdminLayout.jsx"

const AdminPage = () => {
  const { logout } = useAuth();

  const handleSignup = async () => {
    console.log("object");
    logout();
  };

  return (
    <AdminLayout>
      {/* Main content */}
      <main className="flex flex-col items-center justify-center p-8 md:flex-row md:justify-between md:items-center md:p-16 space-y-8 md:space-y-0">
        {/* Texto de bienvenida */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            ¡Bienvenido al Panel de Administrador!
          </h1>
          <p className="text-base md:text-lg text-gray-800 dark:text-gray-300 mb-6">
            Aquí puedes gestionar información de Smoke & Grill.
          </p>
          
          <button className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300">
            Ver historial de pedidos
          </button>
        </div>

        {/* Imagen (opcional o decorativa) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://via.placeholder.com/300"
            alt="Administrador"
            className="w-64 md:w-80 rounded-lg shadow-lg"
          />
        </div>
      </main>
      
       
       </AdminLayout>
   
  );
};

export default AdminPage;

