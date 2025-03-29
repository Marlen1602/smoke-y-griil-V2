import { DataTypes } from "sequelize";
import { sequelize } from "../db.js"; // Asegúrate de importar tu conexión a la BD

const Preguntas = sequelize.define("Preguntas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: false, // No puede estar vacío
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Poner la fecha actual automáticamente
  },
}, {
  timestamps: false, // Desactivar `createdAt` y `updatedAt` si no los necesitas
  tableName: "Preguntas", // Nombre de la tabla en la BD
});

export default Preguntas;
