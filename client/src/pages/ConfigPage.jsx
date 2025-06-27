"use client"

import { useState, useEffect } from "react"
import { getUsuarios, unlock, blockUser, addUserRequest, updateUserTypeRequest } from "../api/auth.js"
import AdminLayout from "../layouts/AdminLayout.jsx"

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [actionType, setActionType] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedUserName, setSelectedUserName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Agregar estado para el usuario actual al inicio del componente, después de los otros estados
  const [currentUser, setCurrentUser] = useState(null)

  // Estado para el formulario de nuevo usuario
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
    nombre: "",
    apellidos: "",
    tipoUsuarioId: 2, // Cliente por defecto
  })
  const [addingUser, setAddingUser] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false,
    isValid: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  const tiposUsuario = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Cliente" },
    { id: 3, name: "Empleado" },
  ]

  // Agregar función para obtener el usuario actual después de los tiposUsuario
  const getCurrentUser = () => {
    // Intentar obtener el usuario actual desde localStorage o contexto
    try {
      const userData =
        localStorage.getItem("user") || localStorage.getItem("userData") || localStorage.getItem("currentUser")
      if (userData) {
        return JSON.parse(userData)
      }

      // Si no está en localStorage, intentar desde sessionStorage
      const sessionData =
        sessionStorage.getItem("user") || sessionStorage.getItem("userData") || sessionStorage.getItem("currentUser")
      if (sessionData) {
        return JSON.parse(sessionData)
      }
    } catch (error) {
      console.error("Error al obtener usuario actual:", error)
    }
    return null
  }

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }
    validation.isValid = validation.length && validation.number && validation.uppercase && validation.special
    return validation
  }

  // Modificar el useEffect existente para incluir la obtención del usuario actual
  useEffect(() => {
    fetchUsuarios()
    setCurrentUser(getCurrentUser())
  }, [])

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      console.log("Intentando cargar usuarios...")
      const response = await getUsuarios()
      console.log("Usuarios cargados exitosamente:", response.data)
      setUsuarios(response.data)
      setError(null)
    } catch (error) {
      console.error("Error detallado al obtener usuarios:", error)
      console.error("Response:", error.response)
      console.error("Status:", error.response?.status)
      console.error("Data:", error.response?.data)
      setError("No se pudieron cargar los usuarios. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    try {
      if (actionType === "block") {
        await blockUser(selectedUserId)
      } else if (actionType === "unlock") {
        await unlock(selectedUserId)
      }

      setSuccessMessage(`Usuario ${actionType === "block" ? "bloqueado" : "desbloqueado"} exitosamente`)
      setTimeout(() => setSuccessMessage(null), 3000)
      setError(null)
      setShowModal(false)

      // Intentar recargar usuarios
      try {
        const response = await getUsuarios()
        setUsuarios(response.data)
      } catch (fetchError) {
        console.error("Error al recargar usuarios:", fetchError)
        // Actualizar solo el estado del usuario específico
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((user) =>
            (user.id || user._id) === selectedUserId ? { ...user, isBlocked: actionType === "block" } : user,
          ),
        )
      }
    } catch (error) {
      console.error("Error al realizar la acción:", error)
      setError(`Error al ${actionType === "block" ? "bloquear" : "desbloquear"} al usuario.`)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setAddingUser(true)
    try {
      const response = await addUserRequest(newUser)
      setShowAddUserModal(false)
      setNewUser({
        email: "",
        password: "",
        username: "",
        nombre: "",
        apellidos: "",
        tipoUsuarioId: 2,
      })

      setSuccessMessage("Usuario agregado exitosamente")
      setTimeout(() => setSuccessMessage(null), 3000)
      setError(null)

      // Intentar recargar usuarios
      try {
        const response = await getUsuarios()
        setUsuarios(response.data)
      } catch (fetchError) {
        console.error("Error al recargar usuarios:", fetchError)
        // Agregar el nuevo usuario al estado local si tenemos la respuesta
        if (response?.data) {
          setUsuarios((prevUsuarios) => [...prevUsuarios, response.data])
        }
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error)
      setError(error.response?.data?.message || "Error al agregar el usuario.")
    } finally {
      setAddingUser(false)
    }
  }

  const handleUserTypeChange = async (userId, newTipoUsuarioId) => {
    setUpdatingUserId(userId)
    try {
      await updateUserTypeRequest(userId, newTipoUsuarioId)
      setSuccessMessage("Tipo de usuario actualizado exitosamente")
      setTimeout(() => setSuccessMessage(null), 3000)
      setError(null) // Limpiar errores previos

      // Intentar recargar usuarios, pero no mostrar error si falla
      try {
        const response = await getUsuarios()
        setUsuarios(response.data)
      } catch (fetchError) {
        console.error("Error al recargar usuarios después de actualización:", fetchError)
        // No mostrar error al usuario ya que la operación principal fue exitosa
        // Solo actualizar el usuario específico en el estado local
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((user) =>
            (user.id || user._id) === userId ? { ...user, tipoUsuarioId: newTipoUsuarioId } : user,
          ),
        )
      }
    } catch (error) {
      console.error("Error al actualizar tipo de usuario:", error)
      setError("Error al actualizar el tipo de usuario.")
    } finally {
      setUpdatingUserId(null)
    }
  }

  const openModal = (action, id, nombre, tipoUsuarioId) => {
    if (tipoUsuarioId === 1 && action === "block") {
      setError("No puedes bloquear a un administrador.")
      setTimeout(() => setError(null), 3000)
      return
    }
    setActionType(action)
    setSelectedUserId(id)
    setSelectedUserName(nombre)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setActionType("")
    setSelectedUserId(null)
    setSelectedUserName("")
  }

  const closeAddUserModal = () => {
    setShowAddUserModal(false)
    setNewUser({
      email: "",
      password: "",
      username: "",
      nombre: "",
      apellidos: "",
      tipoUsuarioId: 2,
    })
    setPasswordValidation({
      length: false,
      number: false,
      uppercase: false,
      special: false,
      isValid: false,
    })
  }

  const getRoleName = (tipoUsuarioId) => {
    switch (tipoUsuarioId) {
      case 1:
        return "Administrador"
      case 2:
        return "Cliente"
      case 3:
        return "Empleado"
      default:
        return "Desconocido"
    }
  }

  const getRoleIcon = (tipoUsuarioId) => {
    switch (tipoUsuarioId) {
      case 1:
        return (
          <svg
            className="w-5 h-5 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 2:
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )
      case 3:
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        )
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Administra los usuarios del sistema, bloquea o desbloquea cuentas según sea necesario.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${!searchTerm && "hidden"}`}
                >
                  ✕
                </button>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Usuario
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-4 bg-red dark:bg-red border border-red dark:border-red rounded-lg text-white dark:text-white flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red hover:text-white dark:text-red dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-4 bg-green-500 dark:bg-green-600 border border-green-500 dark:border-green-600 rounded-lg text-white dark:text-white flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">{successMessage}</div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-200 hover:text-white dark:text-green-200 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredUsuarios.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                    No se encontraron usuarios
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? "Intenta con otra búsqueda" : "No hay usuarios registrados en el sistema"}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Usuario
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Rol
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsuarios.map((usuario) => (
                      <tr
                        key={usuario.id || usuario._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{usuario.nombre}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRoleIcon(usuario.tipoUsuarioId)}
                            <select
                              value={usuario.tipoUsuarioId}
                              onChange={(e) =>
                                handleUserTypeChange(usuario.id || usuario._id, Number.parseInt(e.target.value))
                              }
                              disabled={
                                updatingUserId === (usuario.id || usuario._id) ||
                                (currentUser &&
                                  (currentUser.id === (usuario.id || usuario._id) ||
                                    currentUser._id === (usuario.id || usuario._id)))
                              }
                              className="ml-2 text-sm bg-transparent border-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {tiposUsuario.map((tipo) => (
                                <option
                                  key={tipo.id}
                                  value={tipo.id}
                                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                >
                                  {tipo.name}
                                </option>
                              ))}
                            </select>
                            {currentUser &&
                              (currentUser.id === (usuario.id || usuario._id) ||
                                currentUser._id === (usuario.id || usuario._id)) && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                  (Tu cuenta)
                                </span>
                              )}
                            {updatingUserId === (usuario.id || usuario._id) && (
                              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.isBlocked
                                ? "bg-red text-white dark:bg-red dark:text-white"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {usuario.isBlocked ? (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                Bloqueado
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                  />
                                </svg>
                                Activo
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {usuario.isBlocked ? (
                            <button
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              onClick={() =>
                                openModal("unlock", usuario.id || usuario._id, usuario.nombre, usuario.tipoUsuarioId)
                              }
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                              Desbloquear
                            </button>
                          ) : usuario.tipoUsuarioId === 1 ? (
                            <span className="text-gray-400 dark:text-gray-500 italic">Administrador protegido</span>
                          ) : (
                            <button
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red transition-colors"
                              onClick={() =>
                                openModal("block", usuario.id || usuario._id, usuario.nombre, usuario.tipoUsuarioId)
                              }
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                              Bloquear
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para bloquear/desbloquear */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                      actionType === "block" ? "bg-red dark:bg-red" : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {actionType === "block" ? (
                      <svg className="h-6 w-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-green-600 dark:text-green-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {actionType === "block" ? "Bloquear usuario" : "Desbloquear usuario"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {actionType === "block"
                          ? `¿Estás seguro de que quieres bloquear a ${selectedUserName}? El usuario no podrá acceder al sistema hasta que sea desbloqueado.`
                          : `¿Estás seguro de que quieres desbloquear a ${selectedUserName}? El usuario podrá volver a acceder al sistema.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    actionType === "block"
                      ? "bg-red hover:bg-red focus:ring-red"
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  }`}
                  onClick={handleAction}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar nuevo usuario */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="add-user-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddUser}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                        id="add-user-modal-title"
                      >
                        Agregar Nuevo Usuario
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="nombre"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Nombre
                            </label>
                            <input
                              type="text"
                              id="nombre"
                              required
                              value={newUser.nombre}
                              onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="apellidos"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Apellidos
                            </label>
                            <input
                              type="text"
                              id="apellidos"
                              required
                              value={newUser.apellidos}
                              onChange={(e) => setNewUser({ ...newUser, apellidos: e.target.value })}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Nombre de Usuario
                          </label>
                          <input
                            type="text"
                            id="username"
                            required
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              required
                              value={newUser.password}
                              onChange={(e) => {
                                setNewUser({ ...newUser, password: e.target.value })
                                setPasswordValidation(validatePassword(e.target.value))
                              }}
                              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L15.536 15.536M14.122 14.122a3 3 0 01-4.243 0M14.122 14.122l1.414 1.414M14.122 14.122a3 3 0 00.007-4.243"
                                  />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          {newUser.password && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400">La contraseña debe cumplir:</p>
                              <div className="space-y-1">
                                <div
                                  className={`flex items-center text-xs ${passwordValidation.length ? "text-green-600 dark:text-green-400" : "text-red dark:text-red"}`}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    {passwordValidation.length ? (
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    ) : (
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    )}
                                  </svg>
                                  Al menos 8 caracteres
                                </div>
                                <div
                                  className={`flex items-center text-xs ${passwordValidation.number ? "text-green-600 dark:text-green-400" : "text-red dark:text-red"}`}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    {passwordValidation.number ? (
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    ) : (
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    )}
                                  </svg>
                                  Al menos un número
                                </div>
                                <div
                                  className={`flex items-center text-xs ${passwordValidation.uppercase ? "text-green-600 dark:text-green-400" : "text-red dark:text-red"}`}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    {passwordValidation.uppercase ? (
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    ) : (
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    )}
                                  </svg>
                                  Al menos una letra mayúscula
                                </div>
                                <div
                                  className={`flex items-center text-xs ${passwordValidation.special ? "text-green-600 dark:text-green-400" : "text-red dark:text-red"}`}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    {passwordValidation.special ? (
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    ) : (
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    )}
                                  </svg>
                                  Al menos un carácter especial (!@#$%^&*)
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="tipoUsuario"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Tipo de Usuario
                          </label>
                          <select
                            id="tipoUsuario"
                            value={newUser.tipoUsuarioId}
                            onChange={(e) => setNewUser({ ...newUser, tipoUsuarioId: Number.parseInt(e.target.value) })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {tiposUsuario.map((tipo) => (
                              <option key={tipo.id} value={tipo.id}>
                                {tipo.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={addingUser || !passwordValidation.isValid}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingUser ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Agregando...
                      </>
                    ) : (
                      "Agregar Usuario"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeAddUserModal}
                    disabled={addingUser}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default UsuariosPage
