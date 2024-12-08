import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  maxAttempts: { type: Number, default: 3 }, // Máximo de intentos fallidos
  lockDuration: { type: Number, default: 30 * 60 * 1000 }, // Duración del bloqueo en milisegundos (30 minutos por defecto)
});

export default mongoose.model("Config", configSchema);
