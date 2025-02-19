import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // Iconos para mostrar/ocultar contraseña
import { useTheme } from "../contex/ThemeContext";
import Breadcrumbs from "../pages/Breadcrumbs";
import logo from '../assets/logo.png';
import Header from './PrincipalNavBar'; // Importa el componente Header

const LoginPage = () => {
  const { login, errors } = useAuth();
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para mostrar u ocultar contraseña
  const { isDarkMode } = useTheme();

  const onSubmit = async (data) => {
    setLoading(true);
    await login(data);
    setLoading(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 dark:text-white min-h-screen`}>
      {/* Header */}
      <Header />
       {/* Breadcrumbs en la parte blanca */}
  <div className="bg-white py-3 px-8  rounded-md flex items-center">
    <Breadcrumbs />
  </div>
    <div className={`min-h flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : " text-gray-800"}`}>
      <div className={`p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Iniciar sesión</h2>

        {/* Mostrar errores del servidor */}
        {errors.length > 0 && (
          <div className="bg-red text-white text-center p-2 rounded mb-4">
            {errors[0].message === "La cuenta está bloqueada"
              ? "Tu cuenta ha sido bloqueada."
              : errors[0]}
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Correo electrónico</label>
            <input
              type="email"
              {...register("email", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[^\s@]+@(uthh\.edu\.mx|gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/,
                  message: "Por favor introduce un correo válido con un dominio aceptado.",
                },
              })}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="Ingresa tu correo"
            />
            {formErrors.email && <span className="text-red text-sm">{formErrors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                {...register("password", { required: "La contraseña es requerida" })}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {isPasswordVisible ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
              </button>
            </div>
            {formErrors.password && <span className="text-red text-sm">{formErrors.password.message}</span>}
          </div>

          <div className="col-span-1 md:col-span-2 grid place-items-center">
            <button
              type="submit"
              className={`w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 ${
                isDarkMode ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
          <p className="text-xs">
            ¿No tienes cuenta?{" "}
            <Link to="/registrar" className="text-orange-600 hover:underline">
              Regístrate
            </Link>
          </p>
          <p className="text-xs">
            <Link to="/recuperar-contraseña" className="text-orange-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
      {/* Footer */}
                <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 mt-10">
                  <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
                    {/* Logo */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                      <img src={logo} alt="Logo" className="h-12" />
                    </div>
          
                    {/* Enlaces */}
                    <div className="w-full md:w-auto flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-8">
                      <ul className="space-y-2 text-center md:text-left">
                        <li>Misión</li>
                        <li>Quiénes Somos</li>
                        <li>Visión</li>
                        
                      </ul>
                      <ul className="space-y-2 text-center md:text-left">
                        
                        <li>Términos y Condiciones</li>
                        <li>Aviso de Privacidad</li>
                      </ul>
                    </div>
          
                    {/* Redes Sociales */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
                      <i className="fab fa-facebook text-2xl"></i>
                      <i className="fab fa-instagram text-2xl"></i>
                      <i className="fab fa-tiktok text-2xl"></i>
                    </div>
                  </div>
                </footer>
    </div>
  );
};

export default LoginPage;
