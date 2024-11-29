import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import {
  getTermsRequest,
  createTermsRequest,
  updateTermsRequest,
  deleteTermsRequest,
  getTermsHistoryRequest,
} from '../api/auth';

const TermsPage = () => {
  const [terms, setTerms] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newTerm, setNewTerm] = useState({ title: '', descripcion: '', fechaVigencia: '' });
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [errors, setErrors] = useState({ title: '', descripcion: '', fechaVigencia: '' });
  const [showModal, setShowModal] = useState(false);  // Estado para controlar la visibilidad del modal
  const [termToDelete, setTermToDelete] = useState(null); // Termino que se quiere eliminar

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    const response = await getTermsRequest();
    setTerms(response.data);
  };

  const handleCreateTerm = async () => {
    const validationErrors = validateForm(newTerm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const response = await createTermsRequest(newTerm);
    setTerms([...terms, response.data]);
    setNewTerm({ title: '', descripcion: '', fechaVigencia: '' });
    setErrors({ title: '', descripcion: '', fechaVigencia: '' });
  };

  const handleUpdateTerm = async (id) => {
    const validationErrors = validateForm(newTerm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const response = await updateTermsRequest(id, newTerm);
    setTerms(terms.map((term) => (term._id === id ? response.data : term)));
    setNewTerm({ title: '', descripcion: '', fechaVigencia: '' });
    setErrors({ title: '', descripcion: '', fechaVigencia: '' });
    setSelectedTermId(null);
  };

  const handleDeleteTerm = async () => {
    if (termToDelete) {
      await deleteTermsRequest(termToDelete);
      fetchTerms();
      setShowModal(false);  // Cerrar el modal después de la eliminación
    }
  };

  const fetchTermHistory = async (id) => {
    const response = await getTermsHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  const validateForm = (term) => {
    let validationErrors = {};

    // Validar título (solo letras, números, espacios, acentos, y la letra ñ)
    const titleRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!titleRegex.test(term.title)) {
      validationErrors.title = 'El título solo puede contener letras, números y espacios.';
    }

    // Validar descripción (similar al título)
    const descripcionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!descripcionRegex.test(term.descripcion)) {
      validationErrors.descripcion = 'La descripción solo puede contener letras, números y espacios.';
    }

    // Validar fecha de vigencia (no puede ser en el pasado)
    const today = new Date();
    const vigenciaDate = new Date(term.fechaVigencia);
    if (vigenciaDate < today) {
      validationErrors.fechaVigencia = 'La fecha de vigencia no puede ser en el pasado.';
    }

    return validationErrors;
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen font-sans">
      <AdminNavBar />
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Términos y Condiciones</h1>
      <div className="p-6">
        {/* Formulario */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-bold text-gray-700 dark:text-gray-300">Título:</label>
            <input
              type="text"
              placeholder="Título"
              value={newTerm.title}
              onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })}
              className="border px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded"
            />
            {errors.title && <span className="text-red text-sm">{errors.title}</span>}
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-bold text-gray-700 dark:text-gray-300">Descripción:</label>
            <input
              type="text"
              placeholder="Descripción"
              value={newTerm.descripcion}
              onChange={(e) => setNewTerm({ ...newTerm, descripcion: e.target.value })}
              className="border px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded"
            />
            {errors.descripcion && <span className="text-red text-sm">{errors.descripcion}</span>}
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-bold text-gray-700 dark:text-gray-300">Fecha de Vigencia:</label>
            <input
              type="date"
              placeholder="Fecha de Vigencia"
              value={newTerm.fechaVigencia}
              onChange={(e) => setNewTerm({ ...newTerm, fechaVigencia: e.target.value })}
              className="border px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded"
            />
            {errors.fechaVigencia && <span className="text-red text-sm">{errors.fechaVigencia}</span>}
          </div>
          <div>
            {selectedTermId ? (
              <button
                onClick={() => handleUpdateTerm(selectedTermId)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Actualizar
              </button>
            ) : (
              <button
                onClick={handleCreateTerm}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Agregar
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border dark:bg-gray-800 dark:border-gray-600">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700">Título</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Descripción</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Fecha de Vigencia</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Versión</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term._id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{term.title}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{term.descripcion}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {new Date(term.fechaVigencia).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{term.version}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 space-y-2">
                    <button
                      onClick={() => {
                        setNewTerm({
                          title: term.title,
                          descripcion: term.descripcion,
                          fechaVigencia: term.fechaVigencia,
                        });
                        setSelectedTermId(term._id);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition block"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => { 
                        setTermToDelete(term._id); 
                        setShowModal(true); 
                      }}
                      className="bg-red text-white px-3 py-1 rounded hover:bg-red transition block"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => fetchTermHistory(term._id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition block"
                    >
                      Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Confirmación */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">¿Estás seguro de eliminar este término?</h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteTerm}
                  className="bg-red text-white px-4 py-2 rounded hover:bg-red"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        {showHistory && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Historial de versiones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border dark:bg-gray-800 dark:border-gray-600">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-700">Título</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700">Descripción</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700">Versión</th>
                    <th className="py-2 px-4 border-b dark:border-gray-700">Estado</th>
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
        )}
      </div>
    </div>
  );
};

export default TermsPage;





