import express from "express";
import morgan from "morgan";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import empresaRoutes from "./routes/empresa.routes.js";
import incidenciaRoutes from "./routes/incidencias.routes.js";
import configuracion from "./routes/config.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import redes_sociales from "./routes/redes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import tamanosRoutes from "./routes/tamanoproducto.routes.js";
import categorias from "./routes/categorias.routes.js";
import documentos from "./routes/documentoslegales.js";
const app=express();

// Protección con Helmet (Cabeceras seguras)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],  // Solo permite contenido de la misma fuente
          scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"], // Permite scripts locales y Google (modifica según tu necesidad)
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Permite estilos de Google Fonts
          imgSrc: ["'self'", "data:", "https://yourdomain.com"], // Permite imágenes locales y de un dominio específico
          connectSrc: ["'self'", "https://api.yourbackend.com"], // Permite conexiones a tu backend
          frameSrc: ["'self'"], // Bloquea iframes de terceros
          objectSrc: ["'none'"], // Evita la carga de objetos (Flash, ActiveX)
        },
      },
    crossOriginEmbedderPolicy: false, // Para evitar problemas con iframes
}));
// Limitar el tamaño de las solicitudes JSON (prevención de DoS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Limpia entradas para evitar inyección de código malicioso (XSS)
app.use(xss());
// Middleware para cookies seguras
app.use(cookieParser());

// Rate limiting global (para todas las rutas)
//const globalLimiter = rateLimit({
   // windowMs: 15 * 60 * 1000, // 15 minutos
   // max: 100, // Máximo 100 solicitudes por IP
   // message: "Demasiadas solicitudes, intenta más tarde.",
//});

// Aplicar limitador global a todas las rutas
//app.use(globalLimiter);

app.use(cors({
    origin: ["http://localhost:5173", "https://smokeygrill.netlify.app"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
    credentials: true, // Permitir cookies
}));

// Logs de peticiones
app.use(morgan("dev"));


//Rutas del sistema
app.use("/api",authRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api",incidenciaRoutes);
app.use("/api",configuracion);
app.use("/api", faqRoutes);
app.use("/api",redes_sociales);
app.use("/api", productosRoutes);
app.use("/api", tamanosRoutes);
app.use("/api",categorias)
app.use("/api",documentos)


// Manejo centralizado de errores
app.use((err, req, res, next) => {
    console.error("Error detectado:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
