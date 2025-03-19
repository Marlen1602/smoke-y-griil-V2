import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  getProductosRequest,
  createProductoRequest,
  deleteProductoRequest,
  uploadImagenRequest,
  getCategorias,
  updateProductoRequest,
} from "../api/auth.js"

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [productoToDelete, setProductoToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProducto, setCurrentProducto] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [successMessage, setSuccessMessage] = useState("") // Nuevo estado para mensajes de éxito

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Nombre: "",
      Descripcion: "",
      Precio: "",
      ID_Categoria: "",
      TieneTamanos: false,
      Disponible: true,
    },
    mode: "onChange",
  })

  const tieneTamanos = watch("TieneTamanos")

  // 🔹 Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProductos()
    loadCategorias()
  }, [])

  // Efecto para deshabilitar el precio cuando tiene tamaños
  useEffect(() => {
    if (tieneTamanos) {
      setValue("Precio", "")
    }
  }, [tieneTamanos, setValue])

  // Agregar este nuevo useEffect
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const loadProductos = async () => {
    try {
      setLoading(true)
      const res = await getProductosRequest()
      setProductos(res.data)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      setProductos([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategorias = async () => {
    try {
      const res = await getCategorias()
      setCategorias(res.data)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      setCategorias([])
    }
  }

  // 🔹 Manejar imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      // Crear URL para vista previa
      const previewUrl = URL.createObjectURL(file)
      setImagenPreview(previewUrl)
    }
  }

  // 🔹 Limpiar imagen
  const handleClearImage = () => {
    setImagen(null)
    setImagenPreview(null)
    // Resetear el input de archivo
    const fileInput = document.getElementById("imagen-input")
    if (fileInput) fileInput.value = ""
  }

  // 🔹 Iniciar edición de producto
  const startEdit = (producto) => {
    setCurrentProducto(producto)
    setEditMode(true)
    setShowEditModal(true)
    setUpdateError("")
    setSuccessMessage("")

    // Cargar datos del producto en el formulario
    reset({
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Precio: producto.Precio ? producto.Precio.toString() : "",
      ID_Categoria: producto.ID_Categoria ? producto.ID_Categoria.toString() : "",
      TieneTamanos: producto.TieneTamanos,
      Disponible: producto.Disponible,
    })

    // Si el producto tiene imagen, mostrarla en la vista previa
    if (producto.ImagenURL) {
      setImagenPreview(producto.ImagenURL)
    } else {
      setImagenPreview(null)
    }
  }

  // 🔹 Cancelar edición
  const cancelEdit = () => {
    setEditMode(false)
    setCurrentProducto(null)
    setShowEditModal(false)
    setImagen(null)
    setImagenPreview(null)
    setUpdateError("")
    setSuccessMessage("")

    // Resetear formulario
    reset({
      Nombre: "",
      Descripcion: "",
      Precio: "",
      ID_Categoria: "",
      TieneTamanos: false,
      Disponible: true,
    })
  }

  // Modificar la función onSubmit para agregar validación de imagen y mensajes de éxito
  const onSubmit = async (data) => {
    setLoading(true)
    setUpdateError("")

    try {
      // Validar que se haya seleccionado una imagen para productos nuevos
      if (!editMode && !imagen) {
        setUpdateError("Debe seleccionar una imagen para el producto")
        setLoading(false)
        return
      }

      if (editMode && currentProducto) {
        try {
          // Crear un objeto JSON con todos los campos obligatorios
          const productoData = {
            Nombre: data.Nombre,
            Descripcion: data.Descripcion,
            ID_Categoria: Number.parseInt(data.ID_Categoria),
            TieneTamanos: data.TieneTamanos ? 1 : 0,
            Disponible: data.Disponible ? 1 : 0,
            Precio: !data.TieneTamanos && data.Precio ? Number.parseFloat(data.Precio) : null,
          }

          // Mostrar datos que se envían para depuración
          console.log("Datos enviados al servidor:", productoData)
          console.log("ID del producto a actualizar:", currentProducto.ID_Producto)

          // Actualizar producto existente usando JSON
          const updateResponse = await updateProductoRequest(currentProducto.ID_Producto, productoData)
          console.log("Respuesta de actualización:", updateResponse)

          // Si hay una imagen nueva, actualizarla por separado
          if (imagen) {
            console.log("Actualizando imagen para el producto:", currentProducto.ID_Producto)
            const imageFormData = new FormData()
            imageFormData.append("imagen", imagen)
            await uploadImagenRequest(currentProducto.ID_Producto, imageFormData)
          }

          setEditMode(false)
          setCurrentProducto(null)
          setShowEditModal(false)

          // Recargar la lista de productos
          loadProductos()
        } catch (error) {
          console.error("Error detallado al actualizar:", error)

          // Mostrar mensaje de error más detallado
          if (error.response) {
            setUpdateError(`Error: ${error.response.status} - ${error.response.data?.message || error.message}`)
          } else {
            setUpdateError(`Error al actualizar: ${error.message}`)
          }
        }
      } else {
        // Código para crear nuevo producto (sin cambios)
        const formData = new FormData()
        formData.append("Nombre", data.Nombre)
        formData.append("Descripcion", data.Descripcion)

        // Solo agregar precio si no tiene tamaños
        if (!data.TieneTamanos && data.Precio) {
          formData.append("Precio", data.Precio)
        } else if (!data.TieneTamanos) {
          formData.append("Precio", "0") // Valor por defecto
        }

        formData.append("ID_Categoria", data.ID_Categoria)
        formData.append("TieneTamanos", data.TieneTamanos ? "1" : "0")
        formData.append("Disponible", data.Disponible ? "1" : "0")

        if (imagen) {
          formData.append("imagen", imagen)
        }
        await createProductoRequest(formData)

        // Resetear formulario y recargar productos
        reset({
          Nombre: "",
          Descripcion: "",
          Precio: "",
          ID_Categoria: "",
          TieneTamanos: false,
          Disponible: true,
        })
        setImagen(null)
        setImagenPreview(null)
        loadProductos()
      }
    } catch (error) {
      console.error("Error al procesar producto:", error)
      setUpdateError(`Error al guardar el producto: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Modificar la función handleDelete para agregar mensaje de éxito
  const handleDelete = async () => {
    if (!productoToDelete) return

    try {
      await deleteProductoRequest(productoToDelete.ID_Producto)
      loadProductos()
      setShowDeleteModal(false)
      setProductoToDelete(null)
      setSuccessMessage("Producto eliminado correctamente") // Mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      setUpdateError(`Error al eliminar el producto: ${error.message}`)
    }
  }

  const confirmDelete = (producto) => {
    setProductoToDelete(producto)
    setShowDeleteModal(true)
  }

  // También actualizar la función toggleDisponible para usar JSON
  const toggleDisponible = async (id, disponible) => {
    try {
      // Obtener el producto actual
      const producto = productos.find((p) => p.ID_Producto === id)
      if (!producto) return

      // Crear un objeto con todos los campos necesarios
      // Asegurarse de que todos los campos tengan el tipo correcto
      const productoData = {
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        ID_Categoria: Number(producto.ID_Categoria),
        TieneTamanos: producto.TieneTamanos ? 1 : 0,
        Precio: producto.TieneTamanos ? null : Number(producto.Precio) || 0,
        Disponible: disponible ? 0 : 1, // Invertir el valor actual
      }

      // Mostrar datos que se envían para depuración
      console.log("Datos enviados para actualizar disponibilidad:", productoData)

      await updateProductoRequest(id, productoData)
      loadProductos()
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error)
      // Mostrar más detalles del error para depuración
      if (error.response) {
        console.error("Detalles del error:", error.response.data)
        console.error("Estado HTTP:", error.response.status)
      }
    }
  }

  // Actualizar la sección de estado de la API para mostrar más detalles
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mensaje de error global */}
      {updateError && !showEditModal && (
        <div className="mb-4 p-3 bg-red text-white rounded-md flex justify-between items-center">
          <span>{updateError}</span>
          <button onClick={() => setUpdateError("")} className="text-red">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Formulario de producto con react-hook-form */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Agregar Nuevo Producto</h2>
          <p className="text-gray-500 text-sm">Complete todos los campos para crear un nuevo producto</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="Nombre" className="block text-sm font-medium">
                Nombre del Producto
              </label>
              <input
                id="Nombre"
                type="text"
                {...register("Nombre", {
                  required: "El nombre es obligatorio",
                })}
                className={`w-full px-3 py-2 border rounded-md ${errors.Nombre ? "border-red" : "border-gray-300"}`}
                placeholder="Nombre del producto"
              />
              {errors.Nombre && <p className="text-red text-sm">{errors.Nombre.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="Descripcion" className="block text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="Descripcion"
                rows={3}
                {...register("Descripcion", {
                  required: "La descripción es obligatoria",
                })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.Descripcion ? "border-red" : "border-gray-300"
                }`}
                placeholder="Descripción del producto"
              />
              {errors.Descripcion && <p className="text-red text-sm">{errors.Descripcion.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ID_Categoria" className="block text-sm font-medium">
                  Categoría
                </label>
                <select
                  id="ID_Categoria"
                  {...register("ID_Categoria", {
                    required: "Debe seleccionar una categoría",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.ID_Categoria ? "border-red" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.ID_Categoria} value={categoria.ID_Categoria.toString()}>
                      {categoria.Nombre}
                    </option>
                  ))}
                </select>
                {errors.ID_Categoria && <p className="text-red text-sm">{errors.ID_Categoria.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="Precio" className={`block text-sm font-medium ${tieneTamanos ? "text-gray-400" : ""}`}>
                  Precio {tieneTamanos && "(No aplica para productos con tamaños)"}
                </label>
                <input
                  id="Precio"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={tieneTamanos}
                  {...register("Precio", {
                    validate: (value) => {
                      if (!tieneTamanos && (!value || isNaN(value) || Number(value) <= 0)) {
                        return "El precio debe ser un número mayor que 0"
                      }
                      return true
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.Precio ? "border-red" : "border-gray-300"
                  } ${tieneTamanos ? "bg-gray-100" : ""}`}
                  placeholder="Precio"
                />
                {errors.Precio && <p className="text-red text-sm">{errors.Precio.message}</p>}
              </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex items-start space-x-2 p-4 rounded-md border">
                <input type="checkbox" id="TieneTamanos" {...register("TieneTamanos")} className="mt-1" />
                <div className="space-y-1 leading-none">
                  <label htmlFor="TieneTamanos" className="font-medium text-sm">
                    Tiene Tamaños
                  </label>
                  <p className="text-sm text-gray-500">Marque esta opción si el producto tiene diferentes tamaños</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-4 rounded-md border">
                <input type="checkbox" id="Disponible" {...register("Disponible")} className="mt-1" />
                <div className="space-y-1 leading-none">
                  <label htmlFor="Disponible" className="font-medium text-sm">
                    Disponible
                  </label>
                  <p className="text-sm text-gray-500">
                    Marque esta opción si el producto está disponible para la venta
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="imagen-input" className="block text-sm font-medium">
                Imagen del Producto <span className="text-red">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="imagen-input"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                {imagenPreview && (
                  <button type="button" className="p-2 border rounded-md" onClick={handleClearImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {!imagen && !editMode && (
                <p className="text-sm text-gray-500">La imagen es obligatoria para crear un nuevo producto</p>
              )}

              {/* Vista previa de imagen */}
              {imagenPreview && (
                <div className="mt-2 relative">
                  <div className="border rounded-md overflow-hidden w-40 h-40 flex items-center justify-center">
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Cargando...
                </span>
              ) : (
                "Agregar Producto"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de productos */}
      <>
        <h2 className="text-2xl font-bold mb-4">Productos ({productos.length})</h2>

        {/* Mostrar mensaje si no hay productos */}
        {productos.length === 0 && (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-600">No hay productos disponibles.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <div key={producto.ID_Producto} className="bg-white rounded-lg shadow-md overflow-hidden">
              {producto.ImagenURL && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={producto.ImagenURL || "/placeholder.svg"}
                    alt={producto.Nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{producto.Nombre}</h3>
                  <button
                    onClick={() => toggleDisponible(producto.ID_Producto, producto.Disponible)}
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      producto.Disponible ? "bg-green-100 text-green-800" : "bg-red text-white"
                    }`}
                  >
                    {producto.Disponible ? "Disponible" : "No Disponible"}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {categorias.find((c) => c.ID_Categoria === producto.ID_Categoria)?.Nombre ||
                    "Categoría no encontrada"}
                </p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">{producto.Descripcion}</p>
                <p className="font-medium">
                  {producto.TieneTamanos ? "Precio variable según tamaño" : `$${producto.Precio || 0}`}
                </p>
                {producto.TieneTamanos && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs border rounded-full">Tiene tamaños</span>
                )}
              </div>
              <div className="p-4 border-t flex flex-col sm:flex-row gap-2 sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-md flex items-center justify-center w-full sm:w-auto"
                    onClick={() => startEdit(producto)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>

                  <button
                    className="px-3 py-1.5 text-sm bg-red text-white rounded-md flex items-center justify-center w-full sm:w-auto"
                    onClick={() => confirmDelete(producto)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">¿Está seguro de eliminar este producto?</h3>
            <p className="text-gray-600 mb-4">
              Esta acción no se puede deshacer. El producto "{productoToDelete?.Nombre}" será eliminado permanentemente
              de la base de datos.
            </p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 border rounded-md text-sm" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="px-4 py-2 bg-red text-white rounded-md text-sm" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de producto */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Editar Producto</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={cancelEdit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mostrar mensaje de error si existe */}
            {updateError && <div className="mb-4 p-3 bg-red text-white rounded-md">{updateError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-nombre" className="block text-sm font-medium">
                  Nombre del Producto
                </label>
                <input
                  id="edit-nombre"
                  type="text"
                  {...register("Nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.Nombre ? "border-red" : "border-gray-300"}`}
                  placeholder="Nombre del producto"
                />
                {errors.Nombre && <p className="text-red text-sm">{errors.Nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-descripcion" className="block text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  id="edit-descripcion"
                  rows={3}
                  {...register("Descripcion", {
                    required: "La descripción es obligatoria",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.Descripcion ? "border-red" : "border-gray-300"
                  }`}
                  placeholder="Descripción del producto"
                />
                {errors.Descripcion && <p className="text-red text-sm">{errors.Descripcion.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-categoria" className="block text-sm font-medium">
                    Categoría
                  </label>
                  <select
                    id="edit-categoria"
                    {...register("ID_Categoria", {
                      required: "Debe seleccionar una categoría",
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.ID_Categoria ? "border-red" : "border-gray-300"
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.ID_Categoria} value={categoria.ID_Categoria.toString()}>
                        {categoria.Nombre}
                      </option>
                    ))}
                  </select>
                  {errors.ID_Categoria && <p className="text-red text-sm">{errors.ID_Categoria.message}</p>}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="edit-precio"
                    className={`block text-sm font-medium ${tieneTamanos ? "text-gray-400" : ""}`}
                  >
                    Precio {tieneTamanos && "(No aplica para productos con tamaños)"}
                  </label>
                  <input
                    id="edit-precio"
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={tieneTamanos}
                    {...register("Precio", {
                      validate: (value) => {
                        if (!tieneTamanos && (!value || isNaN(value) || Number(value) <= 0)) {
                          return "El precio debe ser un número mayor que 0"
                        }
                        return true
                      },
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.Precio ? "border-red" : "border-gray-300"
                    } ${tieneTamanos ? "bg-gray-100" : ""}`}
                    placeholder="Precio"
                  />
                  {errors.Precio && <p className="text-red text-sm">{errors.Precio.message}</p>}
                </div>
              </div>

              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex items-start space-x-2 p-4 rounded-md border">
                  <input type="checkbox" id="edit-tiene-tamanos" {...register("TieneTamanos")} className="mt-1" />
                  <div className="space-y-1 leading-none">
                    <label htmlFor="edit-tiene-tamanos" className="font-medium text-sm">
                      Tiene Tamaños
                    </label>
                    <p className="text-sm text-gray-500">Marque esta opción si el producto tiene diferentes tamaños</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-4 rounded-md border">
                  <input type="checkbox" id="edit-disponible" {...register("Disponible")} className="mt-1" />
                  <div className="space-y-1 leading-none">
                    <label htmlFor="edit-disponible" className="font-medium text-sm">
                      Disponible
                    </label>
                    <p className="text-sm text-gray-500">
                      Marque esta opción si el producto está disponible para la venta
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-imagen" className="block text-sm font-medium">
                  Imagen del Producto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-imagen"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  {imagenPreview && (
                    <button type="button" className="p-2 border rounded-md" onClick={handleClearImage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Vista previa de imagen */}
                {imagenPreview && (
                  <div className="mt-2 relative">
                    <div className="border rounded-md overflow-hidden w-40 h-40 flex items-center justify-center">
                      <img
                        src={imagenPreview || "/placeholder.svg"}
                        alt="Vista previa"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Imagen actual o nueva imagen seleccionada</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" className="px-4 py-2 border rounded-md text-sm" onClick={cancelEdit}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

