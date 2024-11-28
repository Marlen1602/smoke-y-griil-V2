import mongoose from 'mongoose';

const preguntaSecretaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    pregunta: { type: String, required: true },
    respuesta: { type: String, required: true },
  });
  
  export default mongoose.model("PreguntaSecreta", preguntaSecretaSchema);
  