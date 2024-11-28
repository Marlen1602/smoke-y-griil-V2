import mongoose from 'mongoose';
const configuracionBloqueoSchema = new mongoose.Schema({
    intentosMaximos: { type: Number, default: 5 },
    duracionBloqueo: { type: Number, default: 30 }, // En minutos
  });
  
  export default mongoose.model("ConfiguracionBloqueo", configuracionBloqueoSchema);
  