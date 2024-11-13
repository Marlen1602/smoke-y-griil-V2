import React, { useState, useEffect } from "react";
import { 
    getPoliciesRequest, 
    createPolicyRequest, 
    updatePolicyRequest, 
    deletePolicyRequest 
} from "../api/auth.js"; // Asegúrate de ajustar esta ruta según tu estructura de archivos
import AdminNavBar from "./AdminNavBar.jsx";

const PoliticasPage = () => {
    const [policies, setPolicies] = useState([]);
    const [newPolicy, setNewPolicy] = useState({ title: "", descripcion: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Cargar todas las políticas al montar el componente
    useEffect(() => {
        fetchPolicies();
    }, []);

    // Obtener todas las políticas desde el backend
    const fetchPolicies = async () => {
        try {
            const response = await getPoliciesRequest();
            if (Array.isArray(response.data)) {
                setPolicies(response.data);
            } else {
                console.error("La respuesta no es un array:", response.data);
                setPolicies([]); // Asegurarse de que policies sea un array vacío si la respuesta no es la esperada
            }
        } catch (error) {
            console.error("Error al obtener las políticas:", error);
            setErrorMessage("No tienes permiso para ver las políticas o no estás autenticado.");
        }
    };

    // Crear una nueva política
    const addPolicy = async () => {
        try {
            const response = await createPolicyRequest(newPolicy);
            setPolicies([...policies, response.data]);
            setNewPolicy({ title: "", descripcion: "" });
        } catch (error) {
            console.error("Error al agregar la política:", error);
            setErrorMessage("Error al agregar la política. Verifica los datos y vuelve a intentar.");
        }
    };

    // Preparar el formulario para editar una política existente
    const editPolicy = (id, title, descripcion) => {
        setIsEditing(true);
        setEditId(id);
        setNewPolicy({ title, descripcion });
    };

    // Actualizar una política existente
    const updatePolicy = async () => {
        try {
            const response = await updatePolicyRequest(editId, newPolicy);
            setPolicies(policies.map(policy => (policy._id === editId ? response.data : policy)));
            setNewPolicy({ title: "", descripcion: "" });
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            console.error("Error al actualizar la política:", error);
            setErrorMessage("Error al actualizar la política. Verifica los datos y vuelve a intentar.");
        }
    };

    // Eliminar una política
    const deletePolicy = async (id) => {
        try {
            await deletePolicyRequest(id);
            setPolicies(policies.filter(policy => policy._id !== id));
        } catch (error) {
            console.error("Error al eliminar la política:", error);
            setErrorMessage("Error al eliminar la política.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavBar />
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Políticas</h2>
            <h3 className="text-2xl mb-4 ">Politica:</h3>
            <div className="mt-4">
                <input 
                    type="text"
                    placeholder="Título de la política"
                    value={newPolicy.title}
                    onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                    className="border px-2 py-1 mr-2 mb-4"
                />
                <input
                    type="text"
                    placeholder="Descripción de la política"
                    value={newPolicy.descripcion}
                    onChange={(e) => setNewPolicy({ ...newPolicy, descripcion: e.target.value })}
                    className="border px-2 py-1 mr-2"
                />
                {isEditing ? (
                    <button
                        className="bg-green-500 text-white px-4 py-1 rounded"
                        onClick={updatePolicy}
                    >
                        Actualizar
                    </button>
                ) : (
                    <button
                        className="bg-orange-500 text-white px-4 py-1 rounded"
                        onClick={addPolicy}
                    >
                        Agregar
                    </button>
                )}
            {errorMessage && (
                <div className="bg-red-500 text-white text-center p-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Título</th>
                        <th className="py-2 px-4 border-b">Descripción</th>
                        <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(policies) && policies.map((policy) => (
                        <tr key={policy._id}>
                            <td className="py-2 px-4 border-b">{policy.title}</td>
                            <td className="py-2 px-4 border-b">{policy.descripcion}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => editPolicy(policy._id, policy.title, policy.descripcion)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red text-white px-2 py-1 rounded"
                                    onClick={() => deletePolicy(policy._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
    );
};

export default PoliticasPage;

