import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto para el modo oscuro

const VerifyCodePage = () => {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { verifyCode, errors: verifyErrors } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // Usar el estado del modo oscuro
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (!email) {
            console.error("Email not found in location state");
        }
    }, [email]);

    const onSubmit = async (data) => {
        if (!email) return;
        try {
            setLoading(true);
            const formData = { ...data, email };
            const res = await verifyCode(formData);
            setLoading(false);

            if (res) {
                navigate("/paginaCliente");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div className={`p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Verificación de Código
                </h2>

                {/* Mostrar errores del servidor */}
                {Array.isArray(verifyErrors) && verifyErrors.map((error, i) => (
                    <div
                        className={`text-center p-2 rounded mb-4 ${isDarkMode ? "bg-red text-white" : "bg-red text-white"}`}
                        key={i}
                    >
                        {error}
                    </div>
                ))}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Código de Verificación
                        </label>
                        <input
                            type="text"
                            {...register("code", { required: true })}
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"}`}
                            placeholder="Ingresa tu código"
                        />
                        {formErrors.code && (
                            <span className="text-red text-sm">
                                El código es requerido
                            </span>
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2 grid place-items-center">
                    <button
                        type="submit"
                        className={`w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300`}
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar Código"}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyCodePage;


