import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../contex/ThemeContext"; // Importar el contexto de modo oscuro

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate(); // Hook de React Router para navegar
  const { isDarkMode } = useTheme(); // Usamos el estado del tema oscuro

  const handleRegisterClick = () => {
    navigate('/registrar'); // Navegar a la página de registro
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navegar a la página de login
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 md:p-8 rounded-lg shadow-lg max-w-sm w-full ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Título del Modal */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
          Regístrate o inicia sesión para continuar
        </h2>

        {/* Botón Registrarme */}
        <button
          onClick={handleRegisterClick}
          className="bg-orange-600 text-white w-full py-3 rounded-full flex items-center justify-center mb-3 hover:bg-orange-700 transition"
        >
          Registrarme
        </button>

        {/* Botón Continuar con Google */}
        <button
          className="bg-blue-600 text-white w-full py-3 rounded-full flex items-center justify-center mb-3 hover:bg-blue-700 transition"
        >
          <i className="fab fa-google mr-2"></i> Continuar con Google
        </button>

        {/* Botón Continuar con Facebook */}
        <button
          className="bg-blue-900 text-white w-full py-3 rounded-full flex items-center justify-center mb-3 hover:bg-blue-800 transition"
        >
          <i className="fab fa-facebook-f mr-2"></i> Continuar con Facebook
        </button>

        {/* Botón Ya tengo cuenta */}
        <button
          onClick={handleLoginClick}
          className={`w-full py-3 border rounded-full font-bold transition ${
            isDarkMode
              ? "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
              : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
          }`}
        >
          Iniciar sesión
        </button>

        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className={`mt-4 w-full text-center hover:underline ${
            isDarkMode ? "text-gray-400" : "text-gray-800"
          }`}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

