import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  category: { type: String, required: true },
  specialty: { type: String, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu; // Cambiar a exportación por defecto

