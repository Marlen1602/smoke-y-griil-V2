import { Sequelize } from 'sequelize';

// Configuración de la base de datos
export const sequelize = new Sequelize('smokeygrill', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Evita logs innecesarios
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');
    await sequelize.sync({ alter: true }); // Sincroniza modelos con la base de datos
    console.log('✅ Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
    process.exit(1);
  }
};


   
    