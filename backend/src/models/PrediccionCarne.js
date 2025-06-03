import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const PrediccionCarne = sequelize.define("PrediccionCarne", {
  prediction_date: DataTypes.DATEONLY,
  week_number: DataTypes.INTEGER,
  predicted_kg: DataTypes.FLOAT,
  k: DataTypes.FLOAT,
  p0: DataTypes.FLOAT
}, {
  tableName: "prediccion_carne",
  timestamps: false
});

export default PrediccionCarne;

