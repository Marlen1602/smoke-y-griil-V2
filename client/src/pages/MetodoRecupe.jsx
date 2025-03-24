import { useNavigate } from "react-router-dom"
import PublicLayaut from "../layouts/PublicLayaut"
import Breadcrumbs from "../pages/Breadcrumbs";

const SeleccionarMetodoRecuperacion = () => {
  const navigate = useNavigate()

  return (
    <PublicLayaut>
       <div className="bg-white py-3 px-8  rounded-md flex items-center">
    <Breadcrumbs />
  </div>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¿Cómo desea restablecer su contraseña?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Seleccione uno de los siguientes métodos para recuperar su contraseña
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/recuperar-contraseña")}
              className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Correo electrónico</span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">o</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
              onClick={() => navigate("/recuperar-preguntasecreta")}
              className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Pregunta secreta</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </PublicLayaut>
  )
}

export default SeleccionarMetodoRecuperacion

