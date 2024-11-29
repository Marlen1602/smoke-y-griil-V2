import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import {
  getPoliciesRequest,
  createPolicyRequest,
  updatePolicyRequest,
  deletePolicyRequest,
  getPolicyHistoryRequest,
} from "../api/auth";

const PoliticasPage = () => {
  const [policies, setPolicies] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ title: "", descripcion: "", fechaVigencia: "" });
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para el modal de confirmación
  const [policyToDelete, setPolicyToDelete] = useState(null); // Política que se va a eliminar

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const response = await getPoliciesRequest();
    setPolicies(response.data);
  };

  const handleCreatePolicy = async () => {
    if (!validateFields()) return; // Verifica los campos antes de crear una política

    const response = await createPolicyRequest(newPolicy);
    setPolicies([...policies, response.data]);
    setNewPolicy({ title: "", descripcion: "", fechaVigencia: "" });
  };

  const handleUpdatePolicy = async (id) => {
    if (!validateFields()) return; // Verifica los campos antes de actualizar una política

    const response = await updatePolicyRequest(id, newPolicy);
    setPolicies(policies.map((policy) => (policy._id === id ? response.data : policy)));
    setNewPolicy({ title: "", descripcion: "", fechaVigencia: "" });
    setSelectedPolicyId(null);
  };

  const handleDeletePolicy = async () => {
    await deletePolicyRequest(policyToDelete);
    fetchPolicies();
    setShowConfirmation(false); // Cierra el modal de confirmación
  };

  const validateFields = () => {
    const validTextRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/; // Permite letras, números, espacios, y ñ/acentos
    if (!validTextRegex.test(newPolicy.title) || !validTextRegex.test(newPolicy.descripcion)) {
      alert("El título y la descripción solo pueden contener letras, números, espacios, y acentos.");
      return false;
    }

    if (new Date(newPolicy.fechaVigencia) < new Date()) {
      alert("La fecha de vigencia no puede ser una fecha pasada.");
      return false;
    }

    return true;
  };

  const fetchPolicyHistory = async (id) => {
    const response = await getPolicyHistoryRequest(id);
    setHistory(response.data);
    setShowHistory(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center mt-4">Gestión de Políticas</h1>
      <div className="p-4 md:p-10">
        {/* Crear o editar política */}
        <div className="col-span-1 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedPolicyId ? "Editar Política" : "Crear Política"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Título:</label>
              <input
                type="text"
                placeholder="Título"
                value={newPolicy.title}
                onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Descripción:</label>
              <input
                type="text"
                placeholder="Descripción"
                value={newPolicy.descripcion}
                onChange={(e) => setNewPolicy({ ...newPolicy, descripcion: e.target.value })}
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Fecha de Vigencia:</label>
              <input
                type="date"
                value={newPolicy.fechaVigencia}
                onChange={(e) => setNewPolicy({ ...newPolicy, fechaVigencia: e.target.value })}
                className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            {selectedPolicyId ? (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => handleUpdatePolicy(selectedPolicyId)}
              >
                Actualizar
              </button>
            ) : (
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                onClick={handleCreatePolicy}
              >
                Agregar
              </button>
            )}
          </div>
        </div>

        {/* Tabla de políticas vigentes */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
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
              {policies.map((policy) => (
                <tr key={policy._id}>
                  <td className="py-2 px-4 border-b">{policy.title}</td>
                  <td className="py-2 px-4 border-b">{policy.descripcion}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(policy.fechaVigencia).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{policy.version}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => {
                        setNewPolicy({
                          title: policy.title,
                          descripcion: policy.descripcion,
                          fechaVigencia: policy.fechaVigencia,
                        });
                        setSelectedPolicyId(policy._id);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => {
                        setPolicyToDelete(policy._id);
                        setShowConfirmation(true);
                      }}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => fetchPolicyHistory(policy._id)}
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
              <p className="mb-4">¿Estás seguro de que quieres eliminar esta política?</p>
              <button
                className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition mr-2"
                onClick={handleDeletePolicy}
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

export default PoliticasPage;


