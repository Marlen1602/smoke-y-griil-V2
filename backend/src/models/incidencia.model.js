import { DataTypes } from "sequelize";
import { sequelize } from "../db.js"; // Asegúrate de importar tu conexión a la BD

const Incidencia = sequelize.define("Incidencia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false, // No puede estar vacío
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Poner la fecha actual automáticamente
  },
}, {
  timestamps: false, // Desactivar `createdAt` y `updatedAt` si no los necesitas
  tableName: "Incidencias", // Nombre de la tabla en la BD
});

export default Incidencia;

