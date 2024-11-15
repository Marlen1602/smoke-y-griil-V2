import React, { useState, useEffect } from "react";
import { 
    getTermsRequest, 
    createTermsRequest, 
    updateTermsRequest, 
    deleteTermsRequest 
} from "../api/auth.js";
import AdminNavBar from "./AdminNavBar.jsx";

const TermsPage = () => {
    const [terms, setTerms] = useState([]);
    const [newTerms, setNewTerms] = useState({ titulo: "", contenido: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const response = await getTermsRequest();
            setTerms(response.data);
        } catch (error) {
            console.error("Error al obtener los términos:", error);
            setErrorMessage("No tienes permiso para ver los términos o no estás autenticado.");
        }
    };

    const addTerms = async () => {
        try {
            const response = await createTermsRequest(newTerms);
            setTerms([...terms, response.data]);
            setNewTerms({ titulo: "", contenido: "" });
        } catch (error) {
            console.error("Error al agregar términos:", error);
            setErrorMessage("Error al agregar los términos.");
        }
    };

    const editTerms = (id, titulo, contenido) => {
        setIsEditing(true);
        setEditId(id);
        setNewTerms({ titulo, contenido });
    };

    const updateTerms = async () => {
        try {
            const response = await updateTermsRequest(editId, newTerms);
            setTerms(terms.map(term => (term._id === editId ? response.data : term)));
            setNewTerms({ titulo: "", contenido: "" });
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            console.error("Error al actualizar los términos:", error);
            setErrorMessage("Error al actualizar los términos.");
        }
    };

    const deleteTerms = async (id) => {
        try {
            await deleteTermsRequest(id);
            setTerms(terms.filter(term => term._id !== id));
        } catch (error) {
            console.error("Error al eliminar los términos:", error);
            setErrorMessage("Error al eliminar los términos.");
        }
    };

    return (
        <div className="p-10">
            <AdminNavBar />
            <h2 className="text-2xl font-bold mb-4">Gestión de Términos y Condiciones</h2>

            {errorMessage && (
                <div className="bg-red-500 text-white text-center p-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Título</th>
                        <th className="py-2 px-4 border-b">Contenido</th>
                        <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {terms.map((term) => (
                        <tr key={term._id}>
                            <td className="py-2 px-4 border-b">{term.titulo}</td>
                            <td className="py-2 px-4 border-b">{term.contenido}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => editTerms(term._id, term.titulo, term.contenido)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => deleteTerms(term._id)}
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
                    placeholder="Título"
                    value={newTerms.titulo}
                    onChange={(e) => setNewTerms({ ...newTerms, titulo: e.target.value })}
                    className="border px-2 py-1 mr-2"
                />
                <input
                    type="text"
                    placeholder="Contenido"
                    value={newTerms.contenido}
                    onChange={(e) => setNewTerms({ ...newTerms, contenido: e.target.value })}
                    className="border px-2 py-1 mr-2"
                />
                {isEditing ? (
                    <button
                        className="bg-green-500 text-white px-4 py-1 rounded"
                        onClick={updateTerms}
                    >
                        Actualizar
                    </button>
                ) : (
                    <button
                        className="bg-orange-500 text-white px-4 py-1 rounded"
                        onClick={addTerms}
                    >
                        Agregar
                    </button>
                )}
            </div>
        </div>
    );
};

export default TermsPage;
