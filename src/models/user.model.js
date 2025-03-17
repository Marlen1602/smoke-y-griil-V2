import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import TipoUsuario from "../models/TipoUsuario.js"; 
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoUsuarioId: {  // 🔹 Relación con TipoUsuario
    type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tipousuarios", // Solo referencia, pero NO genera FK en Sequelize
        key: "ID",
      },
      foreignKeyConstraints: false, // Evita que Sequelize intente crear FK
      defaultValue: 2
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
