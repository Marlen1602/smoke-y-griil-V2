import React from 'react';
import logo from '../assets/logo.png';
import { useAuth } from "../contex/AuthContext";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  const { logout } = useAuth();
  
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-black">
      <div className="text-white flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
        <nav className="text-white relative">
          <ul className="flex space-x-4">
            <Link to="/paginaAdministrador" className="hover:text-gray-300 cursor-pointer">Inicio</Link>
            <Link to="/usuarios" className="hover:text-gray-300 cursor-pointer">Perfil de empresa</Link>
            
            {/* Dropdown para Documentos Regulatorios */}
            <div className="relative group">
              <span className="hover:text-gray-300 cursor-pointer">Documentos Regulatorios</span>
              <div className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg mt-2">
                <Link to="/politicas" className="block px-4 py-2 hover:bg-gray-200">Políticas de Privacidad</Link>
                <Link to="/terminosCondiciones" className="block px-4 py-2 hover:bg-gray-200">Términos y Condiciones</Link>
                <Link to="/deslindeLegal" className="block px-4 py-2 hover:bg-gray-200">Deslinde Legal</Link>
              </div>
            </div>
            
            <Link to="/usuarios" className="hover:text-gray-300 cursor-pointer">Monitor de coincidencias</Link>
          </ul>
        </nav>
      </div>
      <button className="text-white cursor-pointer" onClick={logout}>Cerrar Sesión</button>
    </header>
  );
};

export default AdminNavBar;
