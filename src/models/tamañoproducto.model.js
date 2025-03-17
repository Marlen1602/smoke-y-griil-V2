import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const TamanoProducto = sequelize.define("TamanoProducto", {
  ID_Tamaño: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_Producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Tamaño: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "tamanosproductos",
  timestamps: false,
});

export default TamanoProducto;
