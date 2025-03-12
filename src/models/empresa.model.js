import { DataTypes } from "sequelize";
import { sequelize } from "../db.js"; // Asegúrate de importar tu conexión a la BD

const Empresa = sequelize.define("Empresa", {
  ID_empresa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Eslogan: {
    type: DataTypes.STRING,
  },
  Mision: {
    type: DataTypes.TEXT,
  },
  Vision: {
    type: DataTypes.TEXT,
  },
  Direccion: {
    type: DataTypes.TEXT,
  },
  Logo: {
    type: DataTypes.STRING, // Almacena la URL de la imagen del logo
    allowNull: true,
  }
}, {
  timestamps: false, // No se agregan automáticamente createdAt y updatedAt
  tableName: "Datos_Empresa", // Nombre exacto de la tabla en la BD
});

export default Empresa;

