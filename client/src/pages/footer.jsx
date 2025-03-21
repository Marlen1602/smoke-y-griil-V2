import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmpresaProfile } from "../api/auth";

const Footer = () => {
  const [empresa, setEmpresa] = useState({ Logo: "", RedesSociales: [] });

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile();
        setEmpresa(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de la empresa:", error);
      }
    };
    fetchEmpresaData();
  }, []);

  return (
    <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 w-full mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Logo */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          {empresa.Logo && <img src={empresa.Logo} alt="Logo" className="h-12 rounded-full" />}
        </div>

        {/* Enlaces */}
        <div className="w-full md:w-auto flex flex-col md:flex-row justify-around text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
          <ul className="space-y-2">
            <li><Link to="/mision" className="hover:text-orange-400">Misión</Link></li>
            <li><Link to="/quienes-somos" className="hover:text-orange-400">Quiénes Somos</Link></li>
            <li><Link to="/vision" className="hover:text-orange-400">Visión</Link></li>
          </ul>
          <ul className="space-y-2">
            <li><Link to="/terminos" className="hover:text-orange-400">Términos y Condiciones</Link></li>
            <li><Link to="/privacidad" className="hover:text-orange-400">Politicas de Privacidad</Link></li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
          {empresa.RedesSociales.map((red, index) => (
            <a key={index} href={red.link} target="_blank" rel="noopener noreferrer">
              <i className={`fab fa-${red.nombre.toLowerCase()} text-2xl hover:text-blue-400`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
