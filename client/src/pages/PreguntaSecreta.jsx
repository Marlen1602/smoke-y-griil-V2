import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contex/ThemeContext"
import PrincipalLayout from "../layouts/PublicLayaut"
import Breadcrumbs from "../pages/Breadcrumbs";
import {
  getPreguntaSecretaPorCorreo,
  verificarRespuestaSecreta,
  verificarTokenSecreto,
  restablecerPasswordConPregunta,
} from "../api/auth"

const RecuperarPreguntaSecreta = () => {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  // Estados para manejar el flujo
  const [step, setStep] = useState(1) // 1: Email, 2: Pregunta, 3: Código, 4: Nueva contraseña
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Datos del usuario
  const [email, setEmail] = useState("")
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Estados para la contraseña
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("weak")

  // Paso 1: Verificar si el correo existe y tiene pregunta secreta
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await getPreguntaSecretaPorCorreo(email)
      setPregunta(response.data.pregunta)
      setStep(2)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("El correo electrónico no está registrado en el sistema.")
      } else if (err.response && err.response.status === 400) {
        setError("Este usuario no tiene configurada una pregunta secreta.")
      } else {
        setError("Ha ocurrido un error. Por favor, intente nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Verificar la respuesta a la pregunta secreta
  const handleRespuestaSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await verificarRespuestaSecreta({ email, respuesta })
      setSuccess("Se ha enviado un código de verificación a su correo electrónico.")
      setStep(3)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("La respuesta es incorrecta. Por favor, intente nuevamente.")
      } else {
        setError("Ha ocurrido un error. Por favor, intente nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Paso 3: Verificar el código recibido por correo
  const handleTokenSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await verificarTokenSecreto({ email, token })
      setSuccess("Código verificado correctamente.")
      setStep(4)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("El código ingresado es incorrecto o ha expirado.")
      } else {
        setError("Ha ocurrido un error. Por favor, intente nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Paso 4: Establecer nueva contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    // Validar requisitos de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
    if (!passwordRegex.test(password)) {
      setError("La contraseña no cumple con los requisitos de seguridad.")
      return
    }

    setLoading(true)

    try {
      await restablecerPasswordConPregunta({ email, token, nuevaPassword: password })
      setSuccess("¡Contraseña actualizada correctamente!")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("El código ha expirado. Por favor, inicie el proceso nuevamente.")
      } else if (err.response && err.response.status === 400) {
        setError("La nueva contraseña no puede ser igual a la anterior.")
      } else {
        setError("Ha ocurrido un error. Por favor, intente nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (value) => {
    let strength = "weak"

    // Criterios de fortaleza
    const hasLowercase = /[a-z]/.test(value)
    const hasUppercase = /[A-Z]/.test(value)
    const hasNumber = /\d/.test(value)
    const hasSpecial = /[@$!%*?&]/.test(value)
    const isLongEnough = value.length >= 12

    const criteriaCount = [hasLowercase, hasUppercase, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length

    if (criteriaCount === 5) {
      strength = "strong"
    } else if (criteriaCount >= 3) {
      strength = "medium"
    }

    setPasswordStrength(strength)
  }

  return (
    <PrincipalLayout>
      <Breadcrumbs />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
        <div className="p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-red border border-red text-white dark:bg-red dark:border-red dark:text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Paso 1: Ingresar correo electrónico */}
          {step === 1 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Recuperar contraseña
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Ingrese su correo electrónico para buscar su pregunta secreta
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => navigate("/metodo-recuperacion")}
                    className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
                  >
                    Volver
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verificando..." : "Continuar"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Paso 2: Responder pregunta secreta */}
          {step === 2 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Pregunta secreta
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Responda la siguiente pregunta para verificar su identidad
              </p>

              <form onSubmit={handleRespuestaSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pregunta</label>
                  <div className="w-full px-4 py-3 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    {pregunta}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Su respuesta
                  </label>
                  <input
                    type="text"
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="Ingrese su respuesta"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
                  >
                    Volver
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verificando..." : "Verificar respuesta"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Paso 3: Ingresar código de verificación */}
          {step === 3 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Código de verificación
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Ingrese el código de 6 dígitos que hemos enviado a su correo electrónico
              </p>

              <form onSubmit={handleTokenSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    maxLength="6"
                    pattern="\d{6}"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">El código expirará en 15 minutos</p>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
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
            </>
          )}

          {/* Paso 4: Establecer nueva contraseña */}
          {step === 4 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Restablecer contraseña
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">Ingrese su nueva contraseña</p>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        evaluatePasswordStrength(e.target.value)
                      }}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pr-12"
                      placeholder="Contraseña"
                      onFocus={() => setShowPasswordRequirements(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-0 top-0 bottom-0 px-3 text-gray-600 dark:text-gray-400"
                    >
                      {isPasswordVisible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>

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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pr-12"
                      placeholder="Confirmar contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                      className="absolute right-0 top-0 bottom-0 px-3 text-gray-600 dark:text-gray-400"
                    >
                      {isConfirmPasswordVisible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {password !== confirmPassword && confirmPassword && (
                    <p className="text-red text-sm mt-1">Las contraseñas no coinciden</p>
                  )}
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
              </form>
            </>
          )}
        </div>
      </div>
    </PrincipalLayout>
  )
}

export default RecuperarPreguntaSecreta

