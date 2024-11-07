import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";

const NewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm();
  const { verifyCode, errors: verifyErrors, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state");
    }
  }, [email]);

  const [passwordStrength, setPasswordStrength] = useState("");

  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
        password
      )
    ) {
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
      const res = await updatePassword(formData); // Llama a la función para verificar el código
      setLoading(false);

      if (res.updated) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    // navigate("/paginaCliente");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        {errors.length > 0 && (
          <div className="bg-red-500 bg-rose-300 text-black text-center p-2 rounded mb-4">
            {errors[0]}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6">
          Restablecer Contraseña
        </h2>

        {Array.isArray(verifyErrors) &&
          verifyErrors.map((error, i) => (
            <div
              className="bg-red-500 text-black bg-rose-200 text-center p-2 rounded mb-4 "
              key={i}
            >
              {error}
            </div>
          ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 8,
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                  message:
                    "Debe incluir mayúsculas, minúsculas, números y caracteres especiales.",
                },
              })}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Contraseña"
              onChange={(e) => evaluatePasswordStrength(e.target.value)}
            />
            {errors.password && (
              <p className="text-red text-sm mt-1">
                {errors.password.message ||
                  "La contraseña debe tener al menos 8 caracteres."}
              </p>
            )}
            <p>Fortaleza de la contraseña:</p>
            <div className={`password-strength-bar ${passwordStrength}`} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...register("Confirmpassword", {
                required: true,
                validate: (value) =>
                  value === getValues("password") ||
                  "Las contraseñas no coinciden",
              })}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirmar contraseña"
            />
            {errors.Confirmpassword && (
              <p className="text-red text-sm mt-1">
                {errors.Confirmpassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
