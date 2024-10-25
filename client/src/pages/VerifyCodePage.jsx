import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";

const VerifyCodePage = () => {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { verifyCode, errors: verifyErrors } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (!email) {
            console.error("Email not found in location state");
        }
    }, [email]);

    const onSubmit = async (data) => {
        if (!email) return;
        setLoading(true);
        const formData = { ...data, email };
        await verifyCode(formData);  // Llama a la función para verificar el código
        setLoading(false);
        navigate("/paginaCliente");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Verificación de Código</h2>

                {Array.isArray(verifyErrors) && verifyErrors.map((error, i) => (
                    <div className="bg-red-500 text-white text-center p-2 rounded mb-4" key={i}>
                        {error}
                    </div>
                ))}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Código de Verificación</label>
                        <input
                            type="text"
                            {...register("code", { required: true })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
                            placeholder="Ingresa tu código"
                        />
                        {formErrors.code && <span className="text-red-500 text-sm">El código es requerido</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar Código"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyCodePage;

