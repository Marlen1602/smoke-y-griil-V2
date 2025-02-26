import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Config = sequelize.define('Config', {
  maxAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    allowNull: false
  },
  lockDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 30 * 60 * 1000, // 30 minutos en milisegundos
    allowNull: false
  }
}, { timestamps: false });

export default Config;
