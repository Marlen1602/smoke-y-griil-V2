import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

export const validateRegister = [
  body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('username').trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son obligatorios'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage('Debe incluir mayúsculas, minúsculas, números y caracteres especiales.'),
  body('email').normalizeEmail(), // Normaliza el email para eliminar espacios y normalizar el formato
];

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
    text: `Tu código de verificación es: ${code}`,
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


export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
      const userFound = await User.findOne({ email });
      
      if (!userFound){
        return res.status(404).json({ message: "User not found" });
      } 

      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

      const token = await createAccessToken({ id: userFound._id }, { expiresIn: '1h' });

     
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000, // 1 hora
    });
    
      return res.json({
          id: userFound._id,
          username: userFound.username,
          email: userFound.email,
          role: userFound.role,
          createAt: userFound.createdAt,
          updatedAt: userFound.updatedAt,
          token
      });
  } catch (error) {
    console.log("error")
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
