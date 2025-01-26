import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto para el modo oscuro

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const NewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();
  const { verifyCode, errors: verifyErrors, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme(); // Usamos el estado del tema oscuro
  const email = localStorage.getItem("email");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d)\1{2})(?!.*([a-zA-Z])\2{2})(?!.*(\W)\3{2})(?!.*0123456789)(?!.*123456789)(?!.*23456789)(?!.*34567890)(?!.*45678901)(?!.*987654321)(?!.*98765432)[A-Za-z\d\W_]{12,}$/;


  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state");
    }
  }, [email]);

  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false); // Estado para el menú desplegable

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (passwordRegex.test(password)) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  };

  const onSubmit = async (data) => {
    if (!email) return;

    try {
      setLoading(true);
      const formData = { ...data, email };
      const res = await updatePassword(formData);
      setLoading(false);

      if (res.updated) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
    >
      <div
        className={`p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        {errors.length > 0 && (
          <div className="bg-red text-white text-center p-2 rounded mb-4">
            {errors[0]}
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Restablecer Contraseña
        </h2>

        {Array.isArray(verifyErrors) &&
          verifyErrors.map((error, i) => (
            <div
              className="bg-red text-white text-center p-2 rounded mb-4"
              key={i}
            >
              {error}
            </div>
          ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-1">
              Contraseña
            </label>
            <div className="grid relative">
              <input
                type={!isPasswordVisible ? 'password' : 'text'}
                {...register("password", {
                  required: true,
                  minLength: 12,
                  pattern: {
                    value: passwordRegex,
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300"
                  }`}
                placeholder="Contraseña"
                onFocus={() => setShowPasswordRequirements(true)} // Mostrar menú al enfocar
                onChange={(e) => evaluatePasswordStrength(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                class="absolute right-0 top-0 bottom-0 w-20 bg-transparent border-none cursor-pointer px-4 text-lg text-gray-600 transition ease-in-out duration-300 grid place-content-center bg-blue-100"
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="icon-password size-6" />
                ) : (
                  <EyeIcon className="icon-password size-6" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red text-sm mt-1">
                {errors.password.message ||
                  "La contraseña debe tener al menos 12 caracteres."}
              </p>
            )}

            {/* Menú desplegable para requisitos de la contraseña */}
            {showPasswordRequirements && (
              <div
                className={`mt-2 p-3 rounded-md ${isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 border-gray-300 text-gray-800"
                  } border`}
              >
                <p className="text-sm font-bold mb-1">Requisitos de la contraseña:</p>
                <ul className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-600"} list-disc list-inside`}>
                  <li>Al menos 12 caracteres</li>
                  <li>Una letra mayúscula</li>
                  <li>Una letra minúscula</li>
                  <li>Un número</li>
                  <li>Un carácter especial</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setShowPasswordRequirements(false)} // Ocultar menú al hacer clic
                  className={`mt-2 text-sm ${isDarkMode ? "text-blue-400" : "text-blue-500"} hover:underline`}
                >
                  Cerrar
                </button>
              </div>
            )}

            <p className="text-sm mt-2">Fortaleza de la contraseña:</p>
            <div className={`password-strength-bar ${passwordStrength}`} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Confirmar contraseña
            </label>
            <div className="grid relative">
              <input
                type={!isConfirmPasswordVisible ? "password" : "text"}
                {...register("Confirmpassword", {
                  required: true,
                  validate: (value) =>
                    value === getValues("password") ||
                    "Las contraseñas no coinciden"
                })}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300"
                  }`}
                placeholder="Confirmar contraseña"
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                class="absolute right-0 top-0 bottom-0 w-20 bg-transparent border-none cursor-pointer px-4 text-lg text-gray-600 transition ease-in-out duration-300 grid place-content-center bg-blue-100"
              >
                {isConfirmPasswordVisible ? (
                  <EyeSlashIcon className="icon-password size-6" />
                ) : (
                  <EyeIcon className="icon-password size-6" />
                )}
              </button>
            </div>
            {errors.Confirmpassword && (
              <p className="text-red text-sm mt-1">
                {errors.Confirmpassword.message}
              </p>
            )}
          </div>
          <div className="col-span-1 md:col-span-2 grid place-items-center">
          <button
            type="submit"
            className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
