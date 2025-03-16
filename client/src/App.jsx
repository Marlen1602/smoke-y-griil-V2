import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import Home from "./pages/Home";
import AuthModal from "./pages/AuthModal";
import { AuthProvider } from "./contex/AuthContext";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import PoliticasPage from "./pages/PoliticasPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyCodePasswordPage from "./pages/VerifyCodePasswordPage";
import NewPasswordPage  from "./pages/NewPasswordPage";
import TermsPage from "./pages/TermsPage";
import DeslindePage from "./pages/DeslindePage";
import EmpresaPage from "./pages/EmpresaPage";
import IncidenciasPage from "./pages/IncidenciaPage";
import ConfigPage from "./pages/ConfigPage";
import { ThemeProvider } from "./contex/ThemeContext"; 
import Error404 from "./pages/404"
import Error400 from "./pages/400"
import Error500 from "./pages/500"
import Menu from "./pages/Menu"
import MenuPage from "./pages/MenuClient";
import QuienesSomosPage from "./pages/QuienesSomosPage";
import VisionPage from "./pages/VisionPage";
import MisionPage from "./pages/MisionPage";
import { SearchProvider } from "./contex/SearchContext";


function App() {
  return (
    <ThemeProvider>
       <SearchProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrar" element={<RegisterPage />} />
            <Route path="/verificar-codigo" element={<VerifyCodePage />} />
            <Route path="/quienes-somos" element={<QuienesSomosPage />} />
            <Route path="/vision" element={<VisionPage />} />
            <Route path="/mision" element={<MisionPage />} />
            
            {/* Rutas accesibles sin autenticación */}
            <Route path="/menu" element={<Menu />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute onlyVerified={true} />}>
              <Route path="/paginaCliente" element={<ClientPage />} />
              <Route path="/MenuPrincipal" element={<MenuPage />} />
            </Route>

            <Route path="/paginaAdministrador" element={<AdminPage />} />
            <Route path="/politicas" element={<PoliticasPage />} />
            <Route path="/terminosCondiciones" element={<TermsPage />} />
            <Route path="/deslindeLegal" element={<DeslindePage />} />
            <Route path="/empresa" element={<EmpresaPage />} />
            <Route path="/incidencias" element={<IncidenciasPage />} />
            <Route path="/configuracion" element={<ConfigPage />} />

            <Route path="/authModal" element={<AuthModal />} />
            
            {/* Rutas para errores */}
            <Route path="/error-400" element={<Error400 />} />
            <Route path="/error-500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} />

            {/* Rutas para recuperación de contraseña */}
            <Route path="/recuperar-contraseña" element={<VerifyEmail />} />
            <Route path="/recuperar-contraseña/verificar-codigo" element={<VerifyCodePasswordPage />} />
            <Route path="/recuperar-contraseña/nueva-contraseña" element={<NewPasswordPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
