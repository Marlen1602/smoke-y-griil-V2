import { useForm } from "react-hook-form";
import { useAuth } from "../contex/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
    const { login, isAuthenticated, errors: loginErrors } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/Home"); // Redirigir después de iniciar sesión
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (data) => {
        await login(data); // Enviamos los datos al backend para iniciar sesión
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white max-w-md w-full p-10 rounded-lg shadow-lg">
                {/* Mostrar errores de inicio de sesión */}
                {loginErrors?.map((error, index) => (
                    <div className="bg-red-500 text-white text-center rounded-lg py-2 mb-4" key={index}>
                        {error.message}
                    </div>
                ))}

                <h2 className="text-3xl font-bold text-center text-black mb-6">Iniciar Sesión</h2>

                {/* Formulario de Login */}
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            {...register("email", { required: "El correo es obligatorio" })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Correo electrónico"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Contraseña"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-full transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
