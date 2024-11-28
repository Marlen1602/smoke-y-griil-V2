import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto del modo oscuro

const LoginPage = () => {
  const { login, errors } = useAuth();
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme(); // Obtener el estado del modo oscuro y la función para alternar

  const onSubmit = async (data) => {
    setLoading(true);
    await login(data);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className={`p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Iniciar sesión</h2>


        {/* Mostrar errores del servidor */}
        {errors.length > 0 && (
          <div className="bg-red text-white text-center p-2 rounded mb-4">
            {errors[0].message === "La cuenta está bloqueada"
              ? "Tu cuenta ha sido bloqueada. Contacta al administrador."
              : errors[0]}
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Correo electrónico</label>
            <input
              type="text"
              {...register("email", { required: true })}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Ingresa tu correo"
            />
            {formErrors.email && <span className="text-red text-sm">El correo es requerido</span>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Ingresa tu contraseña"
            />
            {formErrors.password && <span className="text-red-500 text-sm">La contraseña es requerida</span>}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold transition duration-300 ${isDarkMode ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"}`}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
          <p className="text-xs">
            ¿No tienes cuenta?{" "}
            <Link to="/registrar" className="text-orange-500 hover:underline">
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
  );
};

export default LoginPage;


