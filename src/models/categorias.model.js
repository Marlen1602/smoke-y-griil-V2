import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const categorias = sequelize.define( "categorias",
  {
    ID_Categoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  { timestamps: false, tableName: "categorias" }
);

export default categorias;