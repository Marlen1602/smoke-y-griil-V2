"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import {
  getProductosRequest,
  createProductoRequest,
  deleteProductoRequest,
  uploadImagenRequest,
  getCategorias,
  updateProductoRequest,
  getTamanosRequest,
  createTamanoRequest,
  deleteTamanoRequest,
} from "../api/auth.js"
import AdminLayout from "../layouts/AdminLayout.jsx"
import { Plus, Edit, Trash2, X, Check, AlertCircle, Package, Ruler } from "lucide-react"

const ProductosPage = () => {
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
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para gestión de tamaños
  const [selectedProductoForTamanos, setSelectedProductoForTamanos] = useState("")
  const [tamanosProducto, setTamanosProducto] = useState([])
  const [loadingTamanos, setLoadingTamanos] = useState(false)
  const [tamanoError, setTamanoError] = useState("")
  const [tamanoSuccess, setTamanoSuccess] = useState("")

  // Formulario para crear productos (simplificado)
  const productForm = useForm({
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

  // Formulario para editar productos
  const editForm = useForm({
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

  // Formulario para gestionar tamaños
  const tamanoForm = useForm({
    defaultValues: {
      tamanos: [{ nombre: "", precio: "" }],
    },
    mode: "onChange",
  })

  const {
    fields: tamanoFields,
    append: tamanoAppend,
    remove: tamanoRemove,
  } = useFieldArray({
    control: tamanoForm.control,
    name: "tamanos",
  })

  useEffect(() => {
    loadProductos()
    loadCategorias()
  }, [])

  useEffect(() => {
    if (successMessage || tamanoSuccess) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
        setTamanoSuccess("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, tamanoSuccess])

  // Cargar tamaños cuando se selecciona un producto
  useEffect(() => {
    if (selectedProductoForTamanos) {
      loadTamanosProducto(selectedProductoForTamanos)
    } else {
      setTamanosProducto([])
    }
  }, [selectedProductoForTamanos])

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

  const loadTamanosProducto = async (productoId) => {
    try {
      setLoadingTamanos(true)
      const res = await getTamanosRequest()
      const tamanosDelProducto = res.data.filter((t) => t.ID_Producto === Number.parseInt(productoId))
      setTamanosProducto(tamanosDelProducto)
    } catch (error) {
      console.error("Error al cargar tamaños:", error)
      setTamanoError("Error al cargar los tamaños del producto")
    } finally {
      setLoadingTamanos(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      const previewUrl = URL.createObjectURL(file)
      setImagenPreview(previewUrl)
    }
  }

  const handleClearImage = () => {
    setImagen(null)
    setImagenPreview(null)
    const fileInput = document.getElementById(editMode ? "edit-imagen" : "imagen-input")
    if (fileInput) fileInput.value = ""
  }

  // Crear producto (sin tamaños)
  const onSubmitProduct = async (data) => {
    setLoading(true)
    setUpdateError("")

    try {
      if (!imagen) {
        setUpdateError("Debe seleccionar una imagen para el producto")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("Nombre", data.Nombre)
      formData.append("Descripcion", data.Descripcion)
      formData.append("Precio", data.TieneTamanos ? "0" : data.Precio)
      formData.append("ID_Categoria", data.ID_Categoria)
      formData.append("TieneTamanos", data.TieneTamanos ? "1" : "0")
      formData.append("Disponible", data.Disponible ? "1" : "0")
      formData.append("imagen", imagen)

      await createProductoRequest(formData)

      // Limpiar formulario
      productForm.reset({
        Nombre: "",
        Descripcion: "",
        Precio: "",
        ID_Categoria: "",
        TieneTamanos: false,
        Disponible: true,
      })
      setImagen(null)
      setImagenPreview(null)

      setSuccessMessage("Producto creado correctamente")
      await loadProductos()
    } catch (error) {
      console.error("Error al crear producto:", error)
      setUpdateError(`Error al crear producto: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Agregar tamaños a un producto existente
  const onSubmitTamanos = async (data) => {
    if (!selectedProductoForTamanos) {
      setTamanoError("Debe seleccionar un producto")
      return
    }

    setLoadingTamanos(true)
    setTamanoError("")

    try {
      const tamanosValidos = data.tamanos.filter((t) => t.nombre && t.precio)

      if (tamanosValidos.length === 0) {
        setTamanoError("Debe agregar al menos un tamaño")
        setLoadingTamanos(false)
        return
      }

      // Crear cada tamaño
      for (const tamano of tamanosValidos) {
        const tamanoData = {
          ID_Producto: Number.parseInt(selectedProductoForTamanos),
          Nombre: tamano.nombre.trim(),
          Precio: Number.parseFloat(tamano.precio).toFixed(2),
        }

        await createTamanoRequest(tamanoData)
      }

      // Limpiar formulario
      tamanoForm.reset({
        tamanos: [{ nombre: "", precio: "" }],
      })

      setTamanoSuccess(`${tamanosValidos.length} tamaño(s) agregado(s) correctamente`)

      // Recargar tamaños del producto
      await loadTamanosProducto(selectedProductoForTamanos)

      // Actualizar el producto para marcarlo como "TieneTamanos"
      const producto = productos.find((p) => p.ID_Producto === Number.parseInt(selectedProductoForTamanos))
      if (producto && !producto.TieneTamanos) {
        await updateProductoRequest(selectedProductoForTamanos, {
          ...producto,
          TieneTamanos: 1,
        })
        await loadProductos()
      }
    } catch (error) {
      console.error("Error al crear tamaños:", error)
      setTamanoError(`Error al crear tamaños: ${error.message}`)
    } finally {
      setLoadingTamanos(false)
    }
  }

  // Eliminar tamaño
  const handleDeleteTamano = async (tamanoId) => {
    try {
      await deleteTamanoRequest(tamanoId)
      setTamanoSuccess("Tamaño eliminado correctamente")
      await loadTamanosProducto(selectedProductoForTamanos)

      // Si no quedan tamaños, actualizar el producto
      const tamanosRestantes = tamanosProducto.filter((t) => t.ID_Tama_o !== tamanoId)
      if (tamanosRestantes.length === 0) {
        const producto = productos.find((p) => p.ID_Producto === Number.parseInt(selectedProductoForTamanos))
        if (producto) {
          await updateProductoRequest(selectedProductoForTamanos, {
            ...producto,
            TieneTamanos: 0,
          })
          await loadProductos()
        }
      }
    } catch (error) {
      console.error("Error al eliminar tamaño:", error)
      setTamanoError("Error al eliminar el tamaño")
    }
  }

  const startEdit = async (producto) => {
    setCurrentProducto(producto)
    setEditMode(true)
    setShowEditModal(true)
    setUpdateError("")

    const disponibleNormalizado = producto.Disponible === 1 || producto.Disponible === true
    const tieneTamanosNormalizado = producto.TieneTamanos === 1 || producto.TieneTamanos === true

    editForm.reset({
      Nombre: producto.Nombre || "",
      Descripcion: producto.Descripcion || "",
      Precio: producto.Precio ? producto.Precio.toString() : "",
      ID_Categoria: producto.ID_Categoria ? producto.ID_Categoria.toString() : "",
      TieneTamanos: tieneTamanosNormalizado,
      Disponible: disponibleNormalizado,
    })

    if (producto.ImagenURL) {
      setImagenPreview(producto.ImagenURL)
    } else {
      setImagenPreview(null)
    }
    setImagen(null)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setCurrentProducto(null)
    setShowEditModal(false)
    setImagen(null)
    setImagenPreview(null)
    setUpdateError("")
    editForm.reset()
  }

  const onSubmitEdit = async (data) => {
    setLoading(true)
    setUpdateError("")

    try {
      const productoData = {
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        ID_Categoria: Number.parseInt(data.ID_Categoria),
        TieneTamanos: data.TieneTamanos ? 1 : 0,
        Disponible: data.Disponible ? 1 : 0,
        Precio: !data.TieneTamanos && data.Precio ? Number.parseFloat(data.Precio) : null,
      }

      await updateProductoRequest(currentProducto.ID_Producto, productoData)

      if (imagen) {
        const imageFormData = new FormData()
        imageFormData.append("imagen", imagen)
        await uploadImagenRequest(currentProducto.ID_Producto, imageFormData)
      }

      setSuccessMessage("Producto actualizado correctamente")
      cancelEdit()
      await loadProductos()
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      setUpdateError(`Error al actualizar producto: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!productoToDelete) return
    try {
      await deleteProductoRequest(productoToDelete.ID_Producto)
      await loadProductos()
      setShowDeleteModal(false)
      setProductoToDelete(null)
      setSuccessMessage("Producto eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      setUpdateError(`Error al eliminar el producto: ${error.message}`)
    }
  }

  const confirmDelete = (producto) => {
    setProductoToDelete(producto)
    setShowDeleteModal(true)
  }

  const toggleDisponible = async (productoId, disponibleActual) => {
    const producto = productos.find((p) => p.ID_Producto === productoId)
    if (!producto) return

    const nuevoDisponible = disponibleActual === 1 || disponibleActual === true ? 0 : 1

    try {
      const productoData = {
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        ID_Categoria: Number(producto.ID_Categoria),
        TieneTamanos: producto.TieneTamanos ? 1 : 0,
        Precio: producto.TieneTamanos ? null : Number(producto.Precio) || 0,
        Disponible: nuevoDisponible,
      }

      await updateProductoRequest(productoId, productoData)
      setSuccessMessage(`Producto ${nuevoDisponible === 1 ? "habilitado" : "deshabilitado"} correctamente`)
      await loadProductos()
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error)
      setUpdateError(`Error al cambiar disponibilidad: ${error.message}`)
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
            <p className="text-gray-600">Administra tu catálogo de productos y sus tamaños</p>
          </div>

          {/* Mensajes de estado */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage("")} className="text-green-600 hover:text-green-800">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {updateError && (
            <div className="mb-6 p-4 bg-red border border-red rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-white mr-2" />
                <span className="text-white">{updateError}</span>
              </div>
              <button onClick={() => setUpdateError("")} className="text-white hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Sección 1: Crear Producto */}
          <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="p-6 border-b bg-blue-50">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <h2 className="text-xl font-semibold text-blue-900">Crear Nuevo Producto</h2>
                  <p className="text-blue-700 text-sm">
                    Primero crea el producto base, luego podrás agregar tamaños si es necesario
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="Nombre" className="block text-sm font-medium">
                      Nombre del Producto *
                    </label>
                    <input
                      id="Nombre"
                      type="text"
                      {...productForm.register("Nombre", { required: "El nombre es obligatorio" })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        productForm.formState.errors.Nombre ? "border-red" : "border-gray-300"
                      }`}
                      placeholder="Nombre del producto"
                    />
                    {productForm.formState.errors.Nombre && (
                      <p className="text-white text-sm">{productForm.formState.errors.Nombre.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ID_Categoria" className="block text-sm font-medium">
                      Categoría *
                    </label>
                    <select
                      id="ID_Categoria"
                      {...productForm.register("ID_Categoria", { required: "Debe seleccionar una categoría" })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        productForm.formState.errors.ID_Categoria ? "border-red" : "border-gray-300"
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.ID_Categoria} value={categoria.ID_Categoria.toString()}>
                          {categoria.Nombre}
                        </option>
                      ))}
                    </select>
                    {productForm.formState.errors.ID_Categoria && (
                      <p className="text-white text-sm">{productForm.formState.errors.ID_Categoria.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="Descripcion" className="block text-sm font-medium">
                    Descripción *
                  </label>
                  <textarea
                    id="Descripcion"
                    rows={3}
                    {...productForm.register("Descripcion", { required: "La descripción es obligatoria" })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      productForm.formState.errors.Descripcion ? "border-red" : "border-gray-300"
                    }`}
                    placeholder="Descripción del producto"
                  />
                  {productForm.formState.errors.Descripcion && (
                    <p className="text-white text-sm">{productForm.formState.errors.Descripcion.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="Precio"
                      className={`block text-sm font-medium ${
                        productForm.watch("TieneTamanos") ? "text-gray-400" : ""
                      }`}
                    >
                      Precio {productForm.watch("TieneTamanos") && "(Se definirá en los tamaños)"}
                    </label>
                    <input
                      id="Precio"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={productForm.watch("TieneTamanos")}
                      {...productForm.register("Precio", {
                        validate: (value) => {
                          if (!productForm.watch("TieneTamanos") && (!value || isNaN(value) || Number(value) <= 0)) {
                            return "El precio debe ser un número mayor que 0"
                          }
                          return true
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        productForm.formState.errors.Precio ? "border-red" : "border-gray-300"
                      } ${productForm.watch("TieneTamanos") ? "bg-gray-100" : ""}`}
                      placeholder="0.00"
                    />
                    {productForm.formState.errors.Precio && (
                      <p className="text-white text-sm">{productForm.formState.errors.Precio.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="imagen-input" className="block text-sm font-medium">
                      Imagen del Producto *
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
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex items-start space-x-2 p-4 rounded-md border">
                    <input
                      type="checkbox"
                      id="TieneTamanos"
                      {...productForm.register("TieneTamanos")}
                      className="mt-1"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="TieneTamanos" className="font-medium text-sm">
                        Tendrá Tamaños
                      </label>
                      <p className="text-sm text-gray-500">
                        Marque si planea agregar tamaños después (podrá hacerlo en la sección de abajo)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 p-4 rounded-md border">
                    <input type="checkbox" id="Disponible" {...productForm.register("Disponible")} className="mt-1" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="Disponible" className="font-medium text-sm">
                        Disponible
                      </label>
                      <p className="text-sm text-gray-500">El producto estará disponible para la venta</p>
                    </div>
                  </div>
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
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
                      Creando producto...
                    </span>
                  ) : (
                    "Crear Producto"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sección 2: Gestionar Tamaños */}
          <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="p-6 border-b bg-green-50">
              <div className="flex items-center">
                <Ruler className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <h2 className="text-xl font-semibold text-green-900">Gestionar Tamaños</h2>
                  <p className="text-green-700 text-sm">
                    Selecciona un producto y agrega sus diferentes tamaños y precios
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Selector de producto */}
              <div className="mb-6">
                <label htmlFor="producto-selector" className="block text-sm font-medium mb-2">
                  Seleccionar Producto *
                </label>
                <select
                  id="producto-selector"
                  value={selectedProductoForTamanos}
                  onChange={(e) => setSelectedProductoForTamanos(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar un producto...</option>
                  {productos.map((producto) => (
                    <option key={producto.ID_Producto} value={producto.ID_Producto}>
                      {producto.Nombre} {producto.TieneTamanos ? "(Ya tiene tamaños)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mensajes para tamaños */}
              {tamanoSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800">{tamanoSuccess}</span>
                  </div>
                  <button onClick={() => setTamanoSuccess("")} className="text-green-600 hover:text-green-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {tamanoError && (
                <div className="mb-4 p-4 bg-red border border-red rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-white mr-2" />
                    <span className="text-white">{tamanoError}</span>
                  </div>
                  <button onClick={() => setTamanoError("")} className="text-white hover:text-red">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {selectedProductoForTamanos && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Formulario para agregar tamaños */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Agregar Nuevos Tamaños</h3>
                    <form onSubmit={tamanoForm.handleSubmit(onSubmitTamanos)} className="space-y-4">
                      <div className="space-y-3">
                        {tamanoFields.map((field, index) => (
                          <div key={field.id} className="flex gap-4 items-end p-3 bg-gray-50 rounded-lg border">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del tamaño</label>
                              <input
                                type="text"
                                {...tamanoForm.register(`tamanos.${index}.nombre`, {
                                  required: "El nombre del tamaño es obligatorio",
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Ej: Pequeño, Mediano, Grande"
                              />
                              {tamanoForm.formState.errors.tamanos?.[index]?.nombre && (
                                <p className="text-white text-xs mt-1">
                                  {tamanoForm.formState.errors.tamanos[index].nombre.message}
                                </p>
                              )}
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                {...tamanoForm.register(`tamanos.${index}.precio`, {
                                  required: "El precio es obligatorio",
                                  min: { value: 0.01, message: "El precio debe ser mayor que 0" },
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="0.00"
                              />
                              {tamanoForm.formState.errors.tamanos?.[index]?.precio && (
                                <p className="text-white text-xs mt-1">
                                  {tamanoForm.formState.errors.tamanos[index].precio.message}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => tamanoRemove(index)}
                              className="p-2 text-white hover:bg-red rounded-lg"
                              disabled={tamanoFields.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => tamanoAppend({ nombre: "", precio: "" })}
                          className="flex items-center px-3 py-2 text-sm border border-green-500 text-green-600 rounded-lg hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar Tamaño
                        </button>
                        <button
                          type="submit"
                          disabled={loadingTamanos}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg"
                        >
                          {loadingTamanos ? "Guardando..." : "Guardar Tamaños"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Lista de tamaños existentes */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tamaños Actuales</h3>
                    {loadingTamanos ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Cargando tamaños...</p>
                      </div>
                    ) : tamanosProducto.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Este producto no tiene tamaños configurados</p>
                        <p className="text-gray-400 text-sm">
                          Agrega el primer tamaño usando el formulario de la izquierda
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tamanosProducto.map((tamano) => (
                          <div
                            key={tamano.ID_Tama_o}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div>
                              <span className="font-medium">{tamano.Tama_o}</span>
                              <span className="text-green-600 ml-2">${tamano.Precio}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteTamano(tamano.ID_Tama_o)}
                              className="p-1 text-white hover:bg-red rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!selectedProductoForTamanos && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un Producto</h3>
                  <p className="text-gray-500">Elige un producto de la lista para gestionar sus tamaños</p>
                </div>
              )}
            </div>
          </div>

          {/* Lista de productos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Productos ({productos.length})</h2>
                  <p className="text-gray-500 text-sm">Gestiona tu catálogo de productos</p>
                </div>
              </div>
            </div>

            {productos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                <p className="text-gray-500">Comienza agregando tu primer producto al catálogo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {productos.map((producto) => {
                  const esDisponible = producto.Disponible === 1 || producto.Disponible === true
                  return (
                    <div
                      key={producto.ID_Producto}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {producto.ImagenURL && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={producto.ImagenURL || "/placeholder.svg"}
                            alt={producto.Nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{producto.Nombre}</h3>
                          <button
                            onClick={() => toggleDisponible(producto.ID_Producto, producto.Disponible)}
                            className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                              esDisponible
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red text-white hover:bg-red"
                            }`}
                          >
                            {esDisponible ? "Disponible" : "No disponible"}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {categorias.find((c) => c.ID_Categoria === producto.ID_Categoria)?.Nombre || "Sin categoría"}
                        </p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.Descripcion}</p>
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-gray-900">
                            {producto.TieneTamanos ? "Precio variable" : `$${producto.Precio || 0}`}
                          </p>
                          {producto.TieneTamanos && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Con tamaños
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(producto)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => confirmDelete(producto)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red text-white rounded-lg hover:bg-red transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Está seguro de que desea eliminar el producto "{productoToDelete?.Nombre}"? Se eliminará
                permanentemente de la base de datos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red text-white rounded-lg hover:bg-red transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Editar Producto</h3>
                      <p className="text-sm text-gray-500">Modifica la información del producto</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelEdit}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {updateError && (
                  <div className="mb-4 p-4 bg-red border border-red rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-white mr-2" />
                    <span className="text-white">{updateError}</span>
                  </div>
                )}

                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
                      <input
                        type="text"
                        {...editForm.register("Nombre", { required: "El nombre es obligatorio" })}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          editForm.formState.errors.Nombre ? "border-red" : "border-gray-300"
                        }`}
                        placeholder="Ingrese el nombre del producto"
                      />
                      {editForm.formState.errors.Nombre && (
                        <p className="text-white text-sm">{editForm.formState.errors.Nombre.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                      <select
                        {...editForm.register("ID_Categoria", { required: "Debe seleccionar una categoría" })}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          editForm.formState.errors.ID_Categoria ? "border-red" : "border-gray-300"
                        }`}
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.ID_Categoria} value={categoria.ID_Categoria.toString()}>
                            {categoria.Nombre}
                          </option>
                        ))}
                      </select>
                      {editForm.formState.errors.ID_Categoria && (
                        <p className="text-white text-sm">{editForm.formState.errors.ID_Categoria.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                    <textarea
                      rows={3}
                      {...editForm.register("Descripcion", { required: "La descripción es obligatoria" })}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        editForm.formState.errors.Descripcion ? "border-red" : "border-gray-300"
                      }`}
                      placeholder="Describe las características del producto"
                    />
                    {editForm.formState.errors.Descripcion && (
                      <p className="text-white text-sm">{editForm.formState.errors.Descripcion.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium ${
                          editForm.watch("TieneTamanos") ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Precio {editForm.watch("TieneTamanos") && "(Se define en tamaños)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={editForm.watch("TieneTamanos")}
                        {...editForm.register("Precio", {
                          validate: (value) => {
                            if (!editForm.watch("TieneTamanos") && (!value || isNaN(value) || Number(value) <= 0)) {
                              return "El precio debe ser un número mayor que 0"
                            }
                            return true
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          editForm.formState.errors.Precio ? "border-red" : "border-gray-300"
                        } ${editForm.watch("TieneTamanos") ? "bg-gray-100" : ""}`}
                        placeholder="0.00"
                      />
                      {editForm.formState.errors.Precio && (
                        <p className="text-white text-sm">{editForm.formState.errors.Precio.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                      <input
                        id="edit-imagen"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="edit-tiene-tamanos"
                        {...editForm.register("TieneTamanos")}
                        className="mr-2"
                      />
                      <label htmlFor="edit-tiene-tamanos" className="text-sm font-medium">
                        Tiene tamaños
                      </label>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="edit-disponible"
                        {...editForm.register("Disponible")}
                        className="mr-2"
                      />
                      <label htmlFor="edit-disponible" className="text-sm font-medium">
                        Disponible
                      </label>
                    </div>
                  </div>

                  {imagenPreview && (
                    <div className="relative">
                      <img
                        src={imagenPreview || "/placeholder.svg"}
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute -top-2 -right-2 p-1 bg-red text-white rounded-full hover:bg-red"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ProductosPage
