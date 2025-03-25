"use client"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contex/AuthContext"
import { useState } from "react"
import { useTheme } from "../contex/ThemeContext"
import Breadcrumbs from "../pages/Breadcrumbs"
import PrincipalLayout from "../layouts/PublicLayaut"

const VerifyCodePasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm()
  const { verifyCodeForPassword, errors: verifyErrors } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useTheme()
  const [successMessage, setSuccessMessage] = useState("")

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setSuccessMessage("")
      const formData = { ...data }
      const res = await verifyCodeForPassword(formData)
      setLoading(false)

      if (res.message) {
        // Mostrar mensaje de éxito antes de redirigir
        setSuccessMessage("Código verificado correctamente. Redirigiendo...")

        // Redirigir después de un breve retraso para que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/recuperar-contraseña/nueva-contraseña")
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleRequestNewCode = () => {
    navigate("/recuperar-contraseña")
  }

  return (
    <PrincipalLayout>
      {/* Breadcrumbs en la parte blanca */}
        <Breadcrumbs />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
        <div className="p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          {/* Mensajes de error */}
          {Array.isArray(verifyErrors) && verifyErrors.length > 0 && (
            <div className="bg-red border border-red text-white dark:bg-red dark:border-red dark:text-white px-4 py-3 rounded mb-4">
              {verifyErrors[0]}
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Verificación de Código
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Ingrese el código de 6 dígitos que hemos enviado a su correo electrónico
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
              <input
                {...register("code", {
                  required: "El código es obligatorio.",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "El código debe tener exactamente 6 números.",
                  },
                })}
                type="text"
                maxLength="6"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              {formErrors.code && <p className="text-red text-sm mt-1">{formErrors.code.message}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">El código expirará en 15 minutos</p>
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
                {loading ? "Verificando..." : "Verificar código"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No recibiste el código?
              <button
                onClick={handleRequestNewCode}
                className="ml-1 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
              >
                Solicitar nuevo código
              </button>
            </p>
          </div>
        </div>
      </div>
    </PrincipalLayout>
  )
}

export default VerifyCodePasswordPage

