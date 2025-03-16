import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import logger, { logSecurityEvent } from "../libs/logger.js";
import dotenv from "dotenv";
import { createAccessToken } from "../libs/jwt.js";
import axios from "axios";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import Incidencia from "../models/incidencia.model.js"; 
import TipoUsuario from "../models/TipoUsuario.js";
import Config from "../models/config.model.js";
dotenv.config();
export const validateRegister = [
  body("email").isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
  body("username").trim().isLength({ min: 3 }).withMessage("El nombre de usuario debe tener al menos 3 caracteres"),
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellidos").trim().notEmpty().withMessage("Los apellidos son obligatorios"),
  body("password"),
  body("email").normalizeEmail(), // Normaliza el email para eliminar espacios y normalizar el formato
];

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔹 Buscar el usuario en la base de datos incluyendo su TipoUsuario
    const userFound = await User.findOne({
      where: { email },
      include: [{ model: TipoUsuario, as: "TipoUsuario" }] // 🔹 Usa el alias correcto,
    });

    if (!userFound) {
      await logSecurityEvent(email, "Intento de inicio de sesión fallido", false, "Credenciales inválidas");
      logger.warn(`Intento de inicio de sesión fallido - Usuario: ${email}`);
      return res.status(404).json({ message: "Credenciales invalidas" });
    }

    // Obtener configuración global
    const config = await Config.findOne();
    const maxAttempts = config?.maxAttempts || 3;
    const lockDuration = config?.lockDuration || 5 * 60 * 1000; // 30 minutos

     // Verificar si el bloqueo ha expirado
     if (userFound.lockUntil && userFound.lockUntil <= Date.now()) {
      userFound.isBlocked = false;
      userFound.lockUntil = null;
      userFound.failedAttempts = 0;
    }

    // Verificar si la cuenta está bloqueada por tiempo
    if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((userFound.lockUntil - Date.now()) / 60000); // Minutos restantes
      
       // Registrar incidencia de cuenta bloqueada
       await logSecurityEvent(userFound.username, "Intento de inicio de sesión bloqueado", true, `Cuenta bloqueada. Tiempo restante: ${remainingTime} minutos`);
      logger.warn(`Intento de acceso a cuenta bloqueada - Usuario: ${userFound.username}, Tiempo restante: ${remainingTime} minutos`);

      
      return res.status(403).json({ 
        message: `Tu cuenta está bloqueada. Intenta nuevamente en ${remainingTime} minutos.`,
        });
    }

    //Verifica la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      // Incrementar intentos fallidos
      const failedAttempts = userFound.failedAttempts + 1;

      if (failedAttempts >= maxAttempts) {
        await userFound.update({
          lockUntil: Date.now() + lockDuration,
          failedAttempts: 0,
          isBlocked: true,
        });

        await logSecurityEvent(userFound.username, "Bloqueo de cuenta", true, "Exceso de intentos fallidos");
        logger.error(`Cuenta bloqueada por intentos fallidos - Usuario: ${userFound.username}`);


        return res.status(403).json({
          message: `Tu cuenta ha sido bloqueada. Intenta nuevamente en ${lockDuration / 60000} minutos.`,
        });
      }

    await userFound.update({failedAttempts});
   
    // Registrar incidencia de intento fallido
    await logSecurityEvent(userFound.username, "Intento de inicio de sesión fallido", false, "Contraseña incorrecta");
      logger.warn(`Intento fallido de inicio de sesión - Usuario: ${userFound.username}`);


    return res.status(400).json({ message: "Credenciales invalidas" });
    }

      //  Restablecer intentos fallidos
    await userFound.update({
      failedAttempts: 0,
      lockUntil: null,
      isBlocked: false,
    });
 
     // Registrar incidencia de intento exitoso
     await logSecurityEvent(userFound.username, "Inicio de sesión exitoso", false, "Inicio de sesión correcto");
    logger.info(`Inicio de sesión exitoso - Usuario: ${userFound.username}`);

    // Crear el token de acceso
    const token = await createAccessToken({ id: userFound.id }, { expiresIn: "1h" });

     //Enviar el token en una cookie HTTP-only
     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 * 1000, // Expira en 7 días
    });

    // Responder con los detalles del usuario y el token
    return res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      tipoUsuarioId: userFound.TipoUsuario.ID,  
      tipoUsuario: userFound.TipoUsuario.descripcion, 
        createAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      token,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const unlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userFound = await User.findByPk(id);

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await userFound.update({
      failedAttempts: 0,
      lockUntil: null,
      isBlocked: false,
    });

    await logSecurityEvent(userFound.username, "Desbloqueo de cuenta", false, "Cuenta desbloqueada por el administrador");
    logger.info(`Cuenta desbloqueada - Usuario: ${userFound.username}`);


    res.status(200).json({ message: "Usuario desbloqueado exitosamente" });
  } catch (error) {
    console.error("Error al desbloquear usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userFound = await User.findByPk(id);

    if (!userFound) {
      logger.warn(`Intento fallido de bloqueo - Usuario ID: ${id} no encontrado`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await userFound.update({
      isBlocked: true,
      failedAttempts: 0
    });

    await logSecurityEvent(
      userFound.username,
      "Bloqueo manual de cuenta",
      true,
      "Bloqueado por el administrador"
    );

    logger.info(`Usuario bloqueado - Usuario: ${userFound.username}`);
    res.status(200).json({ message: "Usuario bloqueado exitosamente" });
  } catch (error) {
    logger.error(`Error al bloquear usuario ${id}: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const sendVerificationEmail = async (email, code) => {
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
    subject: "Verifica tu correo electrónico",
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
              margin-top: 10px;
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
              <h1>Verifica tu Correo Electrónico</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Gracias por registrarte en Somoke & Grill. Para completar tu registro y verificar tu correo electrónico, por favor utiliza el siguiente código:</p>
              <div class="code">${code}</div>
              <p>Si no solicitaste este código, por favor ignora este correo.</p>
              <p>Saludos cordiales,</p>
              <p><strong>El equipo de Somoke & Grill</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Somoke & Grill | Todos los derechos reservados</p>
              <p><a href="https://api.whatsapp.com/send?phone=%2B527715685117&context=ARCpKCL49XIgv-k-h-uXTRmo9yPaG40YfdIdH82ydpjS35UsmuwFVCsGGlL23G78QphXA3_6cE6tjY5iKZS7tYp22zQJBM7cEraTDFv70UxlP3FJprwD_QwY-1g4cWgxcVzBEQhTqYCSNiRlcDfv3l5wmA&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawG2zkVleHRuA2FlbQIxMAABHXtqjtxKZZIKKmGQkG_BiDHdYtWOcUQFbMLbw4puLvY_eDOd8EXjadsmzw_aem_uSHl2IJ0nVXkBrjpDrJlqQ">Contáctanos</a> si tienes algún problema.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
  

  await transporter.sendMail(mailOptions);
};

export const register = async (req, res) => {
  // Validar los resultados de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, username, nombre, apellidos, recaptchaToken } = req.body;

  try {
    // Validar reCAPTCHA
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {},
      {
        params: {
          secret: process.env.secret_Recapcha, 
          response: recaptchaToken,
        },
      }
    );
    if (!recaptchaResponse.data.success) {
      return res.status(400).json(["No se pudo completar el registro"]);
    }

    // Verificar si el nombre de usuario ya existe
    const usernameExists = await User.findOne({ where:{username} });
    console.log(usernameExists);
    if (usernameExists) {
        return res.status(400).json(["No se pudo completar el registro"]);
    }

    // Verificar si el correo ya está registrado
    const emailExists = await User.findOne({where:{email} });
    if (emailExists) {
        return res.status(400).json(["No se pudo completar el registro"]);
    }

    // Generar código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: passwordHash,
      username,
      nombre,
      apellidos,
      verificationCode, // Guardar el código de verificación
      isVerified: false, // No está verificado aún
    });


     // Enviar correo de verificación
     await sendVerificationEmail(email, verificationCode);

    const token = await createAccessToken({ id: newUser.id }, { expiresIn: "1h" });//expira en 1 hora

     res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000, // 1 hora
    });
    // Responder con los datos del usuario creado
    res.json({
      id: newUser.id,
      username: newUser.username,
      nombre: newUser.nombre,
      apellidos: newUser.apellidos,
      email: newUser.email,
      createAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true, // Evita acceso desde JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try{
    
    const userFound = await User.findByPk(req.user.id);
    if (!userFound) {
    return res.status(400).json({ message: "Usuario no encontrado" });
    }
    return res.json({
      id: userFound.id,
      username: userFound.username,
      nombre: userFound.nombre,
      apellidos: userFound.apellidos,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
