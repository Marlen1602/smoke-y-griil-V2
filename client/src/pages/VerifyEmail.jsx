import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../contex/AuthContext"
import { useState } from "react"
import { useTheme } from "../contex/ThemeContext"
import Breadcrumbs from "../pages/Breadcrumbs"
import PrincipalLayout from "../layouts/PublicLayaut"

const VerifyEmail = () => {
  const { sendEmailResetPassword, errors } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const res = await sendEmailResetPassword(data.email)
      setLoading(false)

      if (res.message) {
        // Guardar el email en localStorage para usarlo en la verificación de código
        localStorage.setItem("email", data.email)

        // Mostrar mensaje de éxito antes de redirigir
        setSuccessMessage("Se ha enviado un código de verificación a su correo electrónico.")

        // Redirigir después de un breve retraso para que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/recuperar-contraseña/verificar-codigo")
        }, 2000)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
      <PrincipalLayout>
      {/* Breadcrumbs */}
        <Breadcrumbs />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
        <div className="p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          {/* Título y descripción */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Recuperar contraseña
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Ingrese su correo electrónico para recibir un código de verificación
          </p>

          {/* Mensajes de error del servidor */}
          {errors.length > 0 && (
            <div className="bg-red border border-red text-white dark:bg-red dark:border-red dark:text-white px-4 py-3 rounded mb-4">
              {errors[0]}
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "El correo electrónico es obligatorio.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de correo electrónico inválida.",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="ejemplo@correo.com"
              />
              {formErrors.email && <p className="text-red text-sm mt-1">{formErrors.email.message}</p>}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
              >
                Volver
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?
              <Link
                to="/login"
                className="ml-1 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
        </div>
     </PrincipalLayout>
    
  )
}

export default VerifyEmail

