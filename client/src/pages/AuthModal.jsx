import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from "../contex/ThemeContext";
import { useAuth } from "../contex/AuthContext"; // Importar contexto de autenticación

const AuthModal = ({ onClose, redirectTo = "/" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth(); // Acceder al estado de autenticación
  const [redirectPath, setRedirectPath] = useState(redirectTo);

  // Efecto para manejar redirecciones desde el state de location
  useEffect(() => {
    if (location.state?.redirectTo) {
      setRedirectPath(location.state.redirectTo);
    }
  }, [location.state]);

  // Cerrar automáticamente si el usuario se autentica
  useEffect(() => {
    if (user) {
      onClose();
      navigate(redirectPath);
    }
  }, [user, onClose, navigate, redirectPath]);

  const handleRegisterClick = () => {
    navigate('/registrar', { state: { redirectTo: redirectPath } });
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { redirectTo: redirectPath } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 md:p-8 rounded-lg shadow-lg max-w-sm w-full ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
          Regístrate o inicia sesión para continuar
        </h2>

        <button
          onClick={handleRegisterClick}
          className="bg-orange-600 text-white w-full md:w-80 h-12 py-3 rounded-full flex items-center justify-center mb-3 hover:bg-orange-700 transition"
        >
          Registrarme
        </button>

        <button
          className="bg-blue-600 text-white w-full md:w-80 h-12 py-3 rounded-full flex items-center justify-center mb-3 hover:bg-blue-700 transition"
        >
          <i className="fab fa-google mr-2"></i> Continuar con Google
        </button>

        <button
          className="bg-blue-900 text-white w-full md:w-80 h-12 py-3 rounded-full flex items-center justify-center mb-3 hover:bg-blue-800 transition"
        >
          <i className="fab fa-facebook-f mr-2"></i> Continuar con Facebook
        </button>

        <button
          onClick={handleLoginClick}
          className={`w-full md:w-80 h-12 py-3 border rounded-full font-bold transition ${
            isDarkMode
              ? "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
              : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
          }`}
        >
          Iniciar sesión
        </button>

        <button
          onClick={onClose}
          className={`mt-4 w-full md:w-80 h-12 text-center hover:underline ${
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