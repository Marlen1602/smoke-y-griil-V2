import { useState, useEffect } from "react"
import AdminLayout from "../layouts/AdminLayout.jsx"
import { Pencil, Trash2, Plus, Save, Eye, AlertCircle, X, Loader2 } from "lucide-react"

// Importamos directamente las funciones de tu archivo auth.js existente
import {
  obtenerDocumentos,
  obtenerDocumentoPorId,
  crearDocumento,
  actualizarDocumento,
  eliminarDocumento,
} from "../api/auth.js"

const DocumentosPage = () => {
  // Estados para manejar los documentos y la UI
  const [documentos, setDocumentos] = useState([])
  const [documentoActual, setDocumentoActual] = useState({ nombre: "", contenido: "" })
  const [modoEdicion, setModoEdicion] = useState(false)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [dialogoVisualizacion, setDialogoVisualizacion] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [cargandoTabla, setCargandoTabla] = useState(true)
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [documentosFiltrados, setDocumentosFiltrados] = useState([])
  const [ordenarPor, setOrdenarPor] = useState({ campo: "id", direccion: "asc" })
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })

  // Cargar documentos al montar el componente
  useEffect(() => {
    cargarDocumentos()
  }, [])

  // Filtrar documentos cuando cambia la búsqueda o los documentos
  useEffect(() => {
    filtrarDocumentos()
  }, [busqueda, documentos, ordenarPor])

  // Función para mostrar notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 5000)
  }

  // Función para filtrar y ordenar documentos
  const filtrarDocumentos = () => {
    let resultado = [...documentos]

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase()
      resultado = resultado.filter(
        (doc) =>
          doc.nombre?.toLowerCase().includes(terminoBusqueda) || doc.contenido?.toLowerCase().includes(terminoBusqueda),
      )
    }

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      const valorA = a[ordenarPor.campo]
      const valorB = b[ordenarPor.campo]

      if (typeof valorA === "string") {
        return ordenarPor.direccion === "asc" ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
      } else {
        return ordenarPor.direccion === "asc" ? valorA - valorB : valorB - valorA
      }
    })

    setDocumentosFiltrados(resultado)
  }

  // Función para cambiar el ordenamiento
  const cambiarOrdenamiento = (campo) => {
    setOrdenarPor((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }))
  }

  // Función para cargar todos los documentos
  const cargarDocumentos = async () => {
    setCargandoTabla(true)
    setErrorServidor("")

    try {
      const respuesta = await obtenerDocumentos()
      setDocumentos(respuesta.data)
    } catch (error) {
      console.error("Error al cargar documentos:", error)
      setErrorServidor("No se pudieron cargar los documentos legales. Por favor, intente nuevamente más tarde.")
      showNotification("error", "No se pudieron cargar los documentos legales")
    } finally {
      setCargandoTabla(false)
    }
  }

  // Función para abrir el diálogo de creación
  const abrirDialogoCreacion = () => {
    setDocumentoActual({ nombre: "", contenido: "" })
    setModoEdicion(false)
    setErrores({})
    setErrorServidor("")
    setDialogoAbierto(true)
  }

  // Función para abrir el diálogo de edición
  const abrirDialogoEdicion = async (id) => {
    setCargando(true)
    setErrores({})
    setErrorServidor("")

    try {
      const respuesta = await obtenerDocumentoPorId(id)
      setDocumentoActual(respuesta.data)
      setModoEdicion(true)
      setDialogoAbierto(true)
    } catch (error) {
      console.error("Error al obtener documento:", error)
      setErrorServidor("No se pudo cargar el documento para editar. Por favor, intente nuevamente.")
      showNotification("error", "No se pudo cargar el documento para editar")
    } finally {
      setCargando(false)
    }
  }

  // Función para visualizar un documento
  const visualizarDocumento = async (id) => {
    setCargando(true)
    setErrorServidor("")

    try {
      const respuesta = await obtenerDocumentoPorId(id)
      setDocumentoActual(respuesta.data)
      setDialogoVisualizacion(true)
    } catch (error) {
      console.error("Error al obtener documento:", error)
      setErrorServidor("No se pudo cargar el documento para visualizar. Por favor, intente nuevamente.")
      showNotification("error", "No se pudo cargar el documento para visualizar")
    } finally {
      setCargando(false)
    }
  }

  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target
    setDocumentoActual((prev) => ({ ...prev, [name]: value }))

    // Limpiar errores al escribir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!documentoActual.nombre?.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio"
    } else if (documentoActual.nombre.length > 100) {
      nuevosErrores.nombre = "El nombre no puede exceder los 100 caracteres"
    }

    if (!documentoActual.contenido?.trim()) {
      nuevosErrores.contenido = "El contenido es obligatorio"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Función para guardar un documento (crear o actualizar)
  const guardarDocumento = async () => {
    // Validar formulario
    if (!validarFormulario()) {
      return
    }

    setCargando(true)
    setErrorServidor("")

    try {
      if (modoEdicion && documentoActual.id) {
        await actualizarDocumento(documentoActual.id, documentoActual)
        showNotification("success", "Documento actualizado correctamente")
      } else {
        await crearDocumento(documentoActual)
        showNotification("success", "Documento creado correctamente")
      }
      setDialogoAbierto(false)
      cargarDocumentos()
    } catch (error) {
      console.error("Error al guardar documento:", error)
      setErrorServidor("Ocurrió un error al guardar el documento. Por favor, intente nuevamente.")
      showNotification("error", "No se pudo guardar el documento")
    } finally {
      setCargando(false)
    }
  }

  // Función para confirmar eliminación
  const confirmarEliminar = (id) => {
    setConfirmacionEliminar(id)
    setErrorServidor("")
  }

  // Función para eliminar un documento
  const eliminarDocumentoConfirmado = async () => {
    if (confirmacionEliminar === null) return

    setCargando(true)
    setErrorServidor("")

    try {
      await eliminarDocumento(confirmacionEliminar)
      showNotification("success", "Documento eliminado correctamente")
      setConfirmacionEliminar(null)
      cargarDocumentos()
    } catch (error) {
      console.error("Error al eliminar documento:", error)
      setErrorServidor("No se pudo eliminar el documento. Por favor, intente nuevamente.")
      showNotification("error", "No se pudo eliminar el documento")
    } finally {
      setCargando(false)
    }
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A"

    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return fecha
    }
  }

  // Función para truncar texto
  const truncarTexto = (texto, longitud = 50) => {
    if (!texto) return ""
    return texto.length > longitud ? texto.substring(0, longitud) + "..." : texto
  }

  // Renderizar indicador de ordenamiento
  const renderizarIndicadorOrden = (campo) => {
    if (ordenarPor.campo !== campo) return null

    return ordenarPor.direccion === "asc" ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>
  }

  return (
    <AdminLayout>
          {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all transform translate-y-0 ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red border-l-4 border-red text-white"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p>{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, type: "", message: "" })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white">
            <h1 className="text-3xl font-bold">Documentos Legales</h1>
            <p className="mt-2 opacity-80">Gestione los documentos legales de su organización</p>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {/* Barra de búsqueda y botón de nuevo documento */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={abrirDialogoCreacion}
                className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Documento
              </button>
            </div>

            {/* Mensaje de error del servidor */}
            {errorServidor && (
              <div className="bg-red border-l-4 border-red text-white p-4 mb-6 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{errorServidor}</p>
                </div>
              </div>
            )}

            {/* Estado de carga */}
            {cargandoTabla ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando documentos...</p>
              </div>
            ) : documentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay documentos</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  No se encontraron documentos legales. Haga clic en "Nuevo Documento" para crear uno.
                </p>
              </div>
            ) : documentosFiltrados.length === 0 && busqueda ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin resultados</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  No se encontraron documentos que coincidan con "{busqueda}".
                </p>
                <button
                  onClick={() => setBusqueda("")}
                  className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => cambiarOrdenamiento("id")}
                      >
                        <div className="flex items-center">ID {renderizarIndicadorOrden("id")}</div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => cambiarOrdenamiento("nombre")}
                      >
                        <div className="flex items-center">Nombre {renderizarIndicadorOrden("nombre")}</div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                      >
                        Contenido
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => cambiarOrdenamiento("fecha_actualizacion")}
                      >
                        <div className="flex items-center">
                          Actualización {renderizarIndicadorOrden("fecha_actualizacion")}
                        </div>
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
                    {documentosFiltrados.map((documento) => (
                      <tr key={documento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {documento.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {documento.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          {truncarTexto(documento.contenido, 80)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                            {formatearFecha(documento.fecha_actualizacion)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => visualizarDocumento(documento.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Ver documento"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => abrirDialogoEdicion(documento.id)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title="Editar documento"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => confirmarEliminar(documento.id)}
                              className="text-red hover:text-red dark:text-red dark:hover:text-red"
                              title="Eliminar documento"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar documento */}
      {dialogoAbierto && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {modoEdicion ? "Editar Documento Legal" : "Crear Nuevo Documento Legal"}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nombre del Documento *
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={documentoActual.nombre || ""}
                          onChange={manejarCambio}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errores.nombre ? "border-red" : "border-gray-300 dark:border-gray-600"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                          placeholder="Nombre del documento"
                        />
                        {errores.nombre && <p className="mt-1 text-sm text-red">{errores.nombre}</p>}
                      </div>
                      <div>
                        <label
                          htmlFor="contenido"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Contenido *
                        </label>
                        <textarea
                          id="contenido"
                          name="contenido"
                          value={documentoActual.contenido || ""}
                          onChange={manejarCambio}
                          rows={10}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errores.contenido ? "border-red" : "border-gray-300 dark:border-gray-600"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                          placeholder="Contenido del documento"
                        />
                        {errores.contenido && <p className="mt-1 text-sm text-red">{errores.contenido}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    cargando
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={guardarDocumento}
                  disabled={cargando}
                >
                  {cargando ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      {modoEdicion ? "Guardando..." : "Creando..."}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDialogoAbierto(false)}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para visualizar documento */}
      {dialogoVisualizacion && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {documentoActual.nombre}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Última actualización: {formatearFecha(documentoActual.fecha_actualizacion)}
                      </p>
                      <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 max-h-96 overflow-y-auto">
                        <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                          {documentoActual.contenido || <span className="italic text-gray-500">Sin contenido</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setDialogoVisualizacion(false)
                    if (documentoActual.id) {
                      abrirDialogoEdicion(documentoActual.id)
                    }
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDialogoVisualizacion(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmacionEliminar !== null && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red dark:bg-red sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-white dark:text-white" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Confirmar eliminación
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ¿Está seguro de que desea eliminar este documento legal? Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    cargando
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-red text-white hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={eliminarDocumentoConfirmado}
                  disabled={cargando}
                >
                  {cargando ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Eliminando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmacionEliminar(null)}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          
    </AdminLayout>
  )
}


export default DocumentosPage

