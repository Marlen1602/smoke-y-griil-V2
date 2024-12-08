import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto para el modo oscuro

const VerifyCodePage = () => {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { verifyCode, errors: verifyErrors, setErrors } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // Usar el estado del modo oscuro
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null); // Estado local para el mensaje de error
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
            } else {
                // Mostrar mensaje de error si la verificación falla
                setErrorMessage("Código incorrecto o expirado.");
                
                // Eliminar el mensaje de error después de 3 segundos
                setTimeout(() => {
                    setErrorMessage(null);
                }, 3000);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setErrorMessage("Ocurrió un error al verificar el código.");
            
            // Eliminar el mensaje de error después de 3 segundos
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div className={`p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Verificación de Código
                </h2>

                {/* Mostrar el mensaje de error si existe */}
                {errorMessage && (
                    <div className="bg-red-500 text-white text-center p-2 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-semibold">Código</label>
                        <input
                            {...register("code", {
                                required: "El código es obligatorio.",
                                pattern: {
                                    value: /^\d{6}$/, // Valida que sean exactamente 6 dígitos
                                    message: "El código debe tener exactamente 6 números.",
                                },
                            })}
                            type="text"
                            id="code"
                            className={`mt-2 p-2 w-full border rounded-lg ${
                                formErrors.code ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Ingresa el código"
                        />
                        {formErrors.code && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.code.message}</p>
                        )}
                    </div>

                    {/* Botón de envío */}
                    <div className="col-span-1 md:col-span-2 grid place-items-center mt-6">
                        <button
                            type="submit"
                            className={`w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 ${
                                isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-600 hover:bg-orange-700"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Verificando..." : "Verificar código"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyCodePage;
