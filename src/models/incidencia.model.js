import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  tipo: { type: String, required: true }, // Tipo de incidencia
  usuario: { type: String },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Incidencia", incidenciaSchema);


