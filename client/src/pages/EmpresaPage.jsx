import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import { getEmpresaProfile, updateEmpresaProfile } from "../api/auth";

const EmpresaPage = () => {
  const [empresa, setEmpresa] = useState({
    title: "",
    slogan: "",
    logo: "",
    socialLinks: [], // Aseguramos que sea un arreglo vacío por defecto
  });

  const [newSocialLink, setNewSocialLink] = useState({ name: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile();
        setEmpresa({
          ...response.data,
          socialLinks: response.data.socialLinks || [], // Aseguramos que siempre sea un arreglo
        });
      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error);
      }
    };

    fetchEmpresaData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedSocialLinks = empresa.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setEmpresa({ ...empresa, socialLinks: updatedSocialLinks });
  };

  const handleAddSocialLink = async () => {
    if (!newSocialLink.name || !newSocialLink.url) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    const updatedSocialLinks = [...empresa.socialLinks, newSocialLink];
    const updatedData = { ...empresa, socialLinks: updatedSocialLinks };

    try {
      const response = await updateEmpresaProfile(empresa._id, updatedData);
      setEmpresa(response.data);
      setNewSocialLink({ name: "", url: "" }); // Limpiamos los campos
    } catch (error) {
      console.error("Error al agregar el enlace social:", error);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const response = await updateEmpresaProfile(empresa._id, empresa);
      if (response.status === 200) {
        alert("Cambios guardados correctamente");
        setEmpresa(response.data);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
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
          {/* Título */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Título</label>
            <input
              type="text"
              name="title"
              value={empresa.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Slogan */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Slogan</label>
            <input
              type="text"
              name="slogan"
              value={empresa.slogan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Logo */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Logo</label>
            <img src={empresa.logo} alt="Logo de la empresa" className="h-24 w-auto mb-4" />
            <input
              type="file"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEmpresa({ ...empresa, logo: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Redes Sociales */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-4">Redes Sociales</h3>
            {empresa.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-wrap items-center mb-2">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "name", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded mr-2 mb-2 md:mb-0 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "url", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded mr-2 mb-2 md:mb-0 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => {
                    const updatedSocialLinks = empresa.socialLinks.filter(
                      (_, i) => i !== index
                    );
                    setEmpresa({ ...empresa, socialLinks: updatedSocialLinks });
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className="flex flex-wrap items-center mt-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newSocialLink.name}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
                className="flex-1 px-3 py-2 border rounded mr-2 mb-2 md:mb-0 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="url"
                placeholder="URL"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                className="flex-1 px-3 py-2 border rounded mr-2 mb-2 md:mb-0 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={handleAddSocialLink}
              >
                Agregar
              </button>
            </div>
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
    </div>
  );
};

export default EmpresaPage;





