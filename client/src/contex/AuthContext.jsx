import { createContext, useState, useContext } from "react";
import { registerRequest, loginRequest, verifyAuthRequest, logoutRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();
const API = 'http://localhost:3000/api'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleRequestError = (error) => {
    console.error("Error en la solicitud:", error);

    // Redirige a error 500 si el servidor no responde o no hay conexión a Internet
    if (!error.response) {
      navigate("/error-500");
      return;
    }

    setErrors([error.response?.data?.message || "Error inesperado"]);
  };

  // Función de verificación de código
  const verifyCode = async (formData) => {
    try {
      console.log("📤 Enviando código de verificación:", formData);
  
      const res = await axios.post(`${API}/verify-email`, formData, { withCredentials: true });
  
      console.log("✅ Respuesta del backend:", res.data);
      setErrors([]);
      return res.data;
    } catch (error) {
      console.error("❌ Error en verifyCode:", error.response?.data || error.message);
      setErrors([error.response?.data?.message || "Error inesperado"]);
    }
  };
  

  const updatePassword = async (formData) => {
    try {
     
      // TODO : cambiar a variables de entorno
      const res = await axios.put(
        "http://localhost:3000/api/update-password",
        formData
      );
      setErrors([]);
      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      setErrors([error.response?.data.message] || ["Error inesperado"]);
    }
  };

  const verifyCodeForPassword = async (formData) => {
    let email = localStorage.getItem("email");
    try {
      // TODO : cambiar a variables de entorno
      const res = await axios.post(
        "http://localhost:3000/api/verify-code-password",
        {
          email: email,
          code: formData.code,
        }
      );
      setErrors([]);
      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      setErrors([error.response?.data.message] || ["Error inesperado"]);
    }
  };

  const sendEmailResetPassword = async (formData) => {
    try {
      // TODO : cambiar a variables de entorno
      const res = await axios.post(
        "http://localhost:3000/api/email-reset-password",
        {
          email: formData,
        }
      );
      setErrors([]);
      localStorage.setItem("email", formData); 
      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      setErrors([error.response?.data.message] || ["Error inesperado"]);
    }
  }

  const verifyEmail = async (formData) => {
    try {
      // TODO : cambiar a variables de entorno
      const res = await axios.post(
        "http://localhost:3000/api/verify-email",
        {
          email: formData, }
      );
      setErrors([]);
      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      setErrors([error.response?.data.message] || ["Error inesperado"]);
    }
  };

 
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);

      // Guardar el token en localStorage o en cookies
      localStorage.setItem("token", res.data.token);

      navigate("/verificar-codigo");
    } catch (error) {
      setErrors([error.response?.data || "Error en el registro"]);
    }
  };

  const login = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);

      if (res.data.tipoUsuarioId === 1) {
        navigate("/paginaAdministrador");
      } 
     else if (res.data.tipoUsuarioId === 2) {
        navigate("/paginaCliente");
      } 
      else {
        navigate("/paginaCliente");
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  const logout = async () => {
    // Eliminar token
    try {
      await logoutRequest();

      setUser(null);
      setIsAuthenticated(false);
      setErrors([]);
      localStorage.removeItem("token"); // Eliminar token del almacenamiento
      navigate("/login");
    } catch (error) {
      console.log(error)
    }
   
  };

  // verificar si inicio sesion
  const checkAuth = async (navigate) => {
    try {
      const res = await verifyAuthRequest();

      if (res && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        setErrors([]);
      }
    } catch (error) {
      
      console.log(error.response.data.isVerified)
      if(error.response.data?.isVerified === false)return navigate("/verificar-codigo");

      navigate("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        isAuthenticated,
        verifyCode,
        errors,
        setErrors,
        checkAuth,
        verifyEmail,
        sendEmailResetPassword,
        verifyCodeForPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
