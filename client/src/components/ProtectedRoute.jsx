import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";

const ProtectedRoute = ({ onlyVerified = false }) => {
  const {user, isAutenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkIsAutenticated = async () => {
        await checkAuth(navigate);
    }

    checkIsAutenticated();
  }, [])


    // console.log(user, isAutenticated)
//   if (loading) return <div>Loading...</div>; // Muestra algo mientras carga

//   // Verifica si el usuario no está autenticado
//   if (!user) {
//     return <Navigate to="/login" />; // Redirige al login si no está autenticado
//   }

//   // Verifica si el usuario no ha verificado su email (si es requerido)
//   if (onlyVerified && !user.emailVerified) {
//     return <Navigate to="/verificar-codigo" />; // Redirige a la página de verificación
//   }

  return <Outlet />; // Permite el acceso si pasa las verificaciones
};

export default ProtectedRoute;
