import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import '../styles/medidor.css';

function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm();
    const { signup, isAuthenticated, errors: registerErrors, setErrors } = useAuth();
    const navigate = useNavigate();
    const password = watch("password");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [email, setEmail] = useState(null);

    // Estado para guardar el token del reCAPTCHA
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    // Evaluar fortaleza de la contraseña en tiempo real
    const evaluatePasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength("weak");
        } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password)) {
            setPasswordStrength("strong");
        } else {
            setPasswordStrength("medium");
        }
    };

    useEffect(() => {
        // Redirigir solo si no hay errores y el correo está definido
        if (isAuthenticated && registerErrors.length === 0 && email) {
            console.log("Navigating with email:", email);
            navigate("/verificar-codigo", { state: { email } });
        }
    }, [isAuthenticated, registerErrors, email, navigate]);

    // Manejar el envío del formulario
    const onSubmit = handleSubmit(async (values) => {
        if (!recaptchaToken) {
            alert("Por favor verifica que no eres un robot.");
            return;
        }

        clearErrors();
        localStorage.setItem("email",values.email)
        // Enviamos el token de reCAPTCHA junto con los valores del formulario
        const formData = { ...values, recaptchaToken };

        await signup(formData).catch((error) => {
            console.log(error.response?.data || "Unexpected error");
        });

        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    });

    const clearErrors = () => {
        setErrors([]);
    };

    // Manejar el cambio en el reCAPTCHA
    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token); // Guardar el token de reCAPTCHA
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white max-w-2xl w-full p-10 rounded-lg shadow-lg">
                {/* Mostrar errores de registro */}
                {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
                    <div className="bg-red text-white text-center rounded-lg py-2 mb-4" key={i}>
                        {error.message || error}
                    </div>
                ))}

                <h2 className="text-3xl font-bold text-center text-black mb-6">
                    Crear cuenta
                </h2>

                {/* Formulario en dos columnas */}
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo de nombre de usuario */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            {...register("username", { required: true })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    {/* Campo de nombre */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            {...register("nombre", { required: true })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nombre"
                        />
                        {errors.nombre && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    {/* Campo de apellidos */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Apellidos
                        </label>
                        <input
                            type="text"
                            {...register("apellidos", { required: true })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Apellidos"
                        />
                        {errors.apellidos && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    {/* Campo de correo electrónico */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Correo electrónico"
                        />
                        {errors.email && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    {/* Campo de contraseña */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                                    message: "Debe incluir mayúsculas, minúsculas, números y caracteres especiales."
                                }
                            })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Contraseña"
                            onChange={(e) => evaluatePasswordStrength(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red text-sm mt-1">
                                {errors.password.message || "La contraseña debe tener al menos 8 caracteres."}
                            </p>
                        )}
                        <p>Fortaleza de la contraseña:</p>
                        <div className={`password-strength-bar ${passwordStrength}`} />
                    </div>

                    {/* Campo de confirmar contraseña */}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            {...register("Confirmpassword", {
                                required: true,
                                validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
                            })}
                            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Confirmar contraseña"
                        />
                        {errors.Confirmpassword && (
                            <p className="text-red text-sm mt-1">
                                {errors.Confirmpassword.message}
                            </p>
                        )}
                    </div>
                    
                    {/* reCAPTCHA */}
                    <div className="col-span-2 flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LdPD2cqAAAAAJwcFkgMCs0aYpq0U6cVU-oeeTid"  // Your correct site key here
                            onChange={onRecaptchaChange} 
                            onExpired={() => setRecaptchaToken(null)} 
                        />
                    </div>

                    {/* Botón para crear cuenta */}
                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-full transition duration-300"
                        >
                            CREAR
                        </button>
                    </div>
                </form>
            </div>
        </div>

  );
}

export default RegisterPage;


