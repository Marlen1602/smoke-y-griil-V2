import User from "../models/user.model.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import logger, { logSecurityEvent } from "../libs/logger.js";
import dotenv from "dotenv";
import { createAccessToken } from "../libs/jwt.js";
import axios from "axios";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
dotenv.config();
export const validateRegister = [
  body("email").isEmail().withMessage("Debe proporcionar un correo electrónico válido"),
  body("username").trim().isLength({ min: 3 }).withMessage("El nombre de usuario debe tener al menos 3 caracteres"),
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellidos").trim().notEmpty().withMessage("Los apellidos son obligatorios"),
  body("password"),
  body("email").normalizeEmail(), // Normaliza el email para eliminar espacios y normalizar el formato
];


//  Login de usuario con JWT
export const login = async (req, res) => {
  const { identificador, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email:identificador },
          { username: identificador } 
        ]
      }
    });
    

    // Verificar si el usuario existe
    if (!user) {
      logger.warn(`Intento de inicio de sesión con usuario inexistente: ${identificador}`);
      await logSecurityEvent(identificador, "Login fallido", true, "Usuario inexistente");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar si el usuario está bloqueado
    if (user.isBlocked) {
      const now = new Date();
      if (user.lockUntil && user.lockUntil > now) {
        logger.error(`Intento login en cuenta bloqueada usuario: ${ user.username }`);
        await logSecurityEvent(user.username, "Login en cuenta bloqueada", true, "Cuenta bloqueada");
        
        return res.status(403).json({
          message: "Ocurrió un error. Inténtalo más tarde.",
        });
      } else {
        // Desbloquear si ya pasó el tiempo de bloqueo
        await user.update({ isBlocked: false, failedAttempts: 0, lockUntil: null });
        logger.info(`Cuenta desbloqueada automáticamente al iniciar sesión usuario: ${user.username }`);
      }
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const failedAttempts = user.failedAttempts + 1;

      if (failedAttempts >= 3) {
        // Bloquear cuenta por 5 minutos
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 5);

        await user.update({ failedAttempts, isBlocked: true, lockUntil });
        logger.warn(`Cuenta bloqueada automáticamente por intentos fallidos usuario: ${user.username }`);
        await logSecurityEvent(user.username, "Bloqueo automático de cuenta", true, "Múltiples intentos fallidos");

        return res.status(403).json({
          message: "Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 5 minutos.",
        });
      } else {
        // Incrementar intentos fallidos sin bloquear aún
        await user.update({ failedAttempts });
        logger.warn(`Intento fallido de inicio de sesión usuario: ${user.username }`);
        await logSecurityEvent(user.username, "Login fallido", true, "Contraseña incorrecta");
        
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
    }

    // Si el login es exitoso, restablecer intentos fallidos
    await user.update({ failedAttempts: 0, isBlocked: false, lockUntil: null });

    //  Crear token de acceso
    const token = await createAccessToken(
      { id: user.id, tipoUsuarioId: user.tipoUsuarioId },
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    logger.info(`Inicio de sesión exitoso usuario: ${user.username }`);
    await logSecurityEvent(user.username, "Login exitoso", false, "Inicio de sesión correcto");

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      tipoUsuarioId: user.tipoUsuarioId,
      token,
    });
  } catch (error) {
    logger.error(`Error interno en el login error: ${error.message }`);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


export const unlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userFound = await User.findByPk(id);

    if (!userFound) {
      logger.warn(`Desbloqueo fallido - usuario no encontrado (ID: ${id})`);
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
    logger.error(`Error al desbloquear usuario ${error.message }`);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userFound = await User.findByPk(id);

    if (!userFound) {
      logger.warn(`Bloqueo fallido - usuario no encontrado (ID: ${id})`);
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
    logger.warn(`Intento de registro fallido por validaciones incorrectas: ${ errors.array() }`);
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

// 📌 Cerrar sesión correctamente
export const logout = (req, res) => {
  const usuario = req.user?.username || "Desconocido";
  res.clearCookie("token");
  logger.info(`Sesión cerrada correctamente - Usuario: ${usuario}`);
  return res.status(200).json({ message: "Sesión cerrada correctamente" });
};

export const profile = async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
          return res.status(400).json({ message: "Usuario no encontrado" });
      }

      res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          tipoUsuarioId: user.tipoUsuarioId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
      });

  } catch (error) {
    logger.error("Error al obtener el perfil:");
      return res.status(500).json({ message: "Error interno del servidor" });
  }
};
