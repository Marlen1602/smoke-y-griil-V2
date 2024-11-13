import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación

const AdminPage = () => {
  const { logout } = useAuth(); 
  const handleSignup = async () => {
    console.log("object")
    logout();
  }
  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="flex justify-between items-center p-4 shadow-md bg-black">
        <div className="text-white flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <nav className="text-white">
            <ul className="flex space-x-4">
              <li className="hover:text-gray-300 cursor-pointer">Inicio</li>
              <li className="hover:text-gray-300 cursor-pointer">Usuarios</li>
              <li className="hover:text-gray-300 cursor-pointer">Politicas</li>
              {/*<Link to="/politicas" className="hover:text-gray-300 cursor-pointer">Politicas</Link>
              <Link className="hover:text-gray-300 cursor-pointer">Perfil</Link>*/}
            </ul>
          </nav>
        </div>
        {/* Logout option */}
        <button className="text-white cursor-pointer" onClick={handleSignup}>Cerrar Sesión</button>
      </header>

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