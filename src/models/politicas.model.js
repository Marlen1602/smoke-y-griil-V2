import mongoose from "mongoose";

const politicaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descripcion: { type: String, required: true },
  version: { type: Number, required: true, default: 1 },
  isDeleted: { type: Boolean, default: false },
  originalPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: "Politica" },
  fechaVigencia: { type: Date, required: true }
}, { timestamps: true }); // createdAt y updatedAt se generarán automáticamente

export default mongoose.model("Politica", politicaSchema);
