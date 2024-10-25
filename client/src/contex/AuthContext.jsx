import { createContext, useState, useContext } from "react";
import { registerRequest, loginRequest } from "../api/auth";  // Asegúrate de tener la función loginRequest

export const AuthContext = createContext();

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

    // Función para registrar un usuario
    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]);  // Limpiar errores si el registro es exitoso
        } catch (error) {
            console.log(error.response);
            setErrors([error.response.data]);  // Guardar errores
        }
    };

    // Función para iniciar sesión
    const login = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]);  // Limpiar errores si el login es exitoso
        } catch (error) {
            console.log(error.response);
            setErrors([error.response.data]);  // Guardar errores en el estado
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setErrors([]);  // Limpiar los errores
    };

    return (
        <AuthContext.Provider
            value={{
                signup,
                login,   // Asegúrate de que login esté disponible en el contexto
                logout,
                user,
                isAuthenticated,
                errors
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
