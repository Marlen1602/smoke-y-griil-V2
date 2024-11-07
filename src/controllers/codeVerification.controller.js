import User from "../models/user.model.js";
import nodemaile from "nodemailer";

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemaile.createTransport({
    service: "Gmail",
    auth: {
      user: "marlen04h@gmail.com",
      pass: "hcxi yvbl flvl ivbd",
    },
    // !Quitas esto si ati si te envian bien los correos
    tls: {
      rejectUnauthorized: false, // Desactiva la validación del certificado
    },
  });

  console.log(transporter);

  const mailOptions = {
    from: "Somoke&Grill@gmail.com",
    to: email,
    subject: "restablecer contraseña",
    text: `Tu código para restablecer la contraseña es: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCodeForReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // generar un JWT para el usuario
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // enviar el email con el JWT
    await sendVerificationEmail(email, verificationCode);

    //coockie con el correo

    // agregar el JWT al usuario en la base de datos
    user.resetPasswordToken = verificationCode;
    await user.save();

    

     res.json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyCode = async (req, res) => {
  const { code, email } = req.body;
 

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });
   
    if (user.resetPasswordToken === code) {
      user.resetPasswordToken = undefined; // Eliminar código después de verificado
      user.isVeriedForResetPassword = true;
      await user.save();

      return res.json({ message: "codigo verificado exitosamente" });
    } else {
      return res
        .status(400)
        .json({ message: "Código de verificación incorrecto" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
