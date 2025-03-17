import React,{ useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import Footer from './Footer.jsx';
import { useAuth } from "../contex/AuthContext"; // Importamos el contexto de autenticación
import { useTheme } from "../contex/ThemeContext"; // Importamos el contexto del modo oscuro
import Breadcrumbs from "../pages/Breadcrumbs";


const ClientPage = () => {
  const { logout } = useAuth(); // Usamos la función de logout desde el contexto
  const { isDarkMode, toggleTheme } = useTheme();
   const navigate = useNavigate();
  const handleSignup = async () => {
    console.log("Cerrando sesión...");
    logout();
  };

  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    { question: "¿Cómo hago un pedido?", answer: "Solo navega por nuestro menú, selecciona los platillos y agrégalos al carrito. Luego, finaliza la compra con tu método de pago favorito." },
    { question: "¿Cuánto tarda la entrega?", answer: "El tiempo de entrega varía según la zona, pero generalmente es de 30 a 45 minutos." },
    { question: "¿Puedo pagar en efectivo?", answer: "Sí, aceptamos pagos en efectivo, tarjeta y transferencias bancarias." },
    ];
    const toggleFaq = (index) => {
      setActiveFaq(activeFaq === index ? null : index);
    };
    

  return (
    <div className="bg-white dark:bg-gray-900  dark:text-white min-h-screen">

    {/* HEADER */}
    <header className="flex flex-col shadow-md text-white bg-gray-950 dark:bg-gray-800 relative">
      
       
      {/* Barra principal del header */}
      <div className="flex flex-wrap justify-between items-center p-4 mt-4">
        
    
    {/* Logo and navigation */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <nav>
            <ul className="flex space-x-4">
              <li className="hover:text-gray-400 cursor-pointer">Inicio</li>
              <li className="hover:text-gray-400 cursor-pointer">Perfil</li>
              <li className="hover:text-gray-400 cursor-pointer">Pedidos</li>
              <li className="hover:text-gray-400 cursor-pointer" onClick={() => navigate("/MenuPrincipal")}>
                Menú
              </li>
            </ul>
          </nav>
        </div>
        {/* Iconos de ingreso, carrito y modo oscuro */}
        <div className="flex items-center space-x-6 text-white">
          <button onClick={toggleTheme} className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <i className="fas fa-shopping-cart text-xl"></i>
                    <button className="hover:text-gray-400 cursor-pointer" onClick={handleSignup}>
          Cerrar Sesión
        </button>
        </div>
        </div>
      </header>
      {/* Breadcrumbs dentro del Header, en la parte superior */}
      <div className="bg-white py-3 px-8  rounded-md flex items-center">
        <Breadcrumbs />
      </div>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            ¡Bienvenido a tu Panel de Usuario!
          </h1>
          <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
            Aquí puedes gestionar tus pedidos y actualizar tu información personal.
          </p>
          <button className="bg-orange-700 text-white py-3 px-6 rounded-full font-bold hover:bg-orange-500 transition">
            Ver mis pedidos
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400"
            alt="Dashboard Illustration"
            className="w-full"
          />
        </div>
      </main>

      
      {/* Sección de Ayuda */}
<section className="bg-gray-100 dark:bg-gray-800 py-10 px-6">
  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">¿Necesitas Ayuda?</h2>
  
  <div className="max-w-4xl mx-auto space-y-4">
    {faqData.map((faq, index) => (
      <div key={index} className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-700">
        <button
          className="w-full text-left flex justify-between items-center font-semibold text-gray-800 dark:text-white"
          onClick={() => toggleFaq(index)}
        >
          {faq.question}
          <span>{activeFaq === index ? "▲" : "▼"}</span>
        </button>
        {activeFaq === index && <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>}
      </div>
    ))}
  </div>
</section>

{/* Sección de Contáctanos */}
<section className="bg-white dark:bg-gray-900 py-10 px-6">
  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">📞 Contáctanos</h2>

  <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8">
    {/* Teléfono */}
    <div className="flex items-center space-x-3">
      <i className="fas fa-phone text-2xl text-orange-600"></i>
      <span className="text-gray-800 dark:text-white font-semibold">+52 987 654 3210</span>
    </div>

    {/* Correo Electrónico */}
    <div className="flex items-center space-x-3">
      <i className="fas fa-envelope text-2xl text-orange-600"></i>
      <span className="text-gray-800 dark:text-white font-semibold">contacto@tuempresa.com</span>
    </div>

    {/* WhatsApp */}
    <div className="flex items-center space-x-3">
      <i className="fab fa-whatsapp text-2xl text-green-500"></i>
      <a
        href="https://wa.me/5219876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 dark:text-white font-semibold hover:text-orange-600 transition"
      >
        WhatsApp
      </a>
    </div>
  </div>
</section>
<Footer/>
    </div>
  );
};

export default ClientPage;

