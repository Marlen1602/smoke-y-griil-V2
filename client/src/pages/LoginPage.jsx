import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // Iconos para mostrar/ocultar contraseña
import { useTheme } from "../contex/ThemeContext";
import Breadcrumbs from "../pages/Breadcrumbs";
import PublicLayaut from "../layouts/PublicLayaut"

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
    <PublicLayaut>
    <Breadcrumbs />
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
            <label className="block text-sm font-bold mb-2">Correo o nombre de usuario</label>
            <input
              type="text"
              {...register("identificador", {
                required: "Este campo es requerido",
                validate: (value)=> value.length>3 || "Debe tener al menos 3 caracteres",
              })}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="Ingresa tu correo o nombre de usuario"
            />
            {formErrors.identificador && <span className="text-red text-sm">{formErrors.identificador.message}</span>}
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
            <Link to="/metodo-recuperacion" className="text-orange-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
    </PublicLayaut>
  );
};

export default LoginPage;
