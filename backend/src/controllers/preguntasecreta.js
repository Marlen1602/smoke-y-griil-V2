import PreguntaSecreta from '../models/PreguntaSecreta.js';
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const obtenerPreguntaSecretaPorCorreo = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await User.findOne({
      where: { email },
      include: [{ model: PreguntaSecreta, as: 'pregunta', attributes: ['id', 'pregunta']}],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    if (!usuario.preguntaSecretaId) {
      return res.status(400).json({ message: "El usuario no ha configurado una pregunta secreta" });
    }

    res.json({
      pregunta: usuario.pregunta.pregunta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener pregunta secreta" });
  }
};

export const obtenerPreguntasSecretas = async (req, res) => {
  try {
    const preguntas = await PreguntaSecreta.findAll({
      attributes: ['id', 'pregunta']
    });
    res.json(preguntas);
  } catch (error) {
    console.error("Error al obtener preguntas secretas:", error);
    res.status(500).json({ message: "Error al obtener preguntas secretas" });
  }
};

export const verificarRespuestaSecreta = async (req, res) => {
  try {
    const { email, respuesta } = req.body;

    const usuario = await User.findOne({ where: { email } });

    if (!usuario || !usuario.respuestaSecreta) {
      return res.status(404).json({ message: "Usuario no encontrado o no tiene respuesta secreta" });
    }
    //Comparar respuesta
    if (usuario.respuestaSecreta.trim().toLowerCase() !== respuesta.trim().toLowerCase()) {
      return res.status(400).json({ message: "Respuesta incorrecta" });
    }

    //  Generar código
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Generar token válido por 15 min
    usuario.resetPasswordToken = code;
    await usuario.save();

    // ✉️ Enviar token al correo
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
      res.json({ message: "Token enviado al correo" });
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al validar la respuesta secreta" });
  }
};

export const verificarTokenReset = async (req, res) => {
  try {
    const { email, token } = req.body;

    const usuario = await User.findOne({ where: { email } });

    if (!usuario || usuario.resetPasswordToken !== token) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    res.json({ message: "Token válido", userId: usuario.id });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};


export const restablecerContrasena = async (req, res) => {
  try {
    const { email, token, nuevaPassword } = req.body;

    const usuario = await User.findOne({ where: { email } });

    if (!usuario || usuario.resetPasswordToken !== token) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Validar si la cuenta está bloqueada
    if (usuario.isBlocked) {
      return res.status(403).json({
        message: "Tu cuenta está bloqueada. No puedes cambiar la contraseña.",
      });
    }

    // Verificar si la nueva contraseña es igual a la actual
    const mismaPassword = await bcrypt.compare(nuevaPassword, usuario.password);
    if (mismaPassword) {
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la anterior.",
      });
    }

    // Hashear y guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    usuario.password = hashedPassword;
    usuario.resetPasswordToken = null;

    await usuario.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error.message);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

