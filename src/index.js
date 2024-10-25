import app from './app.js'
import { connectDB } from './db.js'

// Conectar a MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});