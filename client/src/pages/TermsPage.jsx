import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import {
  getTermsRequest,
  createTermsRequest,
  updateTermsRequest,
  deleteTermsRequest,
  getTermsHistoryRequest
} from '../api/auth';

const TermsPage = () => {
  const [terms, setTerms] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newTerm, setNewTerm] = useState({ title: '', descripcion: '', fechaVigencia: '' });
  const [selectedTermId, setSelectedTermId] = useState(null);

  useEffect(() => { fetchTerms(); }, []);

  const fetchTerms = async () => {
    const response = await getTermsRequest();
    setTerms(response.data);
  };

  const handleCreateTerm = async () => {
    const response = await createTermsRequest(newTerm);
    setTerms([...terms, response.data]);
    setNewTerm({ title: '', descripcion: '', fechaVigencia: '' });
  };

  const handleUpdateTerm = async (id) => {
    const response = await updateTermsRequest(id, newTerm);
    setTerms(terms.map(term => (term._id === id ? response.data : term)));
    setNewTerm({ title: '', descripcion: '', fechaVigencia: '' });
    setSelectedTermId(null);
  };

  const handleDeleteTerm = async (id) => {
    await deleteTermsRequest(id);
    fetchTerms();
  };

  const fetchTermHistory = async (id) => {
    const response = await getTermsHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <AdminNavBar />
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Términos y Condiciones</h1>
      <div className="p-10">
      <div className="flex items-center space-x-2 mb-4">
        <label className="font-bold text-gray-700">Título:</label>
        <input type="text" placeholder="Título" value={newTerm.title}
          onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })} className="border px-2 py-1 mr-2" />
        <label className="font-bold text-gray-700">Descripción:</label>
        <input type="text" placeholder="Descripción" value={newTerm.descripcion}
          onChange={(e) => setNewTerm({ ...newTerm, descripcion: e.target.value })} className="border px-2 py-1 mr-2" />
        <label className="font-bold text-gray-700">Fecha de Vigencia:</label>
        <input type="date" placeholder="Fecha de Vigencia" value={newTerm.fechaVigencia}
          onChange={(e) => setNewTerm({ ...newTerm, fechaVigencia: e.target.value })} className="border px-2 py-1 mr-2" />
        {selectedTermId ? (
          <button onClick={() => handleUpdateTerm(selectedTermId)} className="bg-green-500 text-white px-4 py-1 rounded">
            Actualizar
          </button>
        ) : (
          <button onClick={handleCreateTerm} className="bg-orange-500 text-white px-4 py-1 rounded">
            Agregar
          </button>
        )}
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Título</th>
            <th className="py-2 px-4 border-b">Descripción</th>
            <th className="py-2 px-4 border-b">Fecha de Vigencia</th>
            <th className="py-2 px-4 border-b">Versión</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {terms.map(term => (
            <tr key={term._id}>
              <td className="py-2 px-4 border-b">{term.title}</td>
              <td className="py-2 px-4 border-b">{term.descripcion}</td>
              <td className="py-2 px-4 border-b">{new Date(term.fechaVigencia).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{term.version}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => { setNewTerm({ title: term.title, descripcion: term.descripcion, fechaVigencia: term.fechaVigencia }); setSelectedTermId(term._id); }} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Editar
                </button>
                <button onClick={() => handleDeleteTerm(term._id)} className="bg-red text-white px-2 py-1 rounded  mr-2">
                  Eliminar
                </button>
                <button onClick={() => fetchTermHistory(term._id)} className="bg-gray-500 text-white px-2 py-1 rounded">
                  Historial
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showHistory && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Historial de versiones</h2>
          <table className="min-w-full bg-white border">
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
                  <td className="py-2 px-4 border-b">{item.isDeleted ? 'No vigente' : 'Vigente'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowHistory(false)} className="text-blue-500 mt-4">
            Cerrar historial
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default TermsPage;

