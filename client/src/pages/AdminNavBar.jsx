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
        <nav className="text-white">
          <ul className="flex space-x-4">
            <Link to="/paginaAdministrador" className="hover:text-gray-300 cursor-pointer">Inicio</Link>
            <Link to="/usuarios" className="hover:text-gray-300 cursor-pointer">Usuarios</Link>
            <Link to="/politicas" className="hover:text-gray-300 cursor-pointer">Políticas</Link>
          </ul>
        </nav>
      </div>
      <button className="text-white cursor-pointer" onClick={logout}>Cerrar Sesión</button>
    </header>
  );
};

export default AdminNavBar;
