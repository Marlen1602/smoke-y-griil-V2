import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useState, useEffect } from "react";

const VerifyCodePasswordPage = () => {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { verifyCodeForPassword, errors: verifyErrors } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  

    const onSubmit = async (data) => {
        try {

            setLoading(true);
            const formData = { ...data };
            const res = await verifyCodeForPassword(formData);  // Llama a la función para verificar el código
            setLoading(false);
            console.log(res)
            if (res.message) {
                navigate("/recuperar-contraseña/nueva-contraseña");
                
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
        

        // navigate("/paginaCliente");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Verificación de Código</h2>

                {Array.isArray(verifyErrors) && verifyErrors.map((error, i) => (
                    <div className="bg-red-500 text-black bg-rose-200 text-center p-2 rounded mb-4 " key={i}>
                        {error}
                    </div>
                ))}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 ">Código de Verificación</label>
                        <input
                            type="text"
                            {...register("code", { required: true })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
                            placeholder="Ingresa tu código"
                        />
                        {formErrors.code && <span className="text-red-500 text-sm text-red">El código es requerido</span>}
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

export default VerifyCodePasswordPage;

