import React, { useState, useEffect } from "react";
import { getUsuarios, unlock, blockUser } from "../api/auth.js"; // Asegúrate de tener estas funciones en tu API
import AdminNavBar from "./AdminNavBar";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar u ocultar el modal
  const [actionType, setActionType] = useState(""); // Acción a confirmar (block o unlock)
  const [selectedUserId, setSelectedUserId] = useState(null); // ID del usuario seleccionado

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await getUsuarios();
      setUsuarios(response.data); // Asume que tu backend regresa los datos de los usuarios
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      if (actionType === "block") {
        await blockUser(selectedUserId); // Llama a la función para bloquear
      } else if (actionType === "unlock") {
        await unlock(selectedUserId); // Llama a la función para desbloquear
      }
      fetchUsuarios(); // Recarga la lista de usuarios
    } catch (error) {
      console.error("Error al realizar la acción:", error);
    } finally {
      setShowModal(false); // Oculta el modal
    }
  };

  const openModal = (action, id, role) => {
    if (role === "administrador" && action === "block") {
      alert("No puedes bloquear a un administrador.");
      return;
    }
    setActionType(action);
    setSelectedUserId(id);
    setShowModal(true); // Muestra el modal
  };

  const closeModal = () => {
    setShowModal(false); // Oculta el modal
    setActionType("");
    setSelectedUserId(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminNavBar />
      <h1 className="text-3xl font-bold text-center mt-4">Lista de Usuarios</h1>
      <div className="p-4 md:p-10">
        {loading ? (
          <p className="text-center text-lg">Cargando usuarios...</p>
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
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.nombre}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.email}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{usuario.role}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">
                      {usuario.isBlocked ? "Bloqueado" : "Activo"}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">
                      {usuario.isBlocked ? (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                          onClick={() => openModal("unlock", usuario._id, usuario.role)}
                        >
                          Desbloquear
                        </button>
                      ) : usuario.role === "administrador" ? (
                        <span className="text-gray-500">Sin acciones</span>
                      ) : (
                        <button
                          className="bg-red text-white px-4 py-2 rounded hover:bg-red transition"
                          onClick={() => openModal("block", usuario._id, usuario.role)}
                        >
                          Bloquear
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
                className="bg-red text-white px-4 py-2 rounded hover:bg-red transition"
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
