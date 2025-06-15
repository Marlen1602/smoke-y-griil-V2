import app from "./app.js";
import prisma from "./db.js"; // ya no necesitas connectDB

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Opcional: probar una consulta para verificar conexión
    await prisma.$connect(); // 🔄 conectar explícitamente (opcional)
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
