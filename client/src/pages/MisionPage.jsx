import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./PrincipalNavBar"; // Importamos el Header
import logo from "../assets/logo.png"; // Importamos el logo
import Breadcrumbs from "../pages/Breadcrumbs";

const MisionPage = () => {
  const location = useLocation(); // 🔹 Obtener datos enviados desde Home.jsx
  const data = location.state || { 
    titulo: "Misión", 
    descripcion: "No hay información disponible." 
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      {/* 🔹 Encabezado */}
      <Header />
       {/* 🔹 Breadcrumbs */}
      <div className="bg-white py-3 px-8 rounded-md flex items-center">
        <Breadcrumbs />
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-12 text-center md:text-left">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{data.titulo}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{data.descripcion}</p>
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
          {/* Logo */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <img src={logo} alt="Logo" className="h-12" />
          </div>

          {/* Enlaces */}
          <div className="w-full md:w-auto flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-8">
            <ul className="space-y-2 text-center md:text-left">
              <li className="hover:text-orange-400 cursor-pointer">Misión</li>
              <li className="hover:text-orange-400 cursor-pointer">Quiénes Somos</li>
              <li className="hover:text-orange-400 cursor-pointer">Visión</li>
            </ul>
            <ul className="space-y-2 text-center md:text-left">
              <li className="hover:text-orange-400 cursor-pointer">Términos y Condiciones</li>
              <li className="hover:text-orange-400 cursor-pointer">Aviso de Privacidad</li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
            <i className="fab fa-facebook text-2xl hover:text-blue-400 cursor-pointer"></i>
            <i className="fab fa-instagram text-2xl hover:text-pink-400 cursor-pointer"></i>
            <i className="fab fa-tiktok text-2xl hover:text-white cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MisionPage;
