import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  usuario: { type: String, required: true }, // Nombre o ID del usuario relacionado
  tipo: { type: String, required: true },   // Tipo de incidencia (inicio de sesión, bloqueo, etc.)
  estado: { type: Boolean, required: true }, // Estado del usuario en el momento (bloqueado o no)
  motivo: { type: String, required: true }, // Razón del registro de la incidencia
  fecha: { type: Date, default: Date.now }, // Fecha en la que ocurrió la incidencia
});

export default mongoose.model("Incidencia", incidenciaSchema);


