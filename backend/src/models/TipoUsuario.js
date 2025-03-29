import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const TipoUsuario = sequelize.define("TipoUsuario", {
  ID: {  // 🔹 Debe coincidir con la base de datos
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descripcion: {  // 🔹 Usar "descripcion" como en la BD
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { 
  timestamps: false, 
  tableName: "TipoUsuarios" // 🔹 Asegura que Sequelize use el nombre correcto de la tabla
});

export default TipoUsuario;



