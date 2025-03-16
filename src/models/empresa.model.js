import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import RedesSociales from "./redes.Model" // 🔹 Ahora sí importamos RedesSociales

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

// 🔹 Definir la relación después de que ambos modelos estén creados
Empresa.hasMany(RedesSociales, { foreignKey: "ID_empresa", as: "RedesSociales" });
RedesSociales.belongsTo(Empresa, { foreignKey: "ID_empresa" });

export default Empresa;

