import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

const AuthModal = ({ onClose }) => {
    const navigate = useNavigate(); // Hook de React Router para navegar

  const handleRegisterClick = () => {
    navigate('/registrar'); // Navegar a la página de registro
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navegar a la página de login (si ya tiene cuenta)
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl text-black w-full font-bold text-center mb-4">Regístrate o inicia sesión para continuar</h2>
        <button onClick={handleRegisterClick} className="bg-orange-600 text-white w-full py-3 rounded-full flex items-center justify-center mb-3">
          Registrarme
        </button>
        {/* Botón de Google */}
        <button className="bg-blue-600 text-white w-full py-3 rounded-full flex items-center justify-center mb-3">
          <i className="fab fa-google mr-2"></i> Continuar con Google
        </button>
        {/* Botón de Facebook */}
        <button className="bg-blue-900 text-white w-full py-3 rounded-full flex items-center justify-center mb-3">
          <i className="fab fa-facebook-f mr-2"></i> Continuar con Facebook
        </button>
        {/* Enlace Ya tengo cuenta */}
        <button onClick={handleLoginClick} className="text-orange-600 font-bold w-full py-3 border border-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition">
          Ya tengo cuenta
        </button>
        {/* Botón para cerrar el modal */}
        <button onClick={onClose} className="text-gray-800 mt-4 w-full text-center">Cerrar</button>
      </div>
    </div>
  );
};

export default AuthModal;
