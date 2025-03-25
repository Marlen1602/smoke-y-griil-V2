"use client"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contex/AuthContext"
import { useState, useEffect } from "react"
import { useTheme } from "../contex/ThemeContext"
import Breadcrumbs from "../pages/Breadcrumbs"
import PrincipalLayout from "../layouts/PublicLayaut"

const VerifyCodePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm()
  const { verifyCode, errors: verifyErrors, setErrors } = useAuth()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const email = localStorage.getItem("email")

  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state")
    }
  }, [email])

  const onSubmit = async (data) => {
    if (!email) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const formData = { ...data, email }
      const res = await verifyCode(formData)
      setLoading(false)

      if (res) {
        setSuccessMessage("Código verificado correctamente. Redirigiendo...")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setErrorMessage("Código incorrecto o expirado.")
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
      setErrorMessage("Ocurrió un error al verificar el código.")
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  return (
    <PrincipalLayout>
        <Breadcrumbs />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
        <div className="p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          {/* Mensajes de error y éxito */}
          {errorMessage && (
            <div className="bg-red border border-red text-white dark:bg-red dark:border-red dark:text-white px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

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
                onClick={() => navigate("/recuperar-contraseña")}
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

export default VerifyCodePage


