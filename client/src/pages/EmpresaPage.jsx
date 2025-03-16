import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import { getEmpresaProfile, updateEmpresaProfile } from "../api/auth";

const EmpresaPage = () => {
  const [empresa, setEmpresa] = useState({
    ID_empresa: "",
    Nombre: "",
    Eslogan: "",
    Mision: "",
    Vision: "",
    Direccion: "",
    Logo: "",
    RedesSociales: [],
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile();
        if (response.data) {
          setEmpresa(response.data);
          setLogoPreview(response.data.Logo); // Mostrar la imagen del logo si existe
        }
      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error);
      }
    };

    fetchEmpresaData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setEmpresa((prevEmpresa) => ({ ...prevEmpresa, Logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const response = await updateEmpresaProfile(empresa.ID_empresa, empresa);
      if (response.status === 200) {
        alert("Cambios guardados correctamente");
        setEmpresa(response.data);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Perfil de la Empresa</h1>
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded shadow-md">
          {/* Logo */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Nombre</label>
            <input
              type="text"
              name="Nombre"
              value={empresa.Nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Eslogan */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Eslogan</label>
            <input
              type="text"
              name="Eslogan"
              value={empresa.Eslogan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Misión */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Misión</label>
            <textarea
              name="Mision"
              value={empresa.Mision}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          {/* Visión */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Visión</label>
            <textarea
              name="Vision"
              value={empresa.Vision}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          {/* Dirección */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Dirección</label>
            <input
              type="text"
              name="Direccion"
              value={empresa.Direccion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Redes Sociales */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Redes Sociales</h2>
            {empresa.RedesSociales.length > 0 ? (
              empresa.RedesSociales.map((red, index) => (
                <div key={index} className="flex justify-between items-center border p-2 rounded-md mb-2">
                  <span className="font-semibold">{red.nombre}</span>
                  <a href={red.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {red.link}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay redes sociales registradas.</p>
            )}
          </div>

          {/* Botón Guardar */}
          <button
            className={`w-full py-3 text-white rounded ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Modal de error */}
      {modalError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg text-center">
            <p className="text-red font-bold mb-4">{modalError}</p>
            <button
              onClick={() => setModalError("")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaPage;
