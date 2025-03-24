import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const PreguntaSecreta = sequelize.define("preguntas_secretas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});

export default PreguntaSecreta;
