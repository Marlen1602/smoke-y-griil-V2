import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import {
  getDeslindeLegalRequest,
  createDeslindeLegalRequest,
  updateDeslindeLegalRequest,
  deleteDeslindeLegalRequest,
  getDeslindeLegalHistoryRequest,
} from "../api/auth";

const DeslindeLegalPage = () => {
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    descripcion: "",
    fechaVigencia: "",
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const response = await getDeslindeLegalRequest();
    setDocuments(response.data);
  };

  const handleCreateDocument = async () => {
    if (!validateFields()) return;
  
    // Validar si ya existe un documento con el mismo título o descripción
    const isDuplicate = documents.some(
      (doc) =>
        doc.title.toLowerCase() === newDocument.title.toLowerCase() ||
        doc.descripcion.toLowerCase() === newDocument.descripcion.toLowerCase()
    );
  
    if (isDuplicate) {
      alert("Ya existe un documento con el mismo título o descripción.");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      const documentWithDate = {
        ...newDocument,
        fechaVigencia: currentDate,
      };

      const response = await createDeslindeLegalRequest(documentWithDate);
      setDocuments([...documents, response.data]);
      setNewDocument({ title: "", descripcion: "", fechaVigencia: "" });
      alert("Documento creado exitosamente.");
    } catch (error) {
      alert("Error al crear el documento.");
    }
  };

  const handleUpdateDocument = async (id) => {
    if (!validateFields()) return;

    try {
      const currentDate = new Date().toISOString();
      const updatedDocument = {
        ...newDocument,
        fechaVigencia: currentDate,
      };

      const response = await updateDeslindeLegalRequest(id, updatedDocument);
      setDocuments(
        documents.map((doc) =>
          doc._id === id ? response.data : doc
        )
      );
      setNewDocument({ title: "", descripcion: "", fechaVigencia: "" });
      setSelectedDocumentId(null);
      alert("Documento actualizado exitosamente.");
    } catch (error) {
      alert("Error al actualizar el documento.");
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await deleteDeslindeLegalRequest(documentToDelete);
      fetchDocuments();
      setShowConfirmation(false);
      alert("Documento eliminado exitosamente.");
    } catch (error) {
      alert("Error al eliminar el documento.");
    }
  };

  const validateFields = () => {
    const validTextRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,:;"'()!?¿%–\-]+$/;

    if (!validTextRegex.test(newDocument.title) || !validTextRegex.test(newDocument.descripcion)) {
      alert("El título y la descripción solo pueden contener letras, números, espacios y caracteres válidos.");
      return false;
    }
    return true;
  };

  const fetchDocumentHistory = async (id) => {
    const response = await getDeslindeLegalHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center mt-4">Gestión de Deslinde Legal</h1>
      <div className="p-4 md:p-10">
        {/* Crear o editar documento */}
        <div className="col-span-1 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedDocumentId ? "Editar Documento" : "Crear Documento"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Título:</label>
              <input
                type="text"
                placeholder="Título"
                value={newDocument.title}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Descripción:</label>
              <textarea
                placeholder="Descripción"
                value={newDocument.descripcion}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, descripcion: e.target.value })
                }
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            {selectedDocumentId ? (
              <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => handleUpdateDocument(selectedDocumentId)}
            >
              Actualizar
            </button>
            
            ) : (
              <button
              className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition ${documents.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCreateDocument}
              disabled={documents.length > 0}
            >
              Agregar
            </button>

            )}
          </div>
        </div>

        {/* Tabla de documentos */}
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
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className="py-2 px-4 border-b">{new Date(doc.fechaVigencia).toLocaleDateString("es-ES")}</td>
                  <td className="py-2 px-4 border-b">{doc.title}</td>
                  <td className="py-2 px-4 border-b">{doc.descripcion}</td>
                  <td className="py-2 px-4 border-b">{doc.version}</td>
                  <td className="py-2 px-4 border-b">{doc.isDeleted ? "No vigente" : "Vigente"}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => {
                        setNewDocument({
                          title: doc.title,
                          descripcion: doc.descripcion,
                          fechaVigencia: doc.fechaVigencia,
                        });
                        setSelectedDocumentId(doc._id);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => {
                        setDocumentToDelete(doc._id);
                        setShowConfirmation(true);
                      }}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => fetchDocumentHistory(doc._id)}
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
              <p className="mb-4">¿Estás seguro de que quieres eliminar este documento?</p>
              <button
                className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition mr-2"
                onClick={handleDeleteDocument}
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

export default DeslindeLegalPage;
