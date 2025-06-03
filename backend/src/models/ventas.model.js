import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const VentasSemanales = sequelize.define("VentasSemanales", {
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  hamburguesas: DataTypes.INTEGER,
  tacos: DataTypes.INTEGER,
  bolillos: DataTypes.INTEGER,
  burritos: DataTypes.INTEGER,
  gringas: DataTypes.INTEGER,
  baguettes: DataTypes.INTEGER,
  total_meat_kg: {
    type: DataTypes.VIRTUAL,
    get() {
      return (
        (this.hamburguesas || 0) * 0.15 +
        (this.tacos || 0) * 0.10 +
        (this.bolillos || 0) * 0.12 +
        (this.burritos || 0) * 0.25 +
        (this.gringas || 0) * 0.20 +
        (this.baguettes || 0) * 0.20
      );
    }
  }
}, {
  tableName: "ventas_semanales",
  timestamps: false
});


export default VentasSemanales;

