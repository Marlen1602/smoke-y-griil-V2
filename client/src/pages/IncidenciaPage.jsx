import React, { useState, useEffect } from "react";
import axios from "axios";

const IncidenciasPage = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({ tipo: "", descripcion: "" });

  useEffect(() => {
    const fetchIncidencias = async () => {
      const response = await axios.get("/api/incidencias");
      setIncidencias(response.data);
    };
    fetchIncidencias();
  }, []);

  const handleAddIncidencia = async () => {
    const response = await axios.post("/api/incidencias", nuevaIncidencia);
    setIncidencias([...incidencias, response.data]);
    setNuevaIncidencia({ tipo: "", descripcion: "" });
  };

  return (
    <div>
      <h1>Gestión de Incidencias</h1>
      <input
        type="text"
        placeholder="Tipo"
        value={nuevaIncidencia.tipo}
        onChange={(e) => setNuevaIncidencia({ ...nuevaIncidencia, tipo: e.target.value })}
      />
      <textarea
        placeholder="Descripción"
        value={nuevaIncidencia.descripcion}
        onChange={(e) => setNuevaIncidencia({ ...nuevaIncidencia, descripcion: e.target.value })}
      ></textarea>
      <button onClick={handleAddIncidencia}>Agregar Incidencia</button>
      <ul>
        {incidencias.map((incidencia) => (
          <li key={incidencia._id}>{incidencia.tipo} - {incidencia.descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default IncidenciasPage;
