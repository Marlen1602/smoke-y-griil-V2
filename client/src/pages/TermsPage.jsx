import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import {
  getTermsRequest,
  createTermsRequest,
  updateTermsRequest,
  deleteTermsRequest,
  getTermsHistoryRequest,
} from "../api/auth";

const TermsPage = () => {
  const [terms, setTerms] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newTerm, setNewTerm] = useState({ title: "", descripcion: "" });
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    const response = await getTermsRequest();
    setTerms(response.data);
  };

  const handleCreateTerm = async () => {
    if (!validateFields()) return;

   // Validar si ya existe un término con el mismo título o descripción
   const isDuplicate = terms.some(
    (term) =>
      term.title.toLowerCase() === newTerm.title.toLowerCase() ||
      term.descripcion.toLowerCase() === newTerm.descripcion.toLowerCase()
  );

  if (isDuplicate) {
    alert("Ya existe un término con el mismo título o descripción.");
    return;
  }

    try {
      const currentDate = new Date().toISOString();
      const termWithDate = {
        ...newTerm,
        fechaVigencia: currentDate,
      };

      const response = await createTermsRequest(termWithDate);
      setTerms([...terms, response.data]);
      setNewTerm({ title: "", descripcion: "" });
      alert("Término creado exitosamente.");
    } catch (error) {
      alert("Error al crear el término.");
    }
  };

  const handleUpdateTerm = async (id) => {
    if (!validateFields()) return;

    try {
      const currentDate = new Date().toISOString();
      const updatedTerm = {
        ...newTerm,
        fechaVigencia: currentDate,
      };

      const response = await updateTermsRequest(id, updatedTerm);
      setTerms(terms.map((term) => (term._id === id ? response.data : term)));
      setNewTerm({ title: "", descripcion: "" });
      setSelectedTermId(null);
      alert("Término actualizado exitosamente.");
    } catch (error) {
      alert("Error al actualizar el término.");
    }
  };

  const handleDeleteTerm = async () => {
    try {
      await deleteTermsRequest(termToDelete);
      fetchTerms();
      setShowConfirmation(false);
      alert("Término eliminado exitosamente.");
    } catch (error) {
      alert("Error al eliminar el término.");
    }
  };

  const validateFields = () => {
    const validTitleRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,:;"'()!?¿%–\-]+$/;

    if (!validTitleRegex.test(newTerm.title)) {
      alert(
        "El título solo puede contener letras, números, espacios, y caracteres válidos."
      );
      return false;
    }
    return true;
  };

  const fetchTermHistory = async (id) => {
    const response = await getTermsHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center mt-4">
        Gestión de Términos y Condiciones
      </h1>
      <div className="p-4 md:p-10">
        {/* Crear o editar término */}
        <div className="col-span-1 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedTermId ? "Editar Término" : "Crear Término"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Título:
              </label>
              <input
                type="text"
                placeholder="Título"
                value={newTerm.title}
                onChange={(e) =>
                  setNewTerm({ ...newTerm, title: e.target.value })
                }
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Descripción:
              </label>
              <textarea
                placeholder="Descripción"
                value={newTerm.descripcion}
                onChange={(e) =>
                  setNewTerm({ ...newTerm, descripcion: e.target.value })
                }
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            {selectedTermId ? (
              <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => handleUpdateTerm(selectedTermId)}
            >
              Actualizar
            </button>
            
            ) : (
              <button
              className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition ${terms.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCreateTerm}
              disabled={terms.length > 0}
            >
              Agregar
            </button>
            )}
          </div>
        </div>

        {/* Tabla de términos */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Fecha de Vigencia</th>
                <th className="py-2 px-4 border-b">Título</th>
                <th className="py-2 px-4 border-b">Descripción</th>
                <th className="py-2 px-4 border-b">Versión</th>
                <th className="py-2 px-4 border-b">Estado</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term._id}>
                  <td className="py-2 px-4 border-b">
                    {new Date(term.fechaVigencia).toLocaleDateString("es-ES", {
                      timeZone: "America/Mexico_City",
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">{term.title}</td>
                  <td className="py-2 px-4 border-b">{term.descripcion}</td>
                  <td className="py-2 px-4 border-b">{term.version}</td>
                  <td className="py-2 px-4 border-b">
                    {term.isDeleted ? "No vigente" : "Vigente"}
                  </td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => {
                        setNewTerm({
                          title: term.title,
                          descripcion: term.descripcion,
                          fechaVigencia: term.fechaVigencia,
                        });
                        setSelectedTermId(term._id);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => {
                        setTermToDelete(term._id);
                        setShowConfirmation(true);
                      }}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => fetchTermHistory(term._id)}
                    >
                      Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historial de versiones */}
        {showHistory && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Historial de versiones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Título</th>
                    <th className="py-2 px-4 border-b">Descripción</th>
                    <th className="py-2 px-4 border-b">Versión</th>
                    <th className="py-2 px-4 border-b">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2 px-4 border-b">{item.title}</td>
                      <td className="py-2 px-4 border-b">{item.descripcion}</td>
                      <td className="py-2 px-4 border-b">{item.version}</td>
                      <td className="py-2 px-4 border-b">
                        {item.isDeleted ? "No vigente" : "Vigente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="text-blue-500 mt-4 underline"
              onClick={() => setShowHistory(false)}
            >
              Cerrar historial
            </button>
          </div>
        )}

        {/* Modal de confirmación para eliminar */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="mb-4">¿Estás seguro de que quieres eliminar este término?</p>
              <button
                className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition mr-2"
                onClick={handleDeleteTerm}
              >
                Sí, eliminar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPage;



