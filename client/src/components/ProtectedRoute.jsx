import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";

const ProtectedRoute = ({ onlyVerified = false }) => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkIsAutenticated = async () => {
        await checkAuth(navigate);
    }

    checkIsAutenticated();
  }, [])


  return <Outlet />; // Permite el acceso si pasa las verificaciones
};

export default ProtectedRoute;
