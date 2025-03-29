import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const RedesSociales = sequelize.define( "RedesSociales",
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
    },
  },
  { timestamps: false, tableName: "redes_sociales" }
);

export default RedesSociales;


