import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Configuración de la base de datos
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false, // Evita logs innecesarios
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("Conectado a MySQL con Sequelize");
  } catch (error) {
    console.error("Error al conectar a MySQL:", error);
    process.exit(1);
  }
};


   
    