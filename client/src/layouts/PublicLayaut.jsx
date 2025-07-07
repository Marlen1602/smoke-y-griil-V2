import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../contex/ThemeContext.jsx"
import logo from "../assets/logo.png"
import AuthModal from "../pages/AuthModal.jsx";
import { useSearch } from "../contex/SearchContext" // Importar el contexto
import Footer from "../pages/Footer.jsx" // Importamos el Footer
import CartPreview from "../pages/CartPreview"; // Importa el nuevo componente
import { useCart } from "../contex/CartContext"; // Importa el contexto del carrito


// Renombramos de Header a PrincipalLayout y añadimos children como prop
const PrincipalLayout = ({ children, onSearch }) => {
  const [showModal, setShowModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
   const [showCart, setShowCart] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch()
  const { isDarkMode, toggleTheme } = useTheme()
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/checkout");
  const { cartCount } = useCart();
  

  const navigate = useNavigate()

  useEffect(() => {
  const handler = (e) => {
    if (e.detail?.redirect) {
      setRedirectAfterLogin(e.detail.redirect);
    }
    setShowModal(true); // Muestra el modal
  };

  window.addEventListener("open-auth-modal", handler);
  return () => window.removeEventListener("open-auth-modal", handler);
}, []);



  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("/menu")
    }
  }

  const handleLoginClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleOpenMaps = () => {
    navigate("/ubicacion")
  }

  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.error("🔴 Error global:", { message, source, lineno, colno, error });

      fetch("http://localhost:4000/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          source,
          lineno,
          colno,
          stack: error?.stack || null,
        }),
      });
    };

    window.addEventListener("unhandledrejection", (event) => {
      console.error("🟠 Promesa no manejada:", event.reason);

      fetch("http://localhost:4000/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: event.reason?.message || "Error en promesa no manejada",
          stack: event.reason?.stack || null,
        }),
      });
    });

    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
      {/* Encabezado con fondo negro y Breadcrumbs bien alineados */}
      <header className="flex flex-col shadow-md text-gray-950 bg-gray-950 dark:bg-gray-800 relative">
        {/* Contenedor del menú principal */}
        <div className="flex flex-wrap justify-between items-center p-4 mt-4">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-4">
            <button className="text-white text-2xl" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </button>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-16 md:h-24 w-auto" />

            {/* Ubicación con texto blanco */}
            <div className="hidden md:flex items-center text-white cursor-pointer" onClick={handleOpenMaps}>
              <i className="fas fa-map-marker-alt text-xl"></i>
              <span className="ml-1">Ubicación</span>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="w-full md:flex-1 mx-0 md:mx-6 my-4 md:my-0 flex items-center space-x-2 ">
            <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 flex">
              <input
                type="text"
                placeholder="Buscar en el menú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded-full border dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <button type="submit">
                <i className="fas fa-search text-xl text-white dark:text-white cursor-pointer ml-2"></i>
              </button>
            </form>
          </div>

           {/* Iconos de ingreso, carrito y modo oscuro */}
          <div className="flex items-center space-x-6 text-white">
            <button
              onClick={toggleTheme}
              className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <div className="flex items-center text-sm cursor-pointer" onClick={handleLoginClick}>
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

      {/* Modal de autenticación */}
      {showModal && (
  <AuthModal
    onClose={handleCloseModal}
    redirectTo={redirectAfterLogin}
  />
)}
    {/* Vista previa del carrito */}
      <CartPreview isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Menú lateral */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div
            className="absolute left-0 top-0 w-64 h-full bg-gray-950 dark:bg-gray-800 shadow-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="text-gray-500 dark:text-gray-300 text-xl mb-4" onClick={toggleMenu}>
              ✖
            </button>
            <nav className="space-y-4">
              <Link
                to="/menu"
                className="block text-white dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Menú
              </Link>
              <Link
                to="/reservaciones"
                className="block text-white dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Reservaciones
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Contenido principal - NUEVO */}
      <main className="flex-grow">{children}</main>

      {/* Footer - NUEVO */}
      <Footer />
    </div>
  )
}

export default PrincipalLayout

