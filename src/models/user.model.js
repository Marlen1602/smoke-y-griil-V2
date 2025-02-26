import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('cliente', 'administrador'),
    defaultValue: 'cliente'
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerifiedForResetPassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  failedAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { timestamps: true });

export default User;



