import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto del tema

const VerifyEmail = () => {
    const { sendEmailResetPassword, errors } = useAuth();
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // Usamos el estado del tema oscuro

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await sendEmailResetPassword(data.email);
            setLoading(false);
            if (res.message) {
                navigate("/recuperar-contraseña/verificar-codigo");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div className={`p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Recuperar contraseña
                </h2>

                {/* Mostrar errores del servidor */}
                {errors.length > 0 && (
                    <div className="bg-red text-white text-center p-2 rounded mb-4">
                        {errors[0]}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
                            placeholder="Ingresa tu correo"
                        />
                        {formErrors.email && (
                            <span className="text-red text-sm">
                                El correo es requerido
                            </span>
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2 grid place-items-center">
                    <button
                        type="submit"
                        className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Verificar correo"}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;

