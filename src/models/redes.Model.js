import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

// 🔹 No importamos Empresa aquí todavía

const RedesSociales = sequelize.define(
  "RedesSociales",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ID_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Asignamos siempre la empresa con ID 1
    },
  },
  { timestamps: false, tableName: "redes_sociales" }
);

export default RedesSociales;


