import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import { getEmpresaProfile, updateEmpresaProfile } from "../api/auth";
import { getRedesSociales, createRedSocial, updateRedSocial, deleteRedSocial } from "../api/auth";

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

  const [redes, setRedes] = useState([]);
  const [newRed, setNewRed] = useState({ nombre: "", link: "" });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // 🚀 Cargar datos de empresa y redes sociales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empresaResponse = await getEmpresaProfile();
        if (empresaResponse.data) {
          setEmpresa(empresaResponse.data);
          setLogoPreview(empresaResponse.data.Logo);
        }

        const redesResponse = await getRedesSociales();
        if (redesResponse.data) {
          setRedes(redesResponse.data);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 Manejar cambios en los campos de empresa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({ ...prevEmpresa, [name]: value }));
  };

  // 🔹 Manejar selección de imagen
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

  // 🔹 Guardar cambios de empresa
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

  // 🔹 Agregar una nueva red social
  const handleCreateRed = async () => {
    if (!newRed.nombre || !newRed.link) {
      setModalError("El nombre y el enlace son obligatorios.");
      return;
    }

    try {
      const response = await createRedSocial({ ...newRed, ID_empresa: empresa.ID_empresa });
      setRedes([...redes, response.data.nuevaRed]);
      setNewRed({ nombre: "", link: "" });
    } catch (error) {
      console.error("Error al crear red social:", error);
    }
  };

  // 🔹 Eliminar una red social
  const handleDeleteRed = async (id) => {
    try {
      await deleteRedSocial(id);
      setRedes(redes.filter((red) => red.id !== id));
    } catch (error) {
      console.error("Error al eliminar red social:", error);
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
            <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full px-3 py-2 border rounded" />
            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 object-cover rounded-full mt-2" />}
          </div>

          {/* Datos de la Empresa */}
          {["Nombre", "Eslogan", "Mision", "Vision","Horario", "Direccion"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">{field}</label>
              <input
                type="text"
                name={field}
                value={empresa[field]}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}

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



          {/* Agregar Nueva Red Social */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Agregar Nueva Red Social</h3>
            <input
              type="text"
              placeholder="Nombre de la red"
              value={newRed.nombre}
              onChange={(e) => setNewRed({ ...newRed, nombre: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="URL"
              value={newRed.link}
              onChange={(e) => setNewRed({ ...newRed, link: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <button onClick={handleCreateRed} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Agregar
            </button>
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

      {/* Modal de error */}
      {modalError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-red-500 font-bold mb-4">{modalError}</p>
            <button onClick={() => setModalError("")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaPage;
