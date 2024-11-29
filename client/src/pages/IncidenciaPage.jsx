import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonitorDeIncidencias = () => {
  const [usuarios, setUsuarios] = useState([]);  // Para guardar la lista de usuarios
  const [incidencias, setIncidencias] = useState([]);  // Para guardar las incidencias del usuario seleccionado
  const [selectedUser, setSelectedUser] = useState(null);  // Para guardar el usuario seleccionado

  useEffect(() => {
    // Cargar los usuarios
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Mostrar las incidencias del usuario seleccionado
  const verIncidencias = async (usuarioId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/incidencias/${usuarioId}`);
      setIncidencias(response.data);
      setSelectedUser(usuarioId);  // Guardar el usuario seleccionado
    } catch (error) {
      console.error('Error al obtener las incidencias', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Monitor de Incidencias</h2>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {usuarios.map((usuario) => (
          <div key={usuario._id} className="flex justify-between items-center">
            <span>{usuario.nombre}</span>
            <button
              onClick={() => verIncidencias(usuario._id)}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Ver Incidencias
            </button>
          </div>
        ))}
      </div>

      {/* Mostrar incidencias si se selecciona un usuario */}
      {selectedUser && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-bold">Incidencias del Usuario {selectedUser}</h3>
          <ul className="mt-2">
            {incidencias.map((incidencia) => (
              <li key={incidencia._id} className="border-b py-2">
                <p className="font-semibold">{incidencia.descripcion}</p>
                <span className={`text-sm ${incidencia.estado === 'Pendiente' ? 'text-red-500' : 'text-green-500'}`}>
                  {incidencia.estado}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonitorDeIncidencias;
