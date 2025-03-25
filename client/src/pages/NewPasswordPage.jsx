"use client"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contex/AuthContext"
import { useState, useEffect } from "react"
import { useTheme } from "../contex/ThemeContext"
import Breadcrumbs from "../pages/Breadcrumbs"
import PrincipalLayout from "../layouts/PublicLayaut"

const NewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm()
  const { verifyCode, errors: verifyErrors, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useTheme()
  const email = localStorage.getItem("email")
  const [successMessage, setSuccessMessage] = useState("")

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d)\1{2})(?!.*([a-zA-Z])\2{2})(?!.*(\W)\3{2})(?!.*0123456789)(?!.*123456789)(?!.*23456789)(?!.*34567890)(?!.*45678901)(?!.*987654321)(?!.*98765432)[A-Za-z\d\W_]{12,}$/

  useEffect(() => {
    if (!email) {
      console.error("Email not found in location state")
    }
  }, [email])

  const [passwordStrength, setPasswordStrength] = useState("weak")
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak")
    } else if (passwordRegex.test(password)) {
      setPasswordStrength("strong")
    } else {
      setPasswordStrength("medium")
    }
  }

  const onSubmit = async (data) => {
    if (!email) return

    try {
      setLoading(true)
      const formData = { ...data, email }
      const res = await updatePassword(formData)
      setLoading(false)

      if (res.updated) {
        setSuccessMessage("¡Contraseña actualizada correctamente!")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <PrincipalLayout>
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
            Restablecer contraseña
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">Ingrese su nueva contraseña</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 12,
                      message: "La contraseña debe tener al menos 12 caracteres",
                    },
                    pattern: {
                      value: passwordRegex,
                      message: "La contraseña no cumple con los requisitos de seguridad",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pr-12"
                  placeholder="Contraseña"
                  onFocus={() => setShowPasswordRequirements(true)}
                  onChange={(e) => evaluatePasswordStrength(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-0 top-0 bottom-0 px-3 text-gray-600 dark:text-gray-400"
                >
                  {isPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && <p className="text-red text-sm mt-1">{errors.password.message}</p>}

              {/* Requisitos de contraseña */}
              {showPasswordRequirements && (
                <div className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <p className="text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">
                    Requisitos de la contraseña:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                    <li>Al menos 12 caracteres</li>
                    <li>Una letra mayúscula</li>
                    <li>Una letra minúscula</li>
                    <li>Un número</li>
                    <li>Un carácter especial</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowPasswordRequirements(false)}
                    className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Fortaleza de la contraseña:</p>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === "strong"
                      ? "bg-green-500 w-full"
                      : passwordStrength === "medium"
                        ? "bg-yellow-500 w-2/3"
                        : "bg-red w-1/3"
                  }`}
                ></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...register("Confirmpassword", {
                    required: "Debe confirmar su contraseña",
                    validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
                  })}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pr-12"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-0 top-0 bottom-0 px-3 text-gray-600 dark:text-gray-400"
                >
                  {isConfirmPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.Confirmpassword && <p className="text-red text-sm mt-1">{errors.Confirmpassword.message}</p>}
            </div>

            <div className="grid place-items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
            >
              Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    </PrincipalLayout>
  )
}

export default NewPasswordPage

