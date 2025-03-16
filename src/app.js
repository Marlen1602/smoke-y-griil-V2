import express from "express";
import morgan from "morgan";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import politicasRoutes from "./routes/politicas.router.js";
import terminos from "./routes/terminosCondiciones.router.js";
import deslinde from "./routes/deslindeLegal.router.js";
import empresaRoutes from "./routes/empresa.routes.js";
import incidenciaRoutes from "./routes/incidencias.routes.js";
import configuracion from "./routes/config.routes.js";
import faqRoutes from "./routes/faq.routes.js";

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
app.use(express.json({ limit: "10kb" }));
//Limpia entradas para evitar inyección de código malicioso (XSS)
app.use(xss());
// Middleware para cookies seguras
app.use(cookieParser());
// Rate limiting global (para todas las rutas)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 solicitudes por IP
    message: "Demasiadas solicitudes, intenta más tarde.",
});
// Rate limiting específico para autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, // Solo 5 intentos de login por usuario
    message: "Demasiados intentos de inicio de sesión, intenta más tarde."
});
// Aplicar limitador global a todas las rutas
app.use(globalLimiter);

app.use(cors({
    origin: ["http://localhost:5173", "https://smokeygrill.netlify.app"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
    credentials: true, // Permitir cookies
}));

// Logs de peticiones
app.use(morgan("dev"));

// Aplicar rate limiting más estricto solo a rutas de autenticación
app.use("/api/auth", authLimiter);

//Rutas del sistema
app.use("/api",authRoutes);
app.use("/api",politicasRoutes);
app.use("/api",terminos);
app.use("/api",deslinde);
app.use("/api/empresa", empresaRoutes);
app.use("/api",incidenciaRoutes);
app.use("/api",configuracion);
app.use("/api", faqRoutes);


// Manejo centralizado de errores
app.use((err, req, res, next) => {
    console.error("Error detectado:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
