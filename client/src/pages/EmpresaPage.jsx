import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import { getEmpresaProfile, updateEmpresaProfile } from "../api/auth";

const EmpresaPage = () => {
  const [empresa, setEmpresa] = useState({
    title: "",
    slogan: "",
    logo: "",
    socialLinks: [],
  });

  const [newSocialLink, setNewSocialLink] = useState({ name: "", url: "" });
  const [logoPreview, setLogoPreview] = useState(null); // Vista previa del logo
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null); // Índice para la confirmación de eliminación

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await getEmpresaProfile();
        setEmpresa({
          ...response.data,
          socialLinks: response.data.socialLinks || [],
        });
        setLogoPreview(response.data.logo); // Establecemos la vista previa si ya hay logo
      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error);
      }
    };

    fetchEmpresaData();
  }, []);

  // Validaciones
  const validateTitle = (title) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(title);
  const validateSlogan = (slogan) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(slogan);
  const validateSocialName = (name) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(name);
  const validateUrl = (url) => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9#?&=_.-]*)?$/.test(url);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, [name]: value }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedSocialLinks = empresa.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, socialLinks: updatedSocialLinks }));
  };

  const handleAddSocialLink = async () => {
    if (!newSocialLink.name || !newSocialLink.url) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    if (!validateSocialName(newSocialLink.name)) {
      alert("El nombre de la red social solo puede contener letras y espacios.");
      return;
    }

    if (!validateUrl(newSocialLink.url)) {
      alert("Por favor, ingresa una URL válida.");
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

    // Validación de los campos
    if (!validateTitle(empresa.title)) {
      setFormErrors({ ...formErrors, title: "El título solo puede contener letras y espacios." });
      setIsLoading(false);
      return;
    } else {
      setFormErrors({ ...formErrors, title: "" });
    }

    if (!validateSlogan(empresa.slogan)) {
      setFormErrors({ ...formErrors, slogan: "El slogan solo puede contener letras y espacios." });
      setIsLoading(false);
      return;
    } else {
      setFormErrors({ ...formErrors, slogan: "" });
    }

    try {
      const response = await updateEmpresaProfile(empresa._id, empresa);
      if (response.status === 200) {
        alert("Cambios guardados correctamente");
        setEmpresa(response.data);
        setFormErrors({}); // Limpiar errores al guardar los cambios correctamente
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Ocurrió un error al guardar los cambios.");
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica para manejar la eliminación de redes sociales
  const handleDeleteSocialLink = (index) => {
    if (confirmDeleteIndex === index) {
      // Confirmar la eliminación
      const updatedSocialLinks = empresa.socialLinks.filter((_, i) => i !== index);
      setEmpresa({ ...empresa, socialLinks: updatedSocialLinks });
      setConfirmDeleteIndex(null); // Resetea la confirmación
    } else {
      // Activar confirmación
      setConfirmDeleteIndex(index);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteIndex(null); // Cancela la confirmación
  };

  // Detecta clics fuera de la confirmación de eliminación
  const handleClickOutside = (e) => {
    if (confirmDeleteIndex !== null && !e.target.closest(".confirm-delete")) {
      setConfirmDeleteIndex(null); // Resetea la confirmación si se hace clic fuera
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [confirmDeleteIndex]);

  // Función para manejar el cambio del logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result); // Actualizamos la vista previa
        setEmpresa((prevEmpresa) => ({ ...prevEmpresa, logo: file }));
      };
      reader.readAsDataURL(file); // Leemos el archivo como una URL de datos
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

          {/* Título */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Título</label>
            <input
              type="text"
              name="title"
              value={empresa.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.title ? "border-red" : ""
              }`}
            />
            {formErrors.title && <p className="text-red text-sm">{formErrors.title}</p>}
          </div>

          {/* Slogan */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Slogan</label>
            <input
              type="text"
              name="slogan"
              value={empresa.slogan}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.slogan ? "border-red" : ""
              }`}
            />
            {formErrors.slogan && <p className="text-red text-sm">{formErrors.slogan}</p>}
          </div>

          {/* Redes Sociales */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Redes Sociales</h2>
            {empresa.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-white">{link.name}</span>:{" "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400 ml-2"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`confirm-delete text-red hover:text-red ${
                      confirmDeleteIndex === index ? "text-red" : ""
                    }`}
                    onClick={() => handleDeleteSocialLink(index)}
                  >
                    {confirmDeleteIndex === index ? "Confirmar Eliminación" : "Eliminar"}
                  </button>
                  {confirmDeleteIndex === index && (
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleCancelDelete}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Nombre de la red social"
                value={newSocialLink.name}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="URL"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddSocialLink}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            className={`w-full py-3 text-white rounded ${isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
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





