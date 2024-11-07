import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import Home from "./pages/Home";
import AuthModal from "./pages/AuthModal";
import { AuthProvider } from "./contex/AuthContext";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyCodePasswordPage from "./pages/VerifyCodePasswordPage";
import NewPasswordPage  from "./pages/NewPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/verificar-codigo" element={<VerifyCodePage /> } />
          <Route element={<ProtectedRoute onlyVerified={true} />}>
            <Route path="/paginaCliente" element={<ClientPage />} />
          </Route>
          <Route path="/paginaAdministrador" element={<AdminPage />} />
          <Route path="/authModal" element={<AuthModal />} />

          <Route path="/recuperar-contraseña" element={<VerifyEmail />} />
          <Route path="/recuperar-contraseña/verificar-codigo" element={<VerifyCodePasswordPage />} />
          <Route path="/recuperar-contraseña/nueva-contraseña" element={<NewPasswordPage />} />
          
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
