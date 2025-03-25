import { useState, useEffect } from "react"
import { useAuth } from "../contex/AuthContext"
import ClientLayout from  "../layouts/ClientLayaut.jsx"
import { obtenerPreguntasSecretas, agregarPreguntaSecreta } from "../api/auth.js"

const PerfilUsuario = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("datos")
  const [preguntas, setPreguntas] = useState([])
  const [editMode, setEditMode] = useState(false)

  // Estados para los datos del usuario
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
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

  // Cargar datos del usuario y preguntas secretas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Cargar datos del usuario (simulado, reemplazar con tu API real)
        if (user) {
          setUserData({
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            email: user.email || "",
            telefono: user.telefono || "",
            direccion: user.direccion || "",
          })
        }

        // Cargar preguntas secretas
        const preguntasRes = await obtenerPreguntasSecretas()
        setPreguntas(preguntasRes.data)
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
    setUserData({
      ...userData,
      [name]: value,
    })
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

  // Guardar datos personales
  const handleSaveUserData = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Llamada a la API para actualizar datos (reemplazar con tu API real)
      // await axios.put(`${API}/usuarios/perfil`, userData, { withCredentials: true })

      // Simulación de actualización exitosa
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "Datos actualizados correctamente",
        })
        setEditMode(false)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error al actualizar datos:", error)
      setMessage({
        type: "error",
        text: "Error al actualizar los datos. Por favor, intente nuevamente.",
      })
      setLoading(false)
    }
  }

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault()

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
      // Llamada a la API para cambiar contraseña (reemplazar con tu API real)
      // await axios.put(`${API}/usuarios/cambiar-password`, passwordData, { withCredentials: true })

      // Simulación de actualización exitosa
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "Contraseña actualizada correctamente",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      setMessage({
        type: "error",
        text: "Error al cambiar la contraseña. Por favor, intente nuevamente.",
      })
      setLoading(false)
    }
  }

  // Guardar pregunta secreta
  const handleSaveSecretQuestion = async (e) => {
    e.preventDefault()

    if (!secretQuestion.preguntaSecretaId || !secretQuestion.respuestaSecreta) {
      setMessage({
        type: "error",
        text: "Por favor, seleccione una pregunta y escriba una respuesta",
      })
      return
    }

    setLoading(true)
    try {
      // Llamada a la API para guardar pregunta secreta
      await agregarPreguntaSecreta(secretQuestion.preguntaSecretaId, secretQuestion.respuestaSecreta)

      setMessage({
        type: "success",
        text: "Pregunta secreta guardada correctamente",
      })
      setLoading(false)
    } catch (error) {
      console.error("Error al guardar pregunta secreta:", error)
      setMessage({
        type: "error",
        text: "Error al guardar la pregunta secreta. Por favor, intente nuevamente.",
      })
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
                : "bg-red border border-red text-white dark:bg-red dark:border-red dark:text-white"
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
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === "datos"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("datos")}
              >
                Datos Personales
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === "password"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("password")}
              >
                Cambiar Contraseña
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === "pregunta"
                    ? "text-orange-600 border-b-2 border-orange-600 dark:text-orange-500 dark:border-orange-500"
                    : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("pregunta")}
              >
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
                    onClick={() => setEditMode(false)}
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
                      disabled={true} // No se puede modificar
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">El nombre no se puede modificar</p>
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={userData.apellido}
                      onChange={handleUserDataChange}
                      disabled={true} // No se puede modificar
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">El apellido no se puede modificar</p>
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
                      disabled={true} // No se puede modificar
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={userData.telefono}
                      onChange={handleUserDataChange}
                      disabled={!editMode}
                      className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                        !editMode ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                      } text-gray-700 dark:text-gray-300`}
                    />
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                    <textarea
                      name="direccion"
                      value={userData.direccion}
                      onChange={handleUserDataChange}
                      disabled={!editMode}
                      rows="3"
                      className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                        !editMode ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                      } text-gray-700 dark:text-gray-300`}
                    ></textarea>
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

              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  {/* Contraseña Actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
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
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Configura una pregunta secreta para poder recuperar tu contraseña en caso de olvidarla.
              </p>

              <form onSubmit={handleSaveSecretQuestion}>
                <div className="space-y-4">
                  {/* Seleccionar Pregunta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Selecciona una Pregunta
                    </label>
                    <select
                      name="preguntaSecretaId"
                      value={secretQuestion.preguntaSecretaId}
                      onChange={handleSecretQuestionChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                      Tu Respuesta
                    </label>
                    <input
                      type="text"
                      name="respuestaSecreta"
                      value={secretQuestion.respuestaSecreta}
                      onChange={handleSecretQuestionChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                    {loading ? "Guardando..." : "Guardar Pregunta Secreta"}
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

