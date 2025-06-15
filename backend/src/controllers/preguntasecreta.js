import prisma from "../db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import logger, { logSecurityEvent } from "../libs/logger.js";

export const obtenerPreguntaSecretaPorCorreo = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await prisma.users.findUnique({
      where: { email },
      include: {
        preguntas_secretas: {
          select: { id: true, pregunta: true }
        }
      }
    });

    if (!usuario) {
      logger.warn("Correo no encontrado para pregunta secreta", { email });
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    if (!usuario.preguntaSecretaId) {
      logger.warn("Usuario sin pregunta secreta configurada", { email });
      return res.status(400).json({ message: "El usuario no ha configurado una pregunta secreta" });
    }

    logger.info("Pregunta secreta consultada", { usuario: usuario.username });
    res.json({
      pregunta: usuario.preguntas_secretas.pregunta,
    });
  } catch (error) {
    logger.error("Error al obtener pregunta secreta", { error: error.message });
    res.status(500).json({ message: "Error al obtener pregunta secreta" });
  }
};

export const obtenerPreguntasSecretas = async (req, res) => {
  try {
    const preguntas = await prisma.preguntas_secretas.findMany({
      select: {
        id: true,
        pregunta: true,
      },
    });
    res.json(preguntas);
  } catch (error) {
    logger.error("Error al obtener preguntas secretas:", error);
    res.status(500).json({ message: "Error al obtener preguntas secretas" });
  }
};

export const verificarRespuestaSecreta = async (req, res) => {
  try {
    const { email, respuesta } = req.body;

    const usuario = await prisma.users.findUnique({ where: { email },
    include: {
        preguntas_secretas: true, // relación con preguntas_secretas
      },
    });

    if (!usuario || !usuario.respuestaSecreta) {
      logger.warn("Usuario no encontrado o sin respuesta secreta", { email });
      await logSecurityEvent(email, "Intento de recuperación fallido", true, "Usuario no tiene respuesta secreta");
      return res.status(404).json({ message: "Usuario no encontrado o no tiene respuesta secreta" });
    }
    //Comparar respuesta
    if (usuario.respuestaSecreta.trim().toLowerCase() !== respuesta.trim().toLowerCase()) {
      logger.warn("Respuesta secreta incorrecta", { usuario: usuario.username });
      await logSecurityEvent(usuario.username, "Respuesta secreta incorrecta", true, "Falló verificación de identidad");
      return res.status(400).json({ message: "Respuesta incorrecta" });
    }

    //  Generar código
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Actualizar el token de recuperación
    await prisma.users.update({
      where: { id: usuario.id },
      data: { resetPasswordToken: code },
    });

    //  Enviar token al correo
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "marlen04h@gmail.com",
          pass: "hcxi yvbl flvl ivbd",
        },
        
        tls: {
          rejectUnauthorized: false, // Desactiva la validación del certificado
        },
      });
    
      console.log(transporter);
    
      const mailOptions = {
        from: "Somoke&Grill@gmail.com",
        to: email,
        subject: "Restablecer contraseña",
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  padding: 20px;
                }
                .container {
                  background-color: #ffffff;
                  border-radius: 8px;
                  padding: 20px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  background-color: #ff6600;
                  color: #ffffff;
                  padding: 10px 0;
                  border-radius: 8px 8px 0 0;
                  font-size: 24px;
                }
                .content {
                  margin-top: 20px;
                  font-size: 16px;
                  line-height: 1.6;
                }
                .code {
                  font-size: 20px;
                  font-weight: bold;
                  color: #ff6600;
                  padding: 10px;
                  background-color: #f0f0f0;
                  border-radius: 5px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 12px;
                  color: #888888;
                }
                a {
                  color: #ff6600;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Restablece tu Contraseña</h1>
                </div>
                <div class="content">
                  <p>Hola,</p>
                  <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, por favor ignora este correo.</p>
                  <p>Para restablecer tu contraseña, utiliza el siguiente código:</p>
                  <div class="code">${code}</div>
                  <p>Este código será válido por las próximas 15 minutos.</p>
                  <p>Si tienes problemas, no dudes en contactarnos.</p>
                </div>
                <div class="footer">
                  <p>&copy; 2024 Somoke & Grill | Todos los derechos reservados</p>
                  <p><a href="https://api.whatsapp.com/send?phone=%2B527715685117&context=ARCpKCL49XIgv-k-h-uXTRmo9yPaG40YfdIdH82ydpjS35UsmuwFVCsGGlL23G78QphXA3_6cE6tjY5iKZS7tYp22zQJBM7cEraTDFv70UxlP3FJprwD_QwY-1g4cWgxcVzBEQhTqYCSNiRlcDfv3l5wmA&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawG2zkVleHRuA2FlbQIxMAABHXtqjtxKZZIKKmGQkG_BiDHdYtWOcUQFbMLbw4puLvY_eDOd8EXjadsmzw_aem_uSHl2IJ0nVXkBrjpDrJlqQ">Contáctanos</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      logger.info("Código de recuperación enviado por pregunta secreta", { usuario: usuario.username });
    await logSecurityEvent(usuario.username, "Código de recuperación enviado", false, "Verificación por pregunta secreta exitosa");

      res.json({ message: "Token enviado al correo" });
      
  } catch (error) {
    logger.error("Error al verificar respuesta secreta", { error: error.message });
    res.status(500).json({ message: "Error al validar la respuesta secreta" });
  }
};

export const verificarTokenReset = async (req, res) => {
  try {
    const { email, token } = req.body;

    const usuario = await prisma.users.findUnique({ where: { email } });

    if (!usuario || usuario.resetPasswordToken !== token) {
      logger.warn("Token inválido usado para restablecer contraseña", { email });
      await logSecurityEvent(email, "Token de recuperación inválido", true, "Token incorrecto o expirado");
           return res.status(401).json({ message: "Token inválido o expirado" });
    }
    logger.info("Token válido para restablecer contraseña", { usuario: usuario.username });
    res.json({ message: "Token válido", userId: usuario.id });
  } catch (error) {
    logger.error("Error al verificar token", { error: error.message });
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const restablecerContrasena = async (req, res) => {
  try {
    const { email, token, nuevaPassword } = req.body;

    const usuario = await prisma.users.findUnique({ where: { email } });

    if (!usuario || usuario.resetPasswordToken !== token) {
      logger.warn("Intento de restablecer contraseña con token inválido", { email });
      await logSecurityEvent(email, "Restablecimiento fallido", true, "Token inválido");
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Validar si la cuenta está bloqueada
    if (usuario.isBlocked) {
      logger.warn("Usuario bloqueado intentó cambiar contraseña", { usuario: usuario.username });
      return res.status(403).json({
        message: "Tu cuenta está bloqueada. No puedes cambiar la contraseña.",
      });
    }

    // Verificar si la nueva contraseña es igual a la actual
    const mismaPassword = await bcrypt.compare(nuevaPassword, usuario.password);
    if (mismaPassword) {
      logger.warn("Contraseña nueva igual a la anterior", { usuario: usuario.username });
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la anterior.",
      });
    }

    // Hashear y guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
     await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
      },
    });
    logger.info("Contraseña restablecida exitosamente", { usuario: usuario.username });
    await logSecurityEvent(usuario.username, "Contraseña restablecida", false, "Restablecimiento exitoso");

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    logger.error("Error al restablecer contraseña", { error: error.message });
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

