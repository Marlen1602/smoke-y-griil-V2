import { useState, useEffect } from "react"
import AdminNavBar from "./AdminNavBar"
import { getEmpresaProfile, updateEmpresaProfile } from "../api/auth"
import { getRedesSociales, createRedSocial, updateRedSocial, deleteRedSocial } from "../api/auth"
import Footer from './Footer.jsx';

const EmpresaPage = () => {
  // Estados principales
  const [empresa, setEmpresa] = useState({
    ID_empresa: "",
    Nombre: "",
    Eslogan: "",
    Mision: "",
    Vision: "",
    Horario: "",
    Direccion: "",
    Logo: "",
  })

  // Estados para redes sociales (tabla separada)
  const [redes, setRedes] = useState([])
  const [newRed, setNewRed] = useState({ nombre: "", link: "" })
  const [editingRed, setEditingRed] = useState(null)
  const [redesLoading, setRedesLoading] = useState(true)

  // Estados para UI
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })
  const [showRedModal, setShowRedModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [redToDelete, setRedToDelete] = useState(null)
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState("informacion")
  const [isSaving, setIsSaving] = useState(false)

  // Cargar datos de empresa
  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        setIsLoading(true)

        // Cargar datos de la empresa
        const empresaResponse = await getEmpresaProfile()
        if (empresaResponse.data) {
          setEmpresa(empresaResponse.data)
          setLogoPreview(empresaResponse.data.Logo)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error)
        showNotification("error", "No se pudieron cargar los datos de la empresa. Intente nuevamente.")
        setIsLoading(false)
      }
    }

    fetchEmpresaData()
  }, [])

  // Cargar redes sociales (tabla separada)
  const fetchRedesSociales = async () => {
    try {
      setRedesLoading(true)

      // Cargar redes sociales desde su propia tabla
      const redesResponse = await getRedesSociales()
      console.log("Respuesta completa de redes sociales:", redesResponse)

      if (redesResponse.data) {
        console.log("Redes sociales cargadas:", redesResponse.data)

        // Asegurarse de que estamos trabajando con un array
        let redesArray = Array.isArray(redesResponse.data) ? redesResponse.data : [redesResponse.data]

        // Verificar si hay redes sociales con ID nulo y mostrar advertencia
        const redesSinId = redesArray.filter((red) => !red || (!red.id && !red.ID))
        if (redesSinId.length > 0) {
          console.warn("Se encontraron redes sociales con ID nulo:", redesSinId)
          showNotification(
            "error",
            `Se encontraron ${redesSinId.length} redes sociales con ID nulo en la base de datos. Contacte al administrador.`,
          )
        }

        // Filtrar redes sociales sin ID válido y normalizar la propiedad id
        redesArray = redesArray
          .filter((red) => red && (red.id || red.ID))
          .map((red) => {
            // Normalizar: asegurarse de que siempre haya una propiedad 'id' (minúscula)
            if (!red.id && !red.ID) {
              red.id = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
              console.warn("Generando ID temporal para red social sin ID:", red)
            }

            return {
              id: red.id || red.ID || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              nombre: red.nombre || "Sin nombre",
              link: red.link || "#",
              ID_empresa: red.ID_empresa || empresa.ID_empresa,
              ...red, // Mantener otras propiedades que pueda tener
            }
          })

        console.log("Redes sociales después de filtrar IDs nulos:", redesArray)
        setRedes(redesArray)
      } else {
        console.log("No se encontraron redes sociales")
        setRedes([])
      }
    } catch (error) {
      console.error("Error al cargar las redes sociales:", error)
      showNotification("error", "No se pudieron cargar las redes sociales. Intente nuevamente.")
      setRedes([])
    } finally {
      setRedesLoading(false)
    }
  }

  useEffect(() => {
    fetchRedesSociales()
  }, [])

  // Función para mostrar notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 5000)
  }

  // Manejar cambios en los campos de empresa
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, [name]: value }))

    // Limpiar error si el campo tiene valor
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Manejar selección de imagen
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        showNotification("error", "El archivo debe ser una imagen (JPG, PNG, GIF, SVG)")
        return
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showNotification("error", "La imagen no debe superar los 2MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
        setLogoFile(file)
      }
      reader.readAsDataURL(file)
      setErrors((prev) => ({ ...prev, Logo: "" }))
    }
  }

  // Validar formulario de empresa
  const validateEmpresaForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    const requiredFields = ["Nombre", "Direccion"]
    requiredFields.forEach((field) => {
      if (!empresa[field] || empresa[field].trim() === "") {
        newErrors[field] = `El campo ${field} es obligatorio`
      }
    })

    // Validar longitud de campos
    if (empresa.Nombre && empresa.Nombre.length > 100) {
      newErrors.Nombre = "El nombre no debe exceder los 100 caracteres"
    }

    if (empresa.Eslogan && empresa.Eslogan.length > 200) {
      newErrors.Eslogan = "El eslogan no debe exceder los 200 caracteres"
    }

    if (empresa.Direccion && empresa.Direccion.length > 255) {
      newErrors.Direccion = "La dirección no debe exceder los 255 caracteres"
    }

    // Validar que haya un logo
    if (!logoPreview && !empresa.Logo) {
      newErrors.Logo = "Debe seleccionar un logo para la empresa"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar cambios de empresa
  const handleSaveChanges = async () => {
    if (!validateEmpresaForm()) {
      showNotification("error", "Por favor, corrija los errores antes de guardar")
      return
    }

    setIsSaving(true)
    try {
      // Crear FormData para enviar la imagen
      const formData = new FormData()

      // Agregar todos los campos de texto
      Object.keys(empresa).forEach((key) => {
        if (key !== "Logo") {
          formData.append(key, empresa[key])
        }
      })

      // Agregar el logo si hay uno nuevo
      if (logoFile) {
        formData.append("Logo", logoFile)
      }

      const response = await updateEmpresaProfile(empresa.ID_empresa, formData)

      if (response.status === 200) {
        showNotification("success", "Cambios guardados correctamente")

        // Actualizar solo los datos necesarios, manteniendo los valores actuales
        if (response.data) {
          // Mantener los valores actuales y solo actualizar lo que viene de la respuesta
          setEmpresa((prevEmpresa) => ({
            ...prevEmpresa,
            ...response.data,
          }))

          // Si hay un nuevo logo en la respuesta, actualizarlo
          if (response.data.Logo && response.data.Logo !== empresa.Logo) {
            setLogoPreview(response.data.Logo)
          }
        }
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
      showNotification("error", "Error al guardar los cambios. Intente nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  // Validar formulario de red social
  const validateRedSocialForm = (red) => {
    const redErrors = {}

    if (!red.nombre || red.nombre.trim() === "") {
      redErrors.nombre = "El nombre de la red social es obligatorio"
    }

    if (!red.link || red.link.trim() === "") {
      redErrors.link = "El enlace de la red social es obligatorio"
    } else if (!isValidURL(red.link)) {
      redErrors.link = "El enlace debe ser una URL válida (ej: https://ejemplo.com)"
    }

    // Validar duplicados de nombre (ignorando el caso y espacios)
    const normalizedNombre = red.nombre.trim().toLowerCase()
    const nombreExistente = redes.find(
      (r) => r.nombre && r.nombre.trim().toLowerCase() === normalizedNombre && (!editingRed || r.id !== editingRed.id),
    )

    if (nombreExistente) {
      redErrors.nombre = `Ya existe una red social con el nombre "${red.nombre}"`
    }

    // Validar duplicados de URL (ignorando el caso)
    const normalizedLink = red.link.trim().toLowerCase()
    const linkExistente = redes.find(
      (r) => r.link && r.link.trim().toLowerCase() === normalizedLink && (!editingRed || r.id !== editingRed.id),
    )

    if (linkExistente) {
      redErrors.link = `Ya existe una red social con este enlace`
    }

    setErrors(redErrors)
    return Object.keys(redErrors).length === 0
  }

  // Validar URL
  const isValidURL = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Abrir modal para agregar red social
  const openAddRedModal = () => {
    setEditingRed(null)
    setNewRed({ nombre: "", link: "" })
    setErrors({})
    setShowRedModal(true)
  }

  // Abrir modal para editar red social
  const openEditRedModal = (red) => {
    console.log("Abriendo modal para editar red:", red)
    setEditingRed(red)
    setNewRed({
      nombre: red.nombre || "",
      link: red.link || "",
    })
    setErrors({})
    setShowRedModal(true)
  }

  // Cerrar modal de red social
  const closeRedModal = () => {
    setShowRedModal(false)
    setEditingRed(null)
    setNewRed({ nombre: "", link: "" })
    setErrors({})
  }

  // Manejar cambios en el formulario de red social
  const handleRedInputChange = (e) => {
    const { name, value } = e.target
    setNewRed((prev) => ({ ...prev, [name]: value }))

    // Limpiar error si el campo tiene valor
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

 // Guardar red social (crear o actualizar)
 const handleSaveRed = async () => {
  if (!validateRedSocialForm(newRed)) {
    return
  }

  setIsSaving(true)
  try {
    const redData = {
      nombre: newRed.nombre.trim(),
      link: newRed.link.trim(),
      ID_empresa: empresa.ID_empresa,
    }

    if (editingRed) {
      // Actualizar red social existente
      console.log("Actualizando red social con ID:", editingRed.id, "Datos:", redData)

      const response = await updateRedSocial(editingRed.id, redData)
      console.log("Respuesta completa de actualización:", response)

      // No validar estrictamente el ID en la respuesta, usar el ID existente
      const updatedRed = {
        ...redData,
        id: editingRed.id, // Mantener el ID original
      }

      // Si hay datos en la respuesta, incorporarlos
      if (response && response.data) {
        Object.assign(updatedRed, response.data)

        // Normalizar el ID si viene en mayúscula
        if (response.data.ID && !response.data.id) {
          updatedRed.id = response.data.ID
        }
      }

      console.log("Red social actualizada:", updatedRed)

      // Actualizar la lista de redes
      setRedes(redes.map((red) => (red.id === editingRed.id ? updatedRed : red)))

      showNotification("success", "Red social actualizada correctamente")
    } else {
      // Crear nueva red social
      console.log("Creando nueva red social:", redData)

      const response = await createRedSocial(redData)
      console.log("Respuesta completa de creación:", response)

      // Crear un objeto con los datos enviados como base
      const newRedData = { ...redData }

      // Si hay datos en la respuesta, incorporarlos
      if (response && response.data) {
        Object.assign(newRedData, response.data)

        // Normalizar el ID si viene en mayúscula
        if (response.data.ID && !response.data.id) {
          newRedData.id = response.data.ID
        }
      }

      // Generar un ID temporal si no hay uno en la respuesta
      if (!newRedData.id && !newRedData.ID) {
        newRedData.id = `temp_${Date.now()}`
        console.log("Usando ID temporal:", newRedData.id)
      }

      console.log("Nueva red social con ID asignado:", newRedData)

      // Agregar la nueva red a la lista
      setRedes((prev) => [...prev, newRedData])

      showNotification("success", "Red social agregada correctamente")
    }

    closeRedModal()

    // Recargar las redes sociales para asegurar que tenemos los datos actualizados
    setTimeout(() => {
      fetchRedesSociales()
    }, 500)
  } catch (error) {
    console.error("Error al guardar red social:", error)
    console.error("Detalles adicionales:", error.response || "No hay detalles adicionales")
    showNotification("error", `Error al guardar la red social: ${error.message || "Intente nuevamente."}`)
  } finally {
    setIsSaving(false)
  }
}

  // Abrir modal de confirmación para eliminar
  const confirmDeleteRed = (red) => {
    // Verificar que la red social tenga un ID válido
    if (!red || !red.id) {
      console.error("Error: Intentando eliminar una red social sin ID", red)
      showNotification("error", "No se puede eliminar esta red social porque no tiene un ID válido")
      return
    }

    setRedToDelete(red)
    setShowDeleteModal(true)
  }

  // Eliminar red social
  const handleDeleteRed = async () => {
    if (!redToDelete || !redToDelete.id) {
      showNotification("error", "No se puede eliminar la red social porque no tiene un ID válido")
      setShowDeleteModal(false)
      setRedToDelete(null)
      return
    }

    setIsSaving(true)
    try {
      console.log("Eliminando red social con ID:", redToDelete.id)

      await deleteRedSocial(redToDelete.id)

      // Actualizar la lista de redes
      setRedes(redes.filter((red) => red.id !== redToDelete.id))

      showNotification("success", "Red social eliminada correctamente")
      setShowDeleteModal(false)
      setRedToDelete(null)

      // Recargar las redes sociales para asegurar que tenemos los datos actualizados
      fetchRedesSociales()
    } catch (error) {
      console.error("Error al eliminar red social:", error)
      showNotification("error", "Error al eliminar la red social. Intente nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  // Determinar el ícono para una red social
  const getRedSocialIcon = (nombre) => {
    // Verificar si nombre es undefined o null
    if (!nombre) {
      console.warn("Nombre de red social indefinido", nombre)
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
    }

    const normalizedName = nombre.toLowerCase()

    if (normalizedName.includes("facebook")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      )
    } else if (normalizedName.includes("twitter") || normalizedName.includes("x")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
      )
    } else if (normalizedName.includes("instagram")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
        </svg>
      )
    } else if (normalizedName.includes("linkedin")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      )
    } else if (normalizedName.includes("youtube")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
        </svg>
      )
    } else if (normalizedName.includes("tiktok")) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
    }
  }

  // Renderizar el componente
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <AdminNavBar />

      {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all transform translate-y-0 ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red text-red"
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Perfil de la Empresa</h1>
            <p className="mt-2 opacity-80">Gestione la información y redes sociales de su empresa</p>
          </div>

          {/* Pestañas */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "informacion"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("informacion")}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información General
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "redes"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("redes")}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Redes Sociales
              </button>
            </nav>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Pestaña de Información General */}
                {activeTab === "informacion" && (
                  <div className="space-y-6">
                    {/* Logo */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Logo de la Empresa
                        </label>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                          {logoPreview ? (
                            <div className="relative group">
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo Preview"
                                className="w-32 h-32 object-contain rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <button
                                  onClick={() => {
                                    setLogoPreview(null)
                                    setLogoFile(null)
                                  }}
                                  className="p-2 bg-red rounded-full text-white"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Haga clic para seleccionar un logo
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF hasta 2MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                          >
                            {logoPreview ? "Cambiar logo" : "Seleccionar logo"}
                          </label>
                          {errors.Logo && <p className="mt-2 text-sm text-red">{errors.Logo}</p>}
                        </div>
                      </div>

                      <div className="w-full md:w-2/3 space-y-4">
                        {/* Nombre y Eslogan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Nombre de la Empresa *
                            </label>
                            <input
                              type="text"
                              name="Nombre"
                              value={empresa.Nombre || ""}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 rounded-md border ${
                                errors.Nombre
                                  ? "border-red focus:ring-red focus:border-red"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                              placeholder="Nombre de la empresa"
                            />
                            {errors.Nombre && <p className="mt-1 text-sm text-red">{errors.Nombre}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Eslogan
                            </label>
                            <input
                              type="text"
                              name="Eslogan"
                              value={empresa.Eslogan || ""}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 rounded-md border ${
                                errors.Eslogan
                                  ? "border-red focus:ring-red focus:border-red"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                              placeholder="Eslogan de la empresa"
                            />
                            {errors.Eslogan && <p className="mt-1 text-sm text-red">{errors.Eslogan}</p>}
                          </div>
                        </div>

                        {/* Dirección y Horario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Dirección *
                            </label>
                            <input
                              type="text"
                              name="Direccion"
                              value={empresa.Direccion || ""}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 rounded-md border ${
                                errors.Direccion
                                  ? "border-red focus:ring-red focus:border-red"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                              placeholder="Dirección física"
                            />
                            {errors.Direccion && <p className="mt-1 text-sm text-red">{errors.Direccion}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Horario de Atención
                            </label>
                            <input
                              type="text"
                              name="Horario"
                              value={empresa.Horario || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                            />
                          </div>
                        </div>

                        {/* Misión y Visión */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Misión
                            </label>
                            <textarea
                              name="Mision"
                              value={empresa.Mision || ""}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Misión de la empresa"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Visión
                            </label>
                            <textarea
                              name="Vision"
                              value={empresa.Vision || ""}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Visión de la empresa"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end mt-6">
                      <button
                        className={`px-6 py-3 rounded-md shadow-md text-white font-medium transition-colors ${
                          isSaving
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        }`}
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Guardando...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Cambios
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Pestaña de Redes Sociales */}
                {activeTab === "redes" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Redes Sociales</h2>
                      <button
                        onClick={openAddRedModal}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Agregar Red Social
                      </button>
                    </div>

                    {/* Estado de carga de redes sociales */}
                    {redesLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : redes.length === 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          No hay redes sociales
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Comience agregando sus redes sociales para mostrarlas en su sitio web.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={openAddRedModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Agregar Red Social
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {redes.map((red) => {
                          console.log("Renderizando red social:", red) // Añadir esta línea para depuración
                          // Solo renderizar redes sociales con ID válido
                          if (!red || !red.id) {
                            console.warn("Red social sin ID válido:", red)
                            return null
                          }
                          return (
                            <div
                              key={red.id}
                              className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                                  {getRedSocialIcon(red.nombre)}
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {red.nombre || "Red social"}
                                  </h3>
                                  <a
                                    href={red.link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                                  >
                                    {red.link || "Sin enlace"}
                                  </a>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEditRedModal(red)}
                                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                  title="Editar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => confirmDeleteRed(red)}
                                  className="p-2 text-gray-500 hover:text-red dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                  title="Eliminar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar red social */}
      {showRedModal && (
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
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {editingRed ? "Editar Red Social" : "Agregar Red Social"}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nombre de la Red Social *
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={newRed.nombre}
                          onChange={handleRedInputChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.nombre ? "border-red" : "border-gray-300 dark:border-gray-600"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                          placeholder="Ej: Facebook, Instagram, Twitter"
                        />
                        {errors.nombre && <p className="mt-1 text-sm text-red">{errors.nombre}</p>}
                      </div>
                      <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Enlace (URL) *
                        </label>
                        <input
                          type="text"
                          id="link"
                          name="link"
                          value={newRed.link}
                          onChange={handleRedInputChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            errors.link ? "border-red" : "border-gray-300 dark:border-gray-600"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                          placeholder="https://www.ejemplo.com/perfil"
                        />
                        {errors.link && <p className="mt-1 text-sm text-red">{errors.link}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    isSaving
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleSaveRed}
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeRedModal}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red dark:text-red-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Eliminar Red Social
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ¿Está seguro de que desea eliminar la red social "{redToDelete?.nombre}"? Esta acción no se
                        puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    isSaving
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-red text-white hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleDeleteRed}
                  disabled={isSaving}
                >
                  {isSaving ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setRedToDelete(null)
                  }}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  )
}

export default EmpresaPage

