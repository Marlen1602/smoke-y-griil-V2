import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Producto = sequelize.define("Producto", {
  ID_Producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // NULL si el producto tiene tamaños
  },
  Disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Por defecto, el producto está disponible
  },
  Imagen: {
    type: DataTypes.STRING,
    allowNull: true, // URL de Cloudinary
  },
  ID_Categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TieneTamanos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
 }, {
  tableName: "productos",
  timestamps: false,
});

export default Producto;
