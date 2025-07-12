"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Phone, Shield, Key } from "lucide-react"
import { useAuth } from "../contex/AuthContext"
import ClientLayout from "../layouts/ClientLayaut.jsx"
import { obtenerPreguntasSecretas, agregarPreguntaSecreta, updateTelefono, changePassword } from "../api/auth.js"

const PerfilUsuario = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("datos")
  const [preguntas, setPreguntas] = useState([])
  const [editMode, setEditMode] = useState(false)

  // Estados para mostrar/ocultar contraseñas
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Estados para los datos del usuario
  const [userData, setUserData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  })

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Estados para pregunta secreta
  const [secretQuestion, setSecretQuestion] = useState({
    preguntaSecretaId: "",
    respuestaSecreta: "",
  })

  // Estado para pregunta secreta actual del usuario
  const [currentSecretQuestion, setCurrentSecretQuestion] = useState({
    pregunta: "",
    respuesta: "",
    hasQuestion: false,
  })

  // Validación de contraseña robusta
  const validatePassword = (password) => {
    const errors = []

    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Al menos 1 mayúscula")
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Al menos 1 número")
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("Al menos 1 carácter especial")
    }

    return errors
  }

  // Validación de teléfono
  const validateTelefono = (telefono) => {
    const cleanPhone = telefono.replace(/[\s\-$$$$]/g, "")
    const phoneRegex = /^[0-9]{8,15}$/

    if (!phoneRegex.test(cleanPhone)) {
      return "El teléfono debe contener entre 8 y 15 dígitos numéricos"
    }

    return null
  }

  // Formatear teléfono mientras se escribe
  const formatTelefono = (value) => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 15)
    return limited.replace(/(\d{3})(?=\d)/g, "$1 ")
  }

  // Obtener fortaleza de contraseña
  const getPasswordStrength = (password) => {
    const errors = validatePassword(password)
    if (errors.length === 0) return { level: "strong", text: "Fuerte", color: "text-green-600" }
    if (errors.length <= 2) return { level: "medium", text: "Media", color: "text-yellow-600" }
    return { level: "weak", text: "Débil", color: "text-red-600" }
  }

  // Cargar datos del usuario y preguntas secretas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (user) {
          setUserData({
            nombre: user.nombre || "",
            apellidos: user.apellidos || "",
            email: user.email || "",
            telefono: user.telefono || "",
          })

          // Verificar si el usuario ya tiene pregunta secreta
          if (user.preguntaSecretaId && user.respuestaSecreta) {
            setCurrentSecretQuestion({
              pregunta: "", // Se llenará cuando carguemos las preguntas
              respuesta: user.respuestaSecreta,
              hasQuestion: true,
            })
          }
        }

        const preguntasRes = await obtenerPreguntasSecretas()
        setPreguntas(preguntasRes.data)

        // Si el usuario tiene pregunta secreta, encontrar el texto de la pregunta
        if (user?.preguntaSecretaId && preguntasRes.data) {
          const preguntaActual = preguntasRes.data.find((p) => p.id === user.preguntaSecretaId)
          if (preguntaActual) {
            setCurrentSecretQuestion((prev) => ({
              ...prev,
              pregunta: preguntaActual.pregunta,
            }))
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setMessage({
          type: "error",
          text: "Error al cargar los datos. Por favor, intente nuevamente.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  // Manejar cambios en los campos de datos personales
  const handleUserDataChange = (e) => {
    const { name, value } = e.target

    if (name === "telefono") {
      const formattedValue = formatTelefono(value)
      setUserData({
        ...userData,
        [name]: formattedValue,
      })
    } else {
      setUserData({
        ...userData,
        [name]: value,
      })
    }
  }

  // Manejar cambios en los campos de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  // Manejar cambios en los campos de pregunta secreta
  const handleSecretQuestionChange = (e) => {
    const { name, value } = e.target
    setSecretQuestion({
      ...secretQuestion,
      [name]: value,
    })
  }

  // Toggle mostrar/ocultar contraseña
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Guardar datos personales (solo teléfono)
  const handleSaveUserData = async (e) => {
    e.preventDefault()

    const telefonoError = validateTelefono(userData.telefono)
    if (telefonoError) {
      setMessage({
        type: "error",
        text: telefonoError,
      })
      return
    }

    setLoading(true)
    try {
      const telefonoLimpio = userData.telefono.replace(/\s/g, "")
      await updateTelefono(telefonoLimpio)

      setMessage({
        type: "success",
        text: "Teléfono actualizado correctamente",
      })
      setEditMode(false)
    } catch (error) {
      console.error("Error al actualizar teléfono:", error)
      setMessage({
        type: "error",
        text: error.message || "Error al actualizar el teléfono. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Cambiar contraseña con validaciones robustas
  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validar contraseña actual
    if (!passwordData.currentPassword.trim()) {
      setMessage({
        type: "error",
        text: "Debe ingresar su contraseña actual",
      })
      return
    }

    // Validar nueva contraseña
    const passwordErrors = validatePassword(passwordData.newPassword)
    if (passwordErrors.length > 0) {
      setMessage({
        type: "error",
        text: `La contraseña debe cumplir: ${passwordErrors.join(", ")}`,
      })
      return
    }

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Las contraseñas nuevas no coinciden",
      })
      return
    }

    setLoading(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)

      setMessage({
        type: "success",
        text: "Contraseña actualizada correctamente",
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      setMessage({
        type: "error",
        text: error.message || "Error al cambiar la contraseña. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Guardar pregunta secreta
  const handleSaveSecretQuestion = async (e) => {
    e.preventDefault()

    if (!secretQuestion.preguntaSecretaId || !secretQuestion.respuestaSecreta.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, seleccione una pregunta y escriba una respuesta",
      })
      return
    }

    if (secretQuestion.respuestaSecreta.trim().length < 3) {
      setMessage({
        type: "error",
        text: "La respuesta debe tener al menos 3 caracteres",
      })
      return
    }

    setLoading(true)
    try {
      await agregarPreguntaSecreta(secretQuestion.preguntaSecretaId, secretQuestion.respuestaSecreta.trim())

      // Actualizar la pregunta secreta actual
      const preguntaSeleccionada = preguntas.find((p) => p.id === Number.parseInt(secretQuestion.preguntaSecretaId))
      setCurrentSecretQuestion({
        pregunta: preguntaSeleccionada?.pregunta || "",
        respuesta: secretQuestion.respuestaSecreta.trim(),
        hasQuestion: true,
      })

      setMessage({
        type: "success",
        text: "Pregunta secreta guardada correctamente",
      })
      setSecretQuestion({
        preguntaSecretaId: "",
        respuestaSecreta: "",
      })
    } catch (error) {
      console.error("Error al guardar pregunta secreta:", error)
      setMessage({
        type: "error",
        text: error.message || "Error al guardar la pregunta secreta. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mi Perfil</h1>

        {/* Mensaje de éxito o error */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                : "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-flex items-center gap-2 p-4 rounded-t-lg ${
                  activeTab === "datos"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("datos")}
              >
                <User size={18} />
                Datos Personales
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center gap-2 p-4 rounded-t-lg ${
                  activeTab === "password"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("password")}
              >
                <Key size={18} />
                Cambiar Contraseña
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center gap-2 p-4 rounded-t-lg ${
                  activeTab === "pregunta"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("pregunta")}
              >
                <Shield size={18} />
                Pregunta Secreta
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Tab de Datos Personales */}
          {activeTab === "datos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información Personal</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setUserData({
                        nombre: user?.nombre || "",
                        apellidos: user?.apellidos || "",
                        email: user?.email || "",
                        telefono: user?.telefono || "",
                      })
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveUserData}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={userData.nombre}
                      onChange={handleUserDataChange}
                      disabled={true}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">El nombre no se puede modificar</p>
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={userData.apellidos}
                      onChange={handleUserDataChange}
                      disabled={true}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Los apellidos no se pueden modificar
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      disabled={true}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="telefono"
                        value={userData.telefono}
                        onChange={handleUserDataChange}
                        disabled={!editMode}
                        placeholder="Ej: 123 456 7890"
                        className={`w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                          !editMode ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                        } text-gray-700 dark:text-gray-300 ${
                          editMode ? "focus:ring-2 focus:ring-orange-500 focus:border-orange-500" : ""
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Ingrese un número de teléfono válido (8-15 dígitos)
                    </p>
                  </div>
                </div>

                {editMode && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab de Cambiar Contraseña */}
          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Cambiar Contraseña</h2>

              {/* Información del usuario */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Información de la cuenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {userData.nombre} {userData.apellidos}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Teléfono:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{userData.telefono || "No registrado"}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  {/* Contraseña Actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contraseña Actual *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pr-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pr-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Indicador de fortaleza de contraseña */}
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Fortaleza:</span>
                          <span
                            className={`text-xs font-medium ${getPasswordStrength(passwordData.newPassword).color}`}
                          >
                            {getPasswordStrength(passwordData.newPassword).text}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          <p>Requisitos:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li className={passwordData.newPassword.length >= 8 ? "text-green-600" : "text-red-600"}>
                              Mínimo 8 caracteres
                            </li>
                            <li className={/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : "text-red-600"}>
                              Al menos 1 mayúscula
                            </li>
                            <li className={/[0-9]/.test(passwordData.newPassword) ? "text-green-600" : "text-red-600"}>
                              Al menos 1 número
                            </li>
                            <li
                              className={
                                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordData.newPassword)
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              Al menos 1 carácter especial
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pr-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                  >
                    {loading ? "Cambiando..." : "Cambiar Contraseña"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab de Pregunta Secreta */}
          {activeTab === "pregunta" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Pregunta Secreta</h2>

              {/* Mostrar pregunta secreta actual si existe */}
              {currentSecretQuestion.hasQuestion && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Pregunta Secreta Actual</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-blue-600 dark:text-blue-300">Pregunta:</span>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {currentSecretQuestion.pregunta}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 dark:text-blue-300">Respuesta:</span>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {currentSecretQuestion.respuesta}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    Puedes cambiar tu pregunta secreta seleccionando una nueva opción abajo.
                  </p>
                </div>
              )}

              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {currentSecretQuestion.hasQuestion
                  ? "Actualiza tu pregunta secreta para recuperar tu contraseña en caso de olvidarla."
                  : "Configura una pregunta secreta para poder recuperar tu contraseña en caso de olvidarla."}
              </p>

              <form onSubmit={handleSaveSecretQuestion}>
                <div className="space-y-4">
                  {/* Seleccionar Pregunta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Selecciona una Pregunta *
                    </label>
                    <select
                      name="preguntaSecretaId"
                      value={secretQuestion.preguntaSecretaId}
                      onChange={handleSecretQuestionChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Selecciona una pregunta</option>
                      {preguntas.map((pregunta) => (
                        <option key={pregunta.id} value={pregunta.id}>
                          {pregunta.pregunta}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Respuesta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tu Respuesta *
                    </label>
                    <input
                      type="text"
                      name="respuestaSecreta"
                      value={secretQuestion.respuestaSecreta}
                      onChange={handleSecretQuestionChange}
                      required
                      minLength="3"
                      placeholder="Escribe tu respuesta aquí..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Recuerda esta respuesta exactamente como la escribes, la necesitarás para recuperar tu contraseña.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Guardando..."
                      : currentSecretQuestion.hasQuestion
                        ? "Actualizar Pregunta Secreta"
                        : "Guardar Pregunta Secreta"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

export default PerfilUsuario
