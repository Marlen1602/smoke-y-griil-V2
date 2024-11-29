import mongoose from 'mongoose';

// Definir el esquema de la incidencia
const incidenciaSchema = new mongoose.Schema({
  username: { type: String, required: true },
  actividad: { type: String, required: true },
  date: { type: Date, default: Date.now },  // Fecha de la incidencia
});

// Crear el modelo
const Incidencia = mongoose.model('Incidencia', incidenciaSchema);

// Exportar el modelo
export default Incidencia;
