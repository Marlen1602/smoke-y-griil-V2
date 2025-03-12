import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const TipoUsuario = sequelize.define("TipoUsuario", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { timestamps: false });

export default TipoUsuario;

