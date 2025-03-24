import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contex/ThemeContext"
import { getProductosRequest, getCategorias, getTamanosRequest } from "../api/auth.js"
import AuthModal from "./AuthModal"
import { AuthContext } from "../contex/AuthContext"
import { useCart } from "../contex/CartContext"
import ClientLayout from "../layouts/ClientLayaut.jsx"
import Breadcrumbs from "../pages/Breadcrumbs";
import { ShoppingCart, ShoppingBag } from "lucide-react"

// Función para generar un color basado en el texto
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }
  return color
}

// Componente para mostrar una imagen con fallback
const ProductImage = ({ src, alt, className, productName }) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Función para manejar errores de carga
  const handleError = () => {
    console.error(`Error al cargar la imagen: ${src}`)
    setError(true)
    setLoading(false)
  }

  // Función para manejar carga exitosa
  const handleLoad = () => {
    console.log(`Imagen cargada exitosamente: ${src}`)
    setLoading(false)
  }

  // Si hay error o no hay src, mostrar imagen basada en texto
  if (error || !src) {
    // Obtener las iniciales del texto (máximo 2 caracteres)
    const getInitials = (text) => {
      if (!text) return "?"
      const words = text.split(" ")
      if (words.length === 1) {
        return text.substring(0, 2).toUpperCase()
      }
      return (words[0][0] + words[1][0]).toUpperCase()
    }

    const initials = getInitials(productName || alt)
    const bgColor = stringToColor(productName || alt || "default")

    return (
      <div className={`${className} flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
        <span className="text-white text-2xl font-bold">{initials}</span>
      </div>
    )
  }

  // Si hay src y no hay error, mostrar la imagen
  return (
    <div
      className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full object-cover ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        crossOrigin="anonymous"
      />
    </div>
  )
}

const MenuClient = () => {
  const [filteredMenu, setFilteredMenu] = useState({})
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [sizes, setSizes] = useState([]) // Estado para almacenar todos los tamaños
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null) // Estado para el tamaño seleccionado
  const [selectedComplements, setSelectedComplements] = useState([])
  const [quantity, setQuantity] = useState(1) // Estado para la cantidad
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // Nuevo estado para el modal de producto agregado
  // Estados para la UI

  // Hooks y contextos
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useContext(AuthContext)
  const { addToCart, cartCount } = useCart()
  const navigate = useNavigate()

  // Cargar productos, categorías y tamaños desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Iniciando carga de datos del menú...")

        // Obtener categorías
        let categoriesData = []
        try {
          const categoriesResponse = await getCategorias()
          console.log("Respuesta de categorías:", categoriesResponse)
          categoriesData = categoriesResponse.data || []
          console.log("Categorías obtenidas:", categoriesData)
        } catch (catError) {
          console.error("Error al obtener categorías:", catError)
        }
        setCategories(categoriesData)

        // Obtener productos
        let productsData = []
        try {
          const productsResponse = await getProductosRequest()
          console.log("Respuesta de productos:", productsResponse)
          productsData = productsResponse.data || []
          console.log("Productos obtenidos:", productsData)
        } catch (prodError) {
          console.error("Error al obtener productos:", prodError)
        }
        setAllProducts(productsData)

        // Obtener tamaños
        let sizesData = []
        try {
          const sizesResponse = await getTamanosRequest()
          console.log("Respuesta de tamaños:", sizesResponse)
          sizesData = sizesResponse.data || []
          console.log("Tamaños obtenidos:", sizesData)
        } catch (sizeError) {
          console.error("Error al obtener tamaños:", sizeError)
        }
        setSizes(sizesData)

        // Agrupar productos por categoría
        if (productsData.length > 0 && categoriesData.length > 0) {
          const groupedProducts = groupProductsByCategory(productsData, categoriesData)
          console.log("Productos agrupados por categoría:", groupedProducts)
          setFilteredMenu(groupedProducts)
        } else {
          console.warn("No hay suficientes datos para agrupar productos:", {
            productsCount: productsData.length,
            categoriesCount: categoriesData.length,
          })
          setFilteredMenu({})
        }

        setLoading(false)
      } catch (error) {
        console.error("Error general al cargar datos:", error)
        setError("Error al cargar el menú. Por favor, intente nuevamente más tarde.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Función para agrupar productos por categoría
  const groupProductsByCategory = (products, categories) => {
    // Verificar si tenemos datos válidos
    if (!Array.isArray(products) || !Array.isArray(categories)) {
      console.error("Datos inválidos:", { products, categories })
      return {}
    }

    console.log("Productos recibidos:", products)
    console.log("Categorías recibidas:", categories)

    // Crear un objeto para almacenar productos por categoría
    const grouped = {}

    // Crear un mapa de ID de categoría a nombre para búsqueda rápida
    const categoryMap = {}
    categories.forEach((cat) => {
      // Manejar diferentes formatos de propiedades
      const id = cat.ID_Categoria || cat.id
      const name = cat.Nombre || cat.nombre

      if (id && name) {
        categoryMap[id] = name
      }
    })

    console.log("Mapa de categorías:", categoryMap)

    // Agrupar productos por su categoría
    products.forEach((product) => {
      // Verificar si el producto está disponible (si existe la propiedad)
      const isAvailable = product.Disponible !== undefined ? product.Disponible : true

      if (isAvailable) {
        // Obtener el ID de categoría del producto
        const categoryId = product.ID_Categoria || product.categoriaId || product.id_categoria

        // Obtener el nombre de la categoría usando el mapa
        const categoryName = categoryMap[categoryId] || "Sin categoría"

        // Si la categoría no existe en el objeto agrupado, crearla
        if (!grouped[categoryName]) {
          grouped[categoryName] = []
        }

        // Transformar el producto al formato esperado por la UI
        const formattedProduct = {
          id: product.ID_Producto || product.id,
          name: product.Nombre || product.nombre,
          description: product.Descripcion || product.descripcion,
          price: Number.parseFloat(product.Precio || product.precio || 0),
          image: product.Imagen || product.imagen,
          hasSizes: product.TieneTamanos || product.tieneTamanos || false,
          categoryId: categoryId,
        }

        grouped[categoryName].push(formattedProduct)
      }
    })

    // Eliminar categorías vacías
    Object.keys(grouped).forEach((key) => {
      if (grouped[key].length === 0) {
        delete grouped[key]
      }
    })

    console.log("Categorías agrupadas:", Object.keys(grouped))
    console.log("Productos agrupados:", grouped)

    return grouped
  }

  // Función para obtener los tamaños disponibles para un producto
  const getProductSizes = (productId) => {
    if (!productId || !sizes || !Array.isArray(sizes)) {
      console.warn("No se pueden obtener tamaños: datos inválidos", { productId, sizes })
      return []
    }

    console.log("Buscando tamaños para el producto ID:", productId)
    console.log("Tamaños disponibles:", sizes)

    // Filtrar los tamaños que corresponden al producto seleccionado
    // Manejar diferentes formatos de propiedades (ID_Producto vs id_producto vs productoId)
    const productSizes = sizes.filter((size) => {
      const sizeProductId = size.ID_Producto || size.id_producto || size.productoId
      return sizeProductId === productId
    })

    console.log("Tamaños encontrados para el producto:", productSizes)

    // Asegurar que los precios sean positivos y estén formateados correctamente
    return productSizes.map((size) => {
      // Determinar el nombre del tamaño, priorizando la columna "tamaño" con tilde
      let sizeName = null
      if (size.tamaño) sizeName = size.tamaño
      else if (size.Tamaño) sizeName = size.Tamaño
      else if (size.Tamano) sizeName = size.Tamano
      else if (size.nombre) sizeName = size.nombre
      else if (size.Nombre) sizeName = size.Nombre
      else sizeName = `Tamaño ${size.ID_Tamano || size.id || "desconocido"}`

      return {
        ...size,
        id: size.ID_Tamano || size.id,
        nombre: sizeName,
        Precio: Math.abs(Number.parseFloat(size.Precio || size.precio || 0)),
      }
    })
  }

  const handleSearch = () => {
    // Filtrar productos según los criterios de búsqueda
    let filteredProducts = [...allProducts]

    // Filtrar por texto de búsqueda
    if (query.trim()) {
      filteredProducts = filteredProducts.filter((product) => {
        const nombre = product.Nombre || product.nombre || ""
        const descripcion = product.Descripcion || product.descripcion || ""
        return (
          nombre.toLowerCase().includes(query.toLowerCase()) || descripcion.toLowerCase().includes(query.toLowerCase())
        )
      })
    }

    // Filtrar por precio mínimo
    if (minPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const precio = Number.parseFloat(product.Precio || product.precio || 0)
        return precio >= Number(minPrice)
      })
    }

    // Filtrar por precio máximo
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const precio = Number.parseFloat(product.Precio || product.precio || 0)
        return precio <= Number(maxPrice)
      })
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) => {
        const categoriaId = product.ID_Categoria || product.categoriaId || product.id_categoria
        return categoriaId === Number(selectedCategory)
      })
    }

    // Mostrar resultados en una sola categoría
    const formattedProducts = filteredProducts.map((product) => ({
      id: product.ID_Producto || product.id,
      name: product.Nombre || product.nombre,
      description: product.Descripcion || product.descripcion,
      price: Number.parseFloat(product.Precio || product.precio || 0),
      image: product.Imagen || product.imagen,
      hasSizes: product.TieneTamanos || product.tieneTamanos || false,
      categoryId: product.ID_Categoria || product.categoriaId || product.id_categoria,
    }))

    setFilteredMenu({ Resultados: formattedProducts })
  }

  const handleOpenModal = (item, category) => {
    setSelectedItem({ ...item, category })
    setSelectedSize(null) // Resetear el tamaño seleccionado
    setSelectedComplements([])
    setQuantity(1) // Resetear la cantidad

    // Si el producto tiene tamaños, cargar los tamaños disponibles
    if (item.hasSizes) {
      const productSizes = getProductSizes(item.id)
      console.log("Tamaños para el producto:", productSizes)

      // Si hay tamaños disponibles, seleccionar el primero por defecto
      if (productSizes && productSizes.length > 0) {
        setSelectedSize(productSizes[0])
      }
    }
  }

  // Función para seleccionar un tamaño
  const handleSizeSelect = (size) => {
    console.log("Tamaño seleccionado:", size)
    // Asegurar que el precio sea positivo
    const updatedSize = {
      ...size,
      Precio: Math.abs(Number.parseFloat(size.Precio || 0)),
    }
    setSelectedSize(updatedSize)
  }

  // Modificar la función handleAddToCart para que solo agregue al carrito y muestre un mensaje
  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Verificar si el producto requiere tamaño pero no se ha seleccionado ninguno
    if (selectedItem.hasSizes && !selectedSize) {
      alert("Por favor selecciona un tamaño antes de continuar")
      return
    }

    // Asegurarse de que el producto tenga la estructura correcta para el carrito
    const itemToAdd = {
      id: selectedItem.id,
      name: selectedItem.name,
      description: selectedItem.description,
      price: selectedItem.price,
      image: selectedItem.image,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedComplements: selectedComplements,
      category: selectedItem.category,
    }

    console.log("Agregando al carrito:", itemToAdd)

    // Llamar a la función addToCart del contexto
    addToCart(itemToAdd)

    // Cerrar el modal
    handleCloseModal()

    // Mostrar notificación simple con Tailwind
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
    notification.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span>${selectedItem.name} se ha agregado a tu carrito</span>
  `
    document.body.appendChild(notification)

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add("opacity-0", "transition-opacity", "duration-500")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 3000)
  }

  // Función para comprar ahora (ir directamente al carrito)
  const handleBuyNow = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Verificar si el producto requiere tamaño pero no se ha seleccionado ninguno
    if (selectedItem.hasSizes && !selectedSize) {
      alert("Por favor selecciona un tamaño antes de continuar")
      return
    }

    // Asegurarse de que el producto tenga la estructura correcta para el carrito
    const itemToAdd = {
      id: selectedItem.id,
      name: selectedItem.name,
      description: selectedItem.description,
      price: selectedItem.price,
      image: selectedItem.image,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedComplements: selectedComplements,
      category: selectedItem.category,
    }

    console.log("Comprando ahora:", itemToAdd)

    // Llamar a la función addToCart del contexto
    addToCart(itemToAdd)

    // Cerrar el modal
    handleCloseModal()

    // Navegar al carrito
    navigate("/carrito")
  }

  // Función para incrementar la cantidad
  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Función para decrementar la cantidad
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  // Contenido principal del menú
  const menuContent = (
    
    <div className="p-6">
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Menú del Restaurante</h1>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar platillos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            <i className="fas fa-search mr-2"></i>
            Buscar
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fas fa-filter mr-2"></i>
            Filtros
          </button>
        </div>

        {/* Filtros Avanzados */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Precio Mínimo:</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Precio Máximo:</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Categoría:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((categoria) => (
                    <option key={categoria.ID_Categoria || categoria.id} value={categoria.ID_Categoria || categoria.id}>
                      {categoria.Nombre || categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mostrar mensaje de carga */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Mostrar mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Mostrar mensaje si no hay resultados */}
      {!loading && !error && Object.keys(filteredMenu).length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron productos disponibles.</p>
        </div>
      )}

      {/* Mostrar menú */}
      {!loading &&
        !error &&
        Object.keys(filteredMenu).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu[category].map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md flex flex-col sm:flex-row justify-between cursor-pointer transition-transform transform hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => handleOpenModal(item, category)}
                >
                  <div className="flex-1 pr-4 mb-3 sm:mb-0">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-orange-600 font-bold">
                        {item.hasSizes
                          ? "Precio variable"
                          : item.price && Number.parseFloat(item.price) > 0
                            ? `$${Number.parseFloat(item.price).toFixed(2)}`
                            : "Consultar precio"}
                      </p>
                      {item.hasSizes && (
                        <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full shadow-sm">
                          <i className="fas fa-ruler-combined mr-1"></i> Varios tamaños
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 w-full sm:w-24 h-24">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      productName={item.name}
                      className="w-full h-full rounded-lg relative"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* MODAL DE PLATILLO */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              onClick={handleCloseModal}
            >
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

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={selectedItem.image || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="md:w-1/2">
                <h3 className="text-lg font-semibold text-orange-500">
                  {selectedItem.category ||
                    categories.find((cat) => cat.id === selectedItem.categoryId)?.nombre ||
                    "Producto"}
                </h3>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedItem.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 my-2">{selectedItem.description}</p>

                {/* Mostrar precio según el tamaño seleccionado */}
                {selectedItem.hasSizes ? (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Precio:</h4>
                    <p className="text-orange-600 font-bold text-2xl">
                      {selectedSize
                        ? `$${selectedSize.Precio.toFixed(2)} - ${selectedSize.nombre || selectedSize.tamaño || "Tamaño seleccionado"}`
                        : "Selecciona un tamaño"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Precio:</h4>
                    <p className="text-orange-600 font-bold text-2xl">${selectedItem.price.toFixed(2)}</p>
                  </div>
                )}

                {/* Selección de tamaño si está disponible */}
                {selectedItem.hasSizes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Selecciona un tamaño: <span className="text-red-500">*</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {getProductSizes(selectedItem.id).map((tamano) => (
                        <button
                          key={tamano.ID_Tamano || tamano.id}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedSize &&
                            (selectedSize.ID_Tamano === tamano.ID_Tamano || selectedSize.id === tamano.id)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-orange-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => handleSizeSelect(tamano)}
                        >
                          <div className="font-medium">{tamano.nombre || tamano.tamaño || "Tamaño"}</div>
                          <div className="text-sm font-bold">${(tamano.Precio || 0).toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                    {selectedItem.hasSizes && !selectedSize && (
                      <p className="text-red-500 text-sm mt-1">Por favor selecciona un tamaño</p>
                    )}
                  </div>
                )}

                {/* Cantidad */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cantidad:</h4>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-l-lg"
                      onClick={() => decrementQuantity()}
                    >
                      -
                    </button>
                    <span className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600">
                      {quantity}
                    </span>
                    <button
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-r-lg"
                      onClick={() => incrementQuantity()}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-lg">Total:</span>
                    <span className="font-bold text-orange-600 text-xl">
                      {selectedItem.hasSizes && selectedSize
                        ? `$${(selectedSize.Precio * quantity).toFixed(2)}${
                            selectedSize.nombre || selectedSize.tamaño
                              ? ` (${selectedSize.nombre || selectedSize.tamaño})`
                              : ""
                          }`
                        : selectedItem.hasSizes
                          ? "Selecciona un tamaño"
                          : `$${(selectedItem.price * quantity).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    className={`flex-1 px-4 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                      selectedItem.hasSizes && !selectedSize
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                    onClick={handleAddToCart}
                    disabled={selectedItem.hasSizes && !selectedSize}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Agregar al carrito
                  </button>
                  <button
                    className={`flex-1 px-4 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                      selectedItem.hasSizes && !selectedSize
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                    onClick={handleBuyNow}
                    disabled={selectedItem.hasSizes && !selectedSize}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* No se muestra el modal de producto agregado, se navega directamente al carrito */}
    </div>
  )

  // Renderizar con el layout de cliente para mantener la navegación consistente
  return <ClientLayout>{menuContent}</ClientLayout>
}

export default MenuClient

