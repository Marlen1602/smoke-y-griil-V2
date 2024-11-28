import mongoose from "mongoose";

const EmpresaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slogan: { type: String, required: true },
  logo: { type: String, required: true },
  socialLinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const Empresa = mongoose.model("Empresa", EmpresaSchema);

export default Empresa; // Asegúrate de que esta línea esté presente


