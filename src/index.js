import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y luego iniciar el servidor
const startServer = async () => {
    try {
        await connectDB(); // Se conecta a la BD usando Sequelize
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ No se pudo iniciar el servidor:", error);
    }
};

startServer();

