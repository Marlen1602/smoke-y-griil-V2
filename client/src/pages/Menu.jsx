import { useState, useEffect ,useContext} from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contex/ThemeContext"
import logo from "../assets/logo.png"
import AuthModal from "./AuthModal"
import Breadcrumbs from "../pages/Breadcrumbs"
import { getProductosRequest, getCategorias, getTamanosRequest } from "../api/auth.js"
import Footer from "../pages/Footer";
import { AuthContext } from "../contex/AuthContext";
import CartPreview from "../pages/CartPreview"; // Importa el nuevo componente
import { useCart } from "../contex/CartContext"; // Importa el contexto del carrito

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

const MenuPage = () => {
  const [filteredMenu, setFilteredMenu] = useState({})
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [sizes, setSizes] = useState([]) // Estado para almacenar todos los tamaños
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
   const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null) // Estado para el tamaño seleccionado
  const [selectedComplements, setSelectedComplements] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const { cartCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
 
   



  // Cargar productos, categorías y tamaños desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener categorías
        const categoriesResponse = await getCategorias()
        setCategories(categoriesResponse.data)

        // Obtener productos
        const productsResponse = await getProductosRequest()
        const products = productsResponse.data

        // Obtener tamaños
        const sizesResponse = await getTamanosRequest()
        setSizes(sizesResponse.data)
        console.log("Tamaños disponibles:", sizesResponse.data)

        // Depuración: mostrar la estructura completa de un producto
        if (products && products.length > 0) {
          console.log("Estructura completa de un producto:", products[0])
        }

        // Depuración: mostrar las URLs de las imágenes
        console.log(
          "Productos con imágenes:",
          products.map((p) => ({
            id: p.ID_Producto,
            nombre: p.Nombre,
            imagen: p.Imagen,
            tieneTamanos: p.TieneTamanos,
          })),
        )

        // Guardar todos los productos para filtrado posterior
        setAllProducts(products)

        // Agrupar productos por categoría
        const groupedProducts = groupProductsByCategory(products, categoriesResponse.data)
        setFilteredMenu(groupedProducts)

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar el menú. Por favor, intente nuevamente más tarde.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Función para agrupar productos por categoría
  const groupProductsByCategory = (products, categories) => {
    // Crear un objeto para almacenar productos por categoría
    const grouped = {}

    // Inicializar todas las categorías con arrays vacíos
    categories.forEach((category) => {
      grouped[category.Nombre] = []
    })

    // Agrupar productos por su categoría
    products.forEach((product) => {
      // Solo incluir productos disponibles
      if (product.Disponible) {
        const category = categories.find((cat) => cat.ID_Categoria === product.ID_Categoria)
        if (category) {
          // Transformar el producto al formato esperado por la UI
          const formattedProduct = {
            id: product.ID_Producto,
            name: product.Nombre,
            description: product.Descripcion,
            price: product.Precio || 0,
            image: product.Imagen, // Usar el campo correcto
            hasSizes: product.TieneTamanos,
            categoryId: product.ID_Categoria,
          }

          grouped[category.Nombre].push(formattedProduct)
        }
      }
    })

    // Eliminar categorías vacías
    Object.keys(grouped).forEach((key) => {
      if (grouped[key].length === 0) {
        delete grouped[key]
      }
    })

    return grouped
  }

  // Función para obtener los tamaños disponibles para un producto
  const getProductSizes = (productId) => {
    // Filtrar los tamaños que corresponden al producto seleccionado
    const productSizes = sizes.filter((size) => size.ID_Producto === productId)

    // Asegurar que los precios sean positivos y estén formateados correctamente
    return productSizes.map((size) => ({
      ...size,
      Precio: Math.abs(Number.parseFloat(size.Precio || 0)),
    }))
  }

  const handleSearch = () => {
    // Filtrar productos según los criterios de búsqueda
    let filteredProducts = [...allProducts].filter((product) => product.Disponible)

    // Filtrar por texto de búsqueda
    if (query.trim()) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.Nombre.toLowerCase().includes(query.toLowerCase()) ||
          product.Descripcion.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filtrar por precio mínimo
    if (minPrice) {
      filteredProducts = filteredProducts.filter((product) => product.Precio >= Number(minPrice))
    }

    // Filtrar por precio máximo
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((product) => product.Precio <= Number(maxPrice))
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) => product.ID_Categoria === Number(selectedCategory))
    }

    // Formatear los productos filtrados para la UI
    const formattedProducts = filteredProducts.map((product) => ({
      id: product.ID_Producto,
      name: product.Nombre,
      description: product.Descripcion,
      price: product.Precio || 0,
      image: product.Imagen, // Usar el campo correcto
      hasSizes: product.TieneTamanos,
      categoryId: product.ID_Categoria,
    }))

    // Mostrar resultados en una sola categoría
    setFilteredMenu({ Resultados: formattedProducts })
  }

  const handleOpenModal = (item, category) => {
    setSelectedItem({ ...item, category })
    setSelectedSize(null) // Resetear el tamaño seleccionado
    setSelectedComplements([])

    // Si el producto tiene tamaños, cargar los tamaños disponibles
    if (item.hasSizes) {
      const productSizes = getProductSizes(item.id)
      console.log("Tamaños para el producto:", productSizes)

      // Si hay tamaños disponibles, seleccionar el primero por defecto
      if (productSizes.length > 0) {
        setSelectedSize(productSizes[0])
      }
    }
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
    setSelectedSize(null)
  }

  const handleOpenMaps = () => {
    navigate("/ubicacion")
  }

  // Función para manejar la selección de tamaño
  const handleSizeSelect = (size) => {
    // Asegurar que el precio sea positivo
    const updatedSize = {
      ...size,
      Precio: Math.abs(Number.parseFloat(size.Precio || 0)),
    }
    setSelectedSize(updatedSize)
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen">
      {/* HEADER */}
      <header className="flex flex-col shadow-md text-gray-950 bg-gray-950 dark:bg-gray-800 relative">
        {/* Barra principal del header */}
        <div className="flex flex-wrap justify-between items-center p-4 mt-4">
          <div className="flex items-center space-x-4">
            <button className="text-white text-2xl" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i>
            </button>
            <img
              src={logo || "/placeholder.svg"}
              alt="Logo"
              className="h-16 md:h-24 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div
              className="hidden md:flex items-center text-sm text-gray-400 dark:text-gray-300 cursor-pointer"
              onClick={handleOpenMaps}
            >
              <i className="fas fa-map-marker-alt text-xl text-white"></i>
              <span className="ml-1 text-white">Ubicación</span>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="w-full md:flex-1 mx-0 md:mx-6 my-4 md:my-0 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Buscar por especialidad"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded-full border dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button onClick={handleSearch}>
              <i className="fas fa-search text-xl text-white dark:text-white cursor-pointer"></i>
            </button>
            <button
              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-500 transition ml-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </button>
          </div>

          {/* Iconos de ingreso, carrito y modo oscuro */}
          <div className="flex items-center space-x-6 text-white">
            <button
              onClick={toggleTheme}
              className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <div className="flex items-center text-sm cursor-pointer" onClick={() => setShowAuthModal(true)}>
              <i className="fas fa-user text-xl"></i>
              <span className="ml-2">Ingreso</span>
            </div>
            <div className="relative">
              <i 
                className="fas fa-shopping-cart text-xl cursor-pointer" 
                onClick={() => setShowCart(true)}
              ></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

       <Breadcrumbs />

      {/* Filtros Avanzados */}
      {showFilters && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-300">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block font-semibold">Precio Mínimo:</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold">Precio Máximo:</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold">Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.ID_Categoria} value={category.ID_Categoria}>
                    {category.Nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* MENÚ */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Menú del Restaurante</h1>

        {/* Mostrar mensaje de carga */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Mostrar mensaje de error */}
        {error && (
          <div className="bg-red border border-red text-white px-4 py-3 rounded relative" role="alert">
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
      </div>
           {/* Vista previa del carrito */}
      <CartPreview isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* MODAL DE PLATILLO */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-10 relative w-120 max-w-xl mx-4">
            <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300" onClick={handleCloseModal}>
              ✖
            </button>
            <h3 className="text-lg font-semibold text-orange-500">{selectedItem.category}</h3>
            <div className="relative">
              <ProductImage
                src={selectedItem.image}
                alt={selectedItem.name}
                productName={selectedItem.name}
                className="w-full h-48 rounded-lg mb-4 relative"
              />
            </div>
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{selectedItem.description}</p>

            {/* Mostrar precio o selector de tamaños */}
            {selectedItem.hasSizes ? (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Selecciona un tamaño:</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {getProductSizes(selectedItem.id).map((size) => (
                    <button
                      key={size.ID_Tamano}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize && selectedSize.ID_Tamano === size.ID_Tamano
                          ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      <span className="block">{size.Nombre}</span>
                      <span className="block font-bold mt-1">${Math.abs(size.Precio).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
                {selectedSize ? (
                  <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg border border-orange-100 dark:border-gray-600">
                    <p className="text-orange-600 dark:text-orange-400 font-bold">
                      Precio: ${Math.abs(selectedSize.Precio).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Selecciona un tamaño para ver el precio</p>
                )}
              </div>
            ) : (
              <div className="mt-4 mb-4">
                <p className="text-orange-600 font-bold text-xl bg-orange-50 dark:bg-gray-700 p-3 rounded-lg border border-orange-100 dark:border-gray-600">
                  {selectedItem.price && Number.parseFloat(selectedItem.price) > 0
                    ? `$${Number.parseFloat(selectedItem.price).toFixed(2)}`
                    : "Consultar precio"}
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <button
                className={`w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                  selectedItem.hasSizes && !selectedSize
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg"
                }`}
                disabled={selectedItem.hasSizes && !selectedSize}
                onClick={() => {
                  addToCart({
                    ...selectedItem,
                    quantity: 1,
                    selectedSize,
                    selectedComplements,
                  });
                  handleCloseModal(); // Cierra el modal tras agregar
                }}
              >
                <i className="fas fa-cart-plus mr-2"></i>
                Agregar y Seguir
              </button>

          <button
              className={`w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                selectedItem.hasSizes && !selectedSize
                  ? "bg-orange-300 text-orange-100 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg"
              }`}
              disabled={selectedItem.hasSizes && !selectedSize}
              onClick={() => {
                // Agrega al carrito
                addToCart({
                  ...selectedItem,
                  quantity: 1,
                  selectedSize,
                  selectedComplements,
                });

                // Si no está logueado, muestra el modal de autenticación
                if (!user) {
                  setShowAuthModal(true);
                  return;
                }

                // Si está logueado, redirige al checkout
                navigate("/checkout");
              }}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Realizar el pedido
            </button>
            </div>

            {/* Mensaje si no hay tamaños disponibles */}
            {selectedItem.hasSizes && getProductSizes(selectedItem.id).length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg flex items-start">
                <i className="fas fa-exclamation-triangle mr-3 mt-1 text-yellow-500"></i>
                <div>
                  <p className="font-medium">No hay tamaños disponibles</p>
                  <p className="text-sm mt-1">
                    Este producto requiere selección de tamaño, pero no hay opciones disponibles actualmente. Por favor,
                    contacte al administrador.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <Footer />
      </div>
  )
}

export default MenuPage

