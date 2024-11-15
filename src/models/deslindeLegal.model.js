import mongoose from 'mongoose';

const deslindeLegalSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  fechaVigencia: {
    type: Date,
    required: true,
  },
  version: {
    type: String,
    default: "1.0",
  },
  vigente: {
    type: Boolean,
    default: true,
  },
  eliminado: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('DeslindeLegal', deslindeLegalSchema);
