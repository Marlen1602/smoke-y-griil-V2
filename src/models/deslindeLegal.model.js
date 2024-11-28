import mongoose from "mongoose";

const deslindeLegalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fechaVigencia: {
    type: Date,
    required: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  originalDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeslindeLegal",
  },
}, {
  timestamps: true,
});

export default mongoose.model("DeslindeLegal", deslindeLegalSchema);
