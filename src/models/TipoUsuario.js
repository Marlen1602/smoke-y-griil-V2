import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const TipoUsuario = sequelize.define('TipoUsuario', {
  ID_Tipo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  Nombre: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

export default TipoUsuario;
