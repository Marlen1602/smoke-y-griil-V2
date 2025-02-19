import React, { useState } from 'react';
import Header from './PrincipalNavBar'; // Importa el componente Header
import imagen from '../assets/image.png';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal'; // Importa el modal
import Breadcrumbs from "../pages/Breadcrumbs";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // Control del modal

  const [activeFaq, setActiveFaq] = useState(null);

const faqData = [
  { question: "¿Cómo hago un pedido?", answer: "Solo navega por nuestro menú, selecciona los platillos y agrégalos al carrito. Luego, finaliza la compra con tu método de pago favorito." },
  { question: "¿Cuánto tarda la entrega?", answer: "El tiempo de entrega varía según la zona, pero generalmente es de 30 a 45 minutos." },
  { question: "¿Puedo pagar en efectivo?", answer: "Sí, aceptamos pagos en efectivo, tarjeta y transferencias bancarias." },
  ];

const toggleFaq = (index) => {
  setActiveFaq(activeFaq === index ? null : index);
};


  const handleLoginClick = () => {
    setShowModal(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  return (
    <div className={`bg-white dark:bg-gray-900 dark:text-white min-h-screen`}>
      {/* Header */}
      <Header />
       {/* Breadcrumbs en la parte blanca */}
  <div className="bg-white py-3 px-8  rounded-md flex items-center">
    <Breadcrumbs />
  </div>
      {/* Modal de autenticación */}
      {showModal && <AuthModal onClose={handleCloseModal} />}

      {/* Sección principal */}
      <main className="flex flex-col md:flex-row items-center justify-center p-6 md:p-16 space-y-8 md:space-y-0">
        <div className="md:w-1/2">
          <img src={imagen} alt="imagen" className="w-3/4 mx-auto md:w-full" />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            ¡Disfruta de envío gratis!
          </h1>
          <p className="text-lg text-gray-800 dark:text-gray-300 mb-4">
            Para todos tus platillos favoritos
          </p>
          <button
            className="bg-orange-600 text-white w-full md:w-80 h-12 py-3 px-6 rounded-full font-bold hover:bg-orange-700 transition"
            onClick={handleLoginClick} // Llama a la función para abrir el modal
          >
            ¡Pide ahora!
          </button>
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
      <span className="text-gray-800 dark:text-white font-semibold">+52 1 771 568 5117</span>
    </div>

    {/* Correo Electrónico */}
    <div className="flex items-center space-x-3">
      <i className="fas fa-envelope text-2xl text-orange-600"></i>
      <span className="text-gray-800 dark:text-white font-semibold">SmokeyGrill@gmail.com</span>
    </div>

    {/* WhatsApp */}
    <div className="flex items-center space-x-3">
      <i className="fab fa-whatsapp text-2xl text-green-500"></i>
      <a
        href="https://wa.me/5217715685117"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 dark:text-white font-semibold hover:text-orange-600 transition"
      >
        WhatsApp
      </a>
    </div>
  </div>
</section>


        {/* Footer */}
            <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 mt-10">
              <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
                {/* Logo */}
                <div className="w-full md:w-auto flex justify-center md:justify-start">
                  <img src={logo} alt="Logo" className="h-12" />
                </div>
      
                {/* Enlaces */}
                <div className="w-full md:w-auto flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-8">
                  <ul className="space-y-2 text-center md:text-left">
                    <li>Misión</li>
                    <li>Quiénes Somos</li>
                    <li>Visión</li>
                    
                  </ul>
                  <ul className="space-y-2 text-center md:text-left">
                    
                    <li>Términos y Condiciones</li>
                    <li>Aviso de Privacidad</li>
                  </ul>
                </div>
      
                {/* Redes Sociales */}
                <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
                  <i className="fab fa-facebook text-2xl"></i>
                  <i className="fab fa-instagram text-2xl"></i>
                  <i className="fab fa-tiktok text-2xl"></i>
                </div>
              </div>
            </footer>
    </div>
  );
};

export default Home;

