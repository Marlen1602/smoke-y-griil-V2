import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  tipo: { type: String, required: true }, // Tipo de incidencia
  descripcion: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  estado: { type: String, enum: ["Pendiente", "Resuelta"], default: "Pendiente" },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Incidencia", incidenciaSchema);


