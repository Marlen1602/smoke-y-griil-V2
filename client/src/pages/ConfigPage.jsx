import React, { useState, useEffect } from "react";
import { getUsuarios, unlock, blockUser } from "../api/auth.js";
import AdminNavBar from "./AdminNavBar";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await getUsuarios();
      console.log("Usuarios obtenidos:", response.data);
      setUsuarios(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("Error al cargar la lista de usuarios. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      if (actionType === "block") {
        await blockUser(selectedUserId);
      } else if (actionType === "unlock") {
        await unlock(selectedUserId);
      }
      fetchUsuarios();
      setShowModal(false);
    } catch (error) {
      console.error("Error al realizar la acción:", error);
      alert(`Error al ${actionType === "block" ? "bloquear" : "desbloquear"} al usuario.`);
    }
  };

  const openModal = (action, id, role) => {
    if (role === "administrador" && action === "block") {
      alert("No puedes bloquear a un administrador.");
      return;
    }
    setActionType(action);
    setSelectedUserId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActionType("");
    setSelectedUserId(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center mt-4">Lista de Usuarios</h1>
      <div className="p-4 md:p-10">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
              onClick={fetchUsuarios}
            >
              Reintentar
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-600">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Nombre</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Correo</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Rol</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Estado</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id || usuario._id}>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.nombre}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.email}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.role}</td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">
                        <span className={`px-2 py-1 rounded ${usuario.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                          {usuario.isBlocked ? "Bloqueado" : "Activo"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b dark:border-gray-700">
                        {usuario.isBlocked ? (
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            onClick={() => openModal("unlock", usuario.id || usuario._id, usuario.role)}
                          >
                            Desbloquear
                          </button>
                        ) : usuario.role === "administrador" ? (
                          <span className="text-gray-500">Sin acciones</span>
                        ) : (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => openModal("block", usuario.id || usuario._id, usuario.role)}
                          >
                            Bloquear
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">No hay usuarios disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg p-6 w-11/12 max-w-sm">
            <h2 className="text-xl font-bold mb-4">
              {actionType === "block"
                ? "¿Estás seguro de que quieres bloquear a este usuario?"
                : "¿Estás seguro de que quieres desbloquear a este usuario?"}
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={handleAction}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;