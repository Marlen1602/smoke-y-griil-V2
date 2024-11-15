// src/pages/DeslindePage.jsx
import React, { useEffect, useState } from 'react';
import {
    getDisclaimerRequest,
    createDeslRequest,
    updateDeslRequest,
    deleteDeslRequest
} from '../api/auth';

const DeslindePage = () => {
    const [disclaimers, setDisclaimers] = useState([]);
    const [newDisclaimer, setNewDisclaimer] = useState({ titulo: '', contenido: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchDisclaimers();
    }, []);

    const fetchDisclaimers = async () => {
        try {
            const response = await getDisclaimerRequest();
            setDisclaimers(response.data);
        } catch (error) {
            console.error('Error fetching disclaimers:', error);
        }
    };

    const addDisclaimer = async () => {
        try {
            const response = await createDeslRequest(newDisclaimer);
            setDisclaimers([...disclaimers, response.data]);
            setNewDisclaimer({ titulo: '', contenido: '' });
        } catch (error) {
            console.error('Error adding disclaimer:', error);
        }
    };

    const editDisclaimer = (id, titulo, contenido) => {
        setIsEditing(true);
        setEditId(id);
        setNewDisclaimer({ titulo, contenido });
    };
deleteDeslRequest
    const updateDisclaimer = async () => {
        try {
            const response = await updateDeslRequest(editId, newDisclaimer);
            setDisclaimers(disclaimers.map(disclaimer => 
                disclaimer._id === editId ? response.data : disclaimer
            ));
            setNewDisclaimer({ titulo: '', contenido: '' });
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            console.error('Error updating disclaimer:', error);
        }
    };

    const deleteDisclaimer = async (id) => {
        try {
            await deleteDeslRequest(id);
            setDisclaimers(disclaimers.filter(disclaimer => disclaimer._id !== id));
        } catch (error) {
            console.error('Error deleting disclaimer:', error);
        }
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Deslinde Legal</h2>

            <table className="min-w-full bg-white border mb-4">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Título</th>
                        <th className="py-2 px-4 border-b">Contenido</th>
                        <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {disclaimers.map((disclaimer) => (
                        <tr key={disclaimer._id}>
                            <td className="py-2 px-4 border-b">{disclaimer.titulo}</td>
                            <td className="py-2 px-4 border-b">{disclaimer.contenido}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => editDisclaimer(disclaimer._id, disclaimer.titulo, disclaimer.contenido)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => deleteDisclaimer(disclaimer._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Título del deslinde"
                    value={newDisclaimer.titulo}
                    onChange={(e) => setNewDisclaimer({ ...newDisclaimer, titulo: e.target.value })}
                    className="border px-2 py-1 mr-2"
                />
                <input
                    type="text"
                    placeholder="Contenido del deslinde"
                    value={newDisclaimer.contenido}
                    onChange={(e) => setNewDisclaimer({ ...newDisclaimer, contenido: e.target.value })}
                    className="border px-2 py-1 mr-2"
                />
                {isEditing ? (
                    <button
                        className="bg-green-500 text-white px-4 py-1 rounded"
                        onClick={updateDisclaimer}
                    >
                        Actualizar
                    </button>
                ) : (
                    <button
                        className="bg-orange-500 text-white px-4 py-1 rounded"
                        onClick={addDisclaimer}
                    >
                        Agregar
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeslindePage;
