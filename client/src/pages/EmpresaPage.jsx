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
  const [modalError, setModalError] = useState(""); // Estado para el mensaje del modal
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null); // Para confirmar eliminación

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
  const validateTitle = (title) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(title.trim());
  const validateSlogan = (slogan) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(slogan.trim());
  const validateSocialName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());
  const validateUrl = (url) =>
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9#?&=_.-]*)?$/.test(
      url.trim()
    );
  const validateDomainMatch = (name, url) => {
    const domainMap = {
      facebook: "facebook.com",
      instagram: "instagram.com",
      twitter: "twitter.com",
    };
    const expectedDomain = domainMap[name.toLowerCase()];
    return expectedDomain && url.includes(expectedDomain);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, [name]: value }));
  };

  const handleAddSocialLink = () => {
    const { name, url } = newSocialLink;

    if (!name || !url) {
      setModalError("Por favor, completa ambos campos.");
      return;
    }

    if (!validateSocialName(name)) {
      setModalError("El nombre de la red sial solo puede contener letras y espacios.");
      return;
    }

    if (!validateUrl(url)) {
      setModalError("Por favor, ingresa una URL válida.");
      return;
    }

    if (!validateDomainMatch(name, url)) {
      setModalError(
        `La URL no coincide con el dominio esperado para ${name}. Por ejemplo, use ${
          name.toLowerCase() === "facebook"
            ? "https://facebook.com/..."
            : "https://instagram.com/..."
        }.`
      );
      return;
    }

    if (empresa.socialLinks.some((link) => link.name === name || link.url === url)) {
      setModalError("No se puede agregar un nombre o URL duplicada.");
      return;
    }

    const updatedSocialLinks = [...empresa.socialLinks, { name, url }];
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, socialLinks: updatedSocialLinks }));
    setNewSocialLink({ name: "", url: "" });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setModalError(""); // Limpiar cualquier error anterior

    if (!validateTitle(empresa.title)) {
      setModalError("El campo Título solo puede contener letras y espacios.");
      setIsLoading(false);
      return;
    }

    if (!validateSlogan(empresa.slogan)) {
      setModalError("El campo Slogan solo puede contener letras y espacios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateEmpresaProfile(empresa._id, empresa);
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

  const handleDeleteSocialLink = (index) => {
    setConfirmDeleteIndex(index); // Mostrar modal de confirmación
  };

  const confirmDeleteSocialLink = () => {
    if (confirmDeleteIndex !== null) {
      const updatedSocialLinks = empresa.socialLinks.filter((_, i) => i !== confirmDeleteIndex);
      setEmpresa((prevEmpresa) => ({ ...prevEmpresa, socialLinks: updatedSocialLinks }));
      setConfirmDeleteIndex(null); // Ocultar modal de confirmación
    }
  };

  const cancelDeleteSocialLink = () => {
    setConfirmDeleteIndex(null); // Ocultar modal de confirmación sin eliminar
  };

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

          {/* Red sociales */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Red sociales</h2>
            {empresa.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between mb-3">
                <span>{link.name}: {link.url}</span>
                <button
                  className="bg-red text-white px-2 py-1 rounded hover:bg-red"
                  onClick={() => handleDeleteSocialLink(index)}
                >
                  Eliminar
                </button>
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

      {/* Modal Confirmar Eliminación */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg text-center">
            <p className="text-red st-bold mb-4">¿Estás seguro de eliminar esta red sial?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteSocialLink}
                className="bg-red st-white px-4 py-2 rounded hover:bg-red s"
              >
                Confirmar
              </button>
              <button
                onClick={cancelDeleteSocialLink}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaPage;





