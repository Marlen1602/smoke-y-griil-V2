import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user, isAuthenticated, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true); // Estado de carga mientras se verifica la sesión

  useEffect(() => {
    const verifyUser = async () => {
      await checkAuth(navigate);
      setIsVerifying(false); // Marcar que la verificación ha finalizado
    };
    verifyUser();
  }, []);

  if (loading || isVerifying) return <p>Cargando...</p>; // Evita parpadeo mientras se verifica la sesión

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
