import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import * as cookie from 'cookie';
import Incidencia from '../models/incidencia.model.js'; 
import Config from "../models/config.model.js";
export const validateRegister = [
  body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('username').trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios'),
  body('password'),
  body('email').normalizeEmail(), // Normaliza el email para eliminar espacios y normalizar el formato
];

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener configuración global
    const config = await Config.findOne();
    const maxAttempts = config?.maxAttempts || 3;
    const lockDuration = config?.lockDuration || 30 * 60 * 1000; // 30 minutos

    // Verificar si la cuenta está bloqueada por tiempo
    if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((userFound.lockUntil - Date.now()) / 60000); // Minutos restantes
      
       // Registrar incidencia de cuenta bloqueada
       const incidencia = new Incidencia({
        usuario: userFound.username,
        tipo: "Intento de inicio de sesión bloqueado",
        estado: true,
        motivo: `Cuenta bloqueada. Tiempo restante: ${remainingTime} minutos`,
        fecha: new Date(),
      });
      await incidencia.save();
      
      return res.status(403).json({ 
        message: `Tu cuenta está bloqueada. Intenta nuevamente en ${remainingTime} minutos.`,
        });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      // Incrementar intentos fallidos
      userFound.failedAttempts += 1;

      // Bloquear la cuenta si llega a intentos fallidos
      if (userFound.failedAttempts >= maxAttempts) {
        userFound.lockUntil = Date.now() + lockDuration; // Establecer tiempo de bloqueo
        userFound.failedAttempts = 0; // Reiniciar intentos

         // Registrar incidencia de bloqueo
         const incidencia = new Incidencia({
          usuario: userFound.username,
          tipo: "Bloqueo de cuenta",
          estado: true,
          motivo: "Exceso de intentos fallidos",
          fecha: new Date(),
        });
        await incidencia.save();

        await userFound.save();
        return res.status(403).json({
          message: `Tu cuenta ha sido bloqueada. Intenta nuevamente en ${lockDuration / 60000} minutos.`,
        });
      }

    await userFound.save();
   
    // Registrar incidencia de intento fallido
    const incidencia = new Incidencia({
      usuario: userFound.username,
      tipo: "Intento de inicio de sesión fallido",
      estado: false,
      motivo: "Contraseña incorrecta",
      fecha: new Date(),
    });
    await incidencia.save();

    return res.status(400).json({ message: "Contraseña incorrecta" });
    }

     // Restablecer intentos fallidos y desbloquear en caso de éxito
     userFound.failedAttempts = 0;
     userFound.lockUntil = null;
     await userFound.save();
 
     // Registrar incidencia de intento exitoso
     const incidencia = new Incidencia({
       usuario: userFound.username,
       tipo: "Inicio de sesión exitoso",
       estado: false,
       motivo: "Inicio de sesión correcto",
       fecha: new Date(),
     });
     await incidencia.save();

    // Crear el token de acceso
    const token = await createAccessToken({ id: userFound._id }, { expiresIn: '1h' });

    // Establecer el token en las cookies
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    }));

    // Responder con los detalles del usuario y el token
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
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
  const { email } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Desbloquear al usuario
    userFound.failedAttempts = 0;
    userFound.isBlocked = false;
    await userFound.save();

    res.status(200).json({ message: "Usuario desbloqueado exitosamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'marlen04h@gmail.com',
      pass: 'hcxi yvbl flvl ivbd',
    },
    // !Quitas esto si ati si te envian bien los correos
    tls: {
      rejectUnauthorized: false, // Desactiva la validación del certificado
    },
  });

  console.log(transporter);

  const mailOptions = {
    from: 'Somoke&Grill@gmail.com',
    to: email,
    subject: 'Verifica tu correo electrónico',
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
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: '6LdPD2cqAAAAAI2JnFcexqN--us1l7GsaT6g59w-', 
          response: recaptchaToken,
        },
      }
    );
    if (!recaptchaResponse.data.success) {
      return res.status(400).json(["La verificación de reCAPTCHA falló"]);
    }

    const usernameExists = await User.findOne({ username });
    console.log(usernameExists)
    if (usernameExists) {
        return res.status(400).json(["El nombre de usuario ya está en uso"]);
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json(["El correo ya está registrado"]);
    }

    // Generar código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: passwordHash,
      username,
      nombre,
      apellidos,
      verificationCode, // Guardar el código de verificación
      isVerified: false, // No está verificado aún
    });

    const userSaved = await newUser.save();

     // Enviar correo de verificación
     await sendVerificationEmail(email, verificationCode);

    const token = await createAccessToken({ id: userSaved._id });

     res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000, // 1 hora
    });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      nombre: userSaved.nombre,
      apellidos: userSaved.apellidos,
      email: userSaved.email,
      createAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "User not found" });
    return res.json({
        id: userFound._id,
        username: userFound.username,
        nombre: userFound.nombre,
        apellidos: userFound.apellidos,
        email: userFound.email,
        createAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
};
