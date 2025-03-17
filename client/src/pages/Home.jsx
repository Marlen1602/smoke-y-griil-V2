import React, { useState,useEffect } from 'react';
import Header from './PrincipalNavBar'; // Importa el componente Header
import Footer from './Footer.jsx';
import AuthModal from './AuthModal'; // Importa el modal
import {getPreguntasRequest} from '../api/auth.js';
import Breadcrumbs from "../pages/Breadcrumbs";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [activeFaq, setActiveFaq] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [images, setImages] = useState([]);

   // 🔹 Función para obtener preguntas desde la API
   const fetchPreguntas = async () => {
    try {
      const response = await getPreguntasRequest(); // Llamamos a la función desde api.jsx
      setPreguntas(response.data);
    } catch (error) {
      console.error("Error al obtener preguntas frecuentes:", error);
    }
  };

  // Cargar preguntas al cargar la página
  useEffect(() => {
    fetchPreguntas();
  }, []);

  // 🔹 Mostrar u ocultar respuestas
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };


  const handleLoginClick = () => {
    setShowModal(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };
    
  // Cargar imágenes correctamente con `new URL()`
  useEffect(() => {
    try {
      const alitas = new URL("../assets/Alitas.jpg", import.meta.url).href;
      const baguette = new URL("../assets/Baguette.jpg", import.meta.url).href;
      const burguer = new URL("../assets/burguer.jpg", import.meta.url).href;
      const chilaquiles = new URL("../assets/Chilaquiles.jpg", import.meta.url).href;
      const imagen = new URL("../assets/image.png", import.meta.url).href;

      setImages([alitas, baguette, burguer, chilaquiles, imagen]);
      setImagesLoaded(true);
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    }
  }, []);

  // 🔄 Cambiar imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Limpieza del intervalo
  }, [images]);


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
      <main className="flex flex-col md:flex-row items-center justify-center p-6 md:p-2 space-y-8 md:space-y-0">
        
 {/* 🔥 Carrusel de imágenes */}
 <section className="max-w-5xl py-0 px-8 relative">
        {imagesLoaded && images.length > 0 ? (
          <div className="relative w-[700px] h-[500px] mx-auto overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex]}
              alt={`slide-${currentIndex}`}
              className="w-full h-full object-cover"
            />
            {/* Botón Anterior */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
              onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {/* Botón Siguiente */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
              onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Cargando imágenes...</p>
        )}
      </section>

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
     {/* 🔹 Sección de Preguntas Frecuentes */}
     <section className="bg-gray-100 dark:bg-gray-800 py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          ¿Necesitas Ayuda?
        </h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {preguntas.length > 0 ? (
            preguntas.map((faq, index) => (
              <div
                key={faq.id}
                className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-700"
              >
                <button
                  className="w-full text-left flex justify-between items-center font-semibold text-gray-800 dark:text-white"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.pregunta}
                  <span>{activeFaq === index ? "▲" : "▼"}</span>
                </button>
                {activeFaq === index && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.respuesta}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Cargando preguntas...</p>
          )}
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
    <Footer />
    </div>
  );
};

export default Home;

