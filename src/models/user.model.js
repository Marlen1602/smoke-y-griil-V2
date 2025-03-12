import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import TipoUsuario from "../models/TipoUsuario.js"; 
const User = sequelize.define("User", {
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
  tipoUsuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2, // Se asigna "Cliente" por defecto
    references: {
      model: TipoUsuario,
      key: "ID"
    }
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

User.belongsTo(TipoUsuario, { foreignKey: "tipoUsuarioId" });

export default User;
