import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación
import AdminNavBar from './AdminNavBar';

const AdminPage = () => {
  const { logout } = useAuth(); 
  const handleSignup = async () => {
    console.log("object")
    logout();
  }
  return (
    <div className="bg-white min-h-screen font-sans">
      <AdminNavBar />
      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">¡Bienvenido al Panel de Administrador!</h1>
          <p className="text-lg text-gray-800 mb-6"> Aquí puedes gestionar informacion de Smoke &  Grill.</p>
          <button className="bg-orange-600 text-white py-3 px-24 rounded-full font-bold hover:bg-orange-700 transition">
            Ver historial de pedidos
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;