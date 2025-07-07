import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../contex/AuthContext"
import { useTheme } from "../contex/ThemeContext"
import Footer from "../pages/Footer.jsx"
import { useCart } from "../contex/CartContext";



const ClientLayout = ({ children }) => {
  const { logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const { cartCount } = useCart();

  const navigate = useNavigate()
  

  const handleSignup = async () => {
    console.log("Cerrando sesión...")
    logout()
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
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Header/Navbar - Exactamente igual que ClientNavBar */}
      <header className="flex flex-col shadow-md text-white bg-gray-950 dark:bg-gray-800 relative">
        {/* Barra principal del header */}
        <div className="flex flex-wrap justify-between items-center p-4 mt-4">
          {/* Logo and navigation */}
          <div className="flex items-center space-x-4">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-16 w-auto" />
            <nav>
              <ul className="flex space-x-4">
                <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/inicioCliente")}>
                  Inicio
                </li>
                <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/perfil")}>
                  Perfil
                </li>
                <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/pedidos")}>
                  Pedidos
                </li>
                <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/MenuPrincipal")}>
                  Menú
                </li>
              </ul>
            </nav>
          </div>

          {/* Iconos de ingreso, carrito y modo oscuro */}
          <div className="flex items-center space-x-6 text-white">
            <button
              onClick={toggleTheme}
              className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <div className="relative cursor-pointer" onClick={() => navigate("/carrito")}>
  <i className="fas fa-shopping-cart text-xl"></i>
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {cartCount}
    </span>
  )}
</div>

            <button className="hover:text-gray-400 cursor-pointer" onClick={handleSignup}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal - Aquí se renderizarán los children */}
      <main className="flex-grow bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ClientLayout


