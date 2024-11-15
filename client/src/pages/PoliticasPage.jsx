import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import {
  getPoliciesRequest,
  createPolicyRequest,
  updatePolicyRequest,
  deletePolicyRequest,
  getPolicyHistoryRequest
} from '../api/auth';

const PoliticasPage = () => {
  const [policies, setPolicies] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ title: '', descripcion: '', fechaVigencia: '' });
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    const response = await getPoliciesRequest();
    setPolicies(response.data);
  };

  const handleCreatePolicy = async () => {
    const response = await createPolicyRequest(newPolicy);
    setPolicies([...policies, response.data]);
    setNewPolicy({ title: '', descripcion: '', fechaVigencia: '' });
  };

  const handleUpdatePolicy = async (id) => {
    const response = await updatePolicyRequest(id, newPolicy);
    setPolicies(policies.map(policy => (policy._id === id ? response.data : policy)));
    setNewPolicy({ title: '', descripcion: '', fechaVigencia: '' });
    setSelectedPolicyId(null);
  };

  const handleDeletePolicy = async (id) => {
    await deletePolicyRequest(id);
    fetchPolicies();
  };

  const fetchPolicyHistory = async (id) => {
    const response = await getPolicyHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
     <div className="bg-white min-h-screen font-sans">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center">Gestión de Políticas</h1>
    <div className="p-10">
      {/* Crear o editar política */}
      <div className="col-span-1 mb-6">
        <h2 className="text-2xl font-bold mb-4">{selectedPolicyId ? 'Editar Política' : 'Crear Política'}</h2>
        <div className="flex space-x-4 items-center">
          <label className="text-sm font-bold text-gray-700">Título:</label>
          <input
            type="text"
            placeholder="Título"
            value={newPolicy.title}
            onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
            className="border px-2 py-1"
          />
          
          <label className="text-sm font-bold text-gray-700">Descripción:</label>
          <input
            type="text"
            placeholder="Descripción"
            value={newPolicy.descripcion}
            onChange={(e) => setNewPolicy({ ...newPolicy, descripcion: e.target.value })}
            className="border px-2 py-1"
          />
          
          <label className="text-sm font-bold text-gray-700">Fecha de Vigencia:</label>
          <input
            type="date"
            value={newPolicy.fechaVigencia}
            onChange={(e) => setNewPolicy({ ...newPolicy, fechaVigencia: e.target.value })}
            className="border px-2 py-1"
          />
        </div>
        
        <div className="mt-4">
          {selectedPolicyId ? (
            <button
              className="bg-green-500 text-white px-4 py-1 rounded"
              onClick={() => handleUpdatePolicy(selectedPolicyId)}
            >
              Actualizar
            </button>
          ) : (
            <button
              className="bg-orange-500 text-white px-4 py-1 rounded"
              onClick={handleCreatePolicy}
            >
              Agregar
            </button>
          )}
        </div>
      </div>

      {/* Tabla de políticas vigentes */}
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
          {policies.map(policy => (
            <tr key={policy._id}>
              <td className="py-2 px-4 border-b">{policy.title}</td>
              <td className="py-2 px-4 border-b">{policy.descripcion}</td>
              <td className="py-2 px-4 border-b">{new Date(policy.fechaVigencia).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{policy.version}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => {
                    setNewPolicy({ title: policy.title, descripcion: policy.descripcion, fechaVigencia: policy.fechaVigencia });
                    setSelectedPolicyId(policy._id);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleDeletePolicy(policy._id)}
                >
                  Eliminar
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded "
                  onClick={() => fetchPolicyHistory(policy._id)}
                >
                  Historial
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Historial de versiones */}
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
          <button
            className="text-blue-500 mt-4"
            onClick={() => setShowHistory(false)}
          >
            Cerrar historial
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default PoliticasPage;


