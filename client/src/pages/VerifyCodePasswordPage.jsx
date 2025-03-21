import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import { useTheme } from "../contex/ThemeContext";
import Footer from "./Footer.jsx";
import Breadcrumbs from "../pages/Breadcrumbs";
import Header from "../pages/ClientBar.jsx";
const VerifyCodePasswordPage = () => {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { verifyCodeForPassword, errors: verifyErrors } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useTheme();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const formData = { ...data };
            const res = await verifyCodeForPassword(formData);
            setLoading(false);

            if (res.message) {
                navigate("/recuperar-contraseña/nueva-contraseña");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-900 dark:text-white min-h-screen`}>
        {/* Header */}
        <Header />
         {/* Breadcrumbs en la parte blanca */}
    <div className="bg-white py-3 px-8  rounded-md flex items-center">
      <Breadcrumbs />
    </div>
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div className={`p-10 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className="text-2xl font-bold text-center mb-6">Verificación de Código</h2>

                {/* Mostrar errores del servidor */}
                {Array.isArray(verifyErrors) && verifyErrors.map((error, i) => (
                    <div className="bg-red text-white text-center p-2 rounded mb-4" key={i}>
                        {error}
                    </div>
                ))}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Código de Verificación</label>
                        <input
                            type="text"
                            {...register("code", {
                                required: "El código es requerido",
                                pattern: {
                                    value: /^\d{6}$/, // Permite únicamente números de exactamente 6 dígitos
                                    message: "El código debe ser un número de 6 dígitos",
                                },
                            })}
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
                            placeholder="Ingresa tu código"
                        />
                        {formErrors.code && <span className="text-red text-sm">{formErrors.code.message}</span>}
                    </div>
                    <div className="col-span-1 md:col-span-2 grid place-items-center">
                        <button
                            type="submit"
                            className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300"
                            disabled={loading}
                        >
                            {loading ? "Verificando..." : "Verificar Código"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer/>
    </div>
    );
};

export default VerifyCodePasswordPage;



