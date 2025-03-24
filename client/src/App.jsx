import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import Home from "./pages/Home";
import { CartProvider } from "./contex/CartContext"
import AuthModal from "./pages/AuthModal";
import { AuthProvider } from "./contex/AuthContext";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyCodePasswordPage from "./pages/VerifyCodePasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import EmpresaPage from "./pages/EmpresaPage";
import IncidenciasPage from "./pages/IncidenciaPage";
import ConfigPage from "./pages/ConfigPage";
import { ThemeProvider } from "./contex/ThemeContext"; 
import Error404 from "./pages/404";
import Error400 from "./pages/400";
import Error500 from "./pages/500";
import Menu from "./pages/Menu";
import MenuPage from "./pages/MenuClient";
import QuienesSomosPage from "./pages/QuienesSomosPage";
import VisionPage from "./pages/VisionPage";
import MisionPage from "./pages/MisionPage";
import UbicacionPage from "./pages/ubicacion";
import ProductosPage from "./pages/ProductosPage";
import { SearchProvider } from "./contex/SearchContext";
import DocumentosPage from "./pages/documetosPage";
import TerminosPage from "./pages/TerminoPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import PrediccionesPage from "./pages/predicconesPage"
import Perfil from "./pages/PerfilPage"
import MetodoRecuperar from "./pages/MetodoRecupe"
import PreguntaSecreta from "./pages/PreguntaSecreta";

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <BrowserRouter>
          <AuthProvider>
          <CartProvider>
            <Routes>
              {/* 🔹 Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registrar" element={<RegisterPage />} />
              <Route path="/verificar-codigo" element={<VerifyCodePage />} />
              <Route path="/quienes-somos" element={<QuienesSomosPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/mision" element={<MisionPage />} />
              <Route path="/ubicacion" element={<UbicacionPage />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/authModal" element={<AuthModal />} />
              <Route path="/terminos" element={<TerminosPage />} />
              <Route path="/privacidad" element={<PrivacidadPage />} />

              {/* 🔹 Rutas protegidas para usuarios autenticados */}
              <Route element={<ProtectedRoute />}>
                <Route path="/paginaCliente" element={<ClientPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/MenuPrincipal" element={<MenuPage />} />
                <Route path="/inicioCliente" element={<ClientPage />} />
                <Route path="/perfil" element={<Perfil />} />

               </Route>

              {/* 🔹 Rutas protegidas SOLO para administradores */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/paginaAdministrador" element={<AdminPage />} />
                <Route path="/documentos" element={<DocumentosPage />} />
                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/incidencias" element={<IncidenciasPage />} />
                <Route path="/configuracion" element={<ConfigPage />} />
                <Route path="/predicciones" element={<PrediccionesPage />} />
              </Route>

              {/* 🔹 Rutas de errores */}
              <Route path="/error-400" element={<Error400 />} />
              <Route path="/error-500" element={<Error500 />} />
              <Route path="*" element={<Error404 />} />

              {/* 🔹 Rutas para recuperación de contraseña */}
              <Route path="/metodo-recuperacion" element={<MetodoRecuperar />} />
              <Route path="/recuperar-preguntasecreta" element={<PreguntaSecreta />} />
              <Route path="/recuperar-contraseña" element={<VerifyEmail />} />
              <Route path="/recuperar-contraseña/verificar-codigo" element={<VerifyCodePasswordPage />} />
              <Route path="/recuperar-contraseña/nueva-contraseña" element={<NewPasswordPage />} />
            </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
