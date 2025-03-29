import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Empresa = sequelize.define(
  "Empresa",
  {
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
    Horario: {
      type: DataTypes.TEXT,
    },
    Logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "datos_empresa",
  }
);

export default Empresa;

