import mongoose from "mongoose";

const terminosCondicionesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaVigencia: { type: Date, required: true },
    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    originalPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: "TerminosCondiciones", default: null }
}, {
    timestamps: true
});

export default mongoose.model("TerminosCondiciones", terminosCondicionesSchema);
