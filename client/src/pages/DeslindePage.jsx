import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import {
  getDeslindeLegalRequest,
  createDeslindeLegalRequest,
  updateDeslindeLegalRequest,
  deleteDeslindeLegalRequest,
  getDeslindeLegalHistoryRequest,
} from '../api/auth';

const DeslindeLegalPage = () => {
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', descripcion: '', fechaVigencia: '' });
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Expresión regular para validar los campos
  const validPattern = /^[a-zA-Z0-9\s,.-áéíóúÁÉÍÓÚñÑ]*$/;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const response = await getDeslindeLegalRequest();
    setDocuments(response.data);
  };

  const handleCreateDoc = async () => {
    // Validación del formulario
    if (!newDoc.title || !newDoc.descripcion || !newDoc.fechaVigencia) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    // Validación de caracteres permitidos
    if (!validPattern.test(newDoc.title) || !validPattern.test(newDoc.descripcion)) {
      setErrorMessage('El título y la descripción solo pueden contener letras, números, espacios, comas, puntos y caracteres especiales válidos como ñ y acentos.');
      return;
    }

    const response = await createDeslindeLegalRequest(newDoc);
    setDocuments([...documents, response.data]);
    setNewDoc({ title: '', descripcion: '', fechaVigencia: '' });
    setErrorMessage('');
  };

  const handleUpdateDoc = async (id) => {
    // Validación del formulario
    if (!newDoc.title || !newDoc.descripcion || !newDoc.fechaVigencia) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    // Validación de caracteres permitidos
    if (!validPattern.test(newDoc.title) || !validPattern.test(newDoc.descripcion)) {
      setErrorMessage('El título y la descripción solo pueden contener letras, números, espacios, comas, puntos y caracteres especiales válidos como ñ y acentos.');
      return;
    }

    const response = await updateDeslindeLegalRequest(id, newDoc);
    setDocuments(documents.map((doc) => (doc._id === id ? response.data : doc)));
    setNewDoc({ title: '', descripcion: '', fechaVigencia: '' });
    setSelectedDocId(null);
    setErrorMessage('');
  };

  const handleDeleteDoc = async () => {
    if (docToDelete) {
      await deleteDeslindeLegalRequest(docToDelete);
      fetchDocuments();
      setShowModal(false);
    }
  };

  const fetchDocHistory = async (id) => {
    const response = await getDeslindeLegalHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen font-sans">
      <AdminNavBar />
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Deslinde Legal</h1>
      <div className="p-4 sm:p-10">
        {/* Formulario */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full sm:w-auto flex flex-col">
            <label className="font-bold text-gray-700 dark:text-gray-300 mb-1">Título:</label>
            <input
              type="text"
              placeholder="Título"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="border dark:border-gray-700 px-3 py-2 w-full rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="w-full sm:w-auto flex flex-col">
            <label className="font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción:</label>
            <input
              type="text"
              placeholder="Descripción"
              value={newDoc.descripcion}
              onChange={(e) => setNewDoc({ ...newDoc, descripcion: e.target.value })}
              className="border dark:border-gray-700 px-3 py-2 w-full rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="w-full sm:w-auto flex flex-col">
            <label className="font-bold text-gray-700 dark:text-gray-300 mb-1">Fecha de Vigencia:</label>
            <input
              type="date"
              placeholder="Fecha de Vigencia"
              value={newDoc.fechaVigencia}
              onChange={(e) => setNewDoc({ ...newDoc, fechaVigencia: e.target.value })}
              className="border dark:border-gray-700 px-3 py-2 w-full rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="w-full sm:w-auto flex items-end">
            {selectedDocId ? (
              <button
                onClick={() => handleUpdateDoc(selectedDocId)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Actualizar
              </button>
            ) : (
              <button
                onClick={handleCreateDoc}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Agregar
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red mb-4">{errorMessage}</p>}

        {/* Tabla de Documentos */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Título</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Descripción</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Fecha de Vigencia</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Versión</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{doc.title}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{doc.descripcion}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {new Date(doc.fechaVigencia).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{doc.version}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 space-y-2">
                    <button
                      onClick={() => {
                        setNewDoc({
                          title: doc.title,
                          descripcion: doc.descripcion,
                          fechaVigencia: doc.fechaVigencia,
                        });
                        setSelectedDocId(doc._id);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded block"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setDocToDelete(doc._id);
                        setShowModal(true);
                      }}
                      className="bg-red hover:bg-red text-white px-3 py-1 rounded block"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => fetchDocHistory(doc._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Ver Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">¿Estás seguro de que deseas eliminar este documento?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDoc}
                className="bg-red hover:bg-red text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historial de cambios */}
      {showHistory && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Historial de versiones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Título</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Descripción</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Versión</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{item.title}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{item.descripcion}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{item.version}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">
                        {item.isDeleted ? 'No vigente' : 'Vigente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-blue-500 mt-4 underline"
            >
              Cerrar historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeslindeLegalPage;





