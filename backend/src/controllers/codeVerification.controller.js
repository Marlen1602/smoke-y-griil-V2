import User from "../models/user.model.js";
import nodemaile from "nodemailer";
import logger, { logSecurityEvent } from "../libs/logger.js";

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemaile.createTransport({
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
};

export const sendCodeForReset = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ where:{email} });
    if (!user) {
      logger.warn("Intento restablecimiento con correo no registrado", { email });
      await logSecurityEvent(email, "Restablecimiento contraseña fallido", true, "Correo no registrado");
       return res.status(400).json({ message: "Usuario no encontrado" });}

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
    logger.info("Código para restablecer contraseña enviado", { usuario: user.username, email });

    await logSecurityEvent(
      user.username,
      "Solicitud restablecimiento contraseña",
      false,
      "Código enviado al correo del usuario"
    );
    

     res.json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    logger.error("Error interno al enviar código de restablecimiento", { error: error.message });
    return res.status(500).json({ message: error.message });
  }
};

export const verifyCode = async (req, res) => {
  const { code, email } = req.body;
 

  try {
    const user = await User.findOne({ where:{email} });
    if (!user)
      {
        logger.warn("Intento de verificar código con correo inexistente", { email });
      await logSecurityEvent(email, "Verificación código fallida", true, "Correo no registrado");
       return res.status(400).json({ message: "Usuario no encontrado" });}
   
    if (user.resetPasswordToken === code) {
      user.resetPasswordToken = null; // Eliminar código después de verificado
      user.isVeriedForResetPassword = true;
      await user.save();
      logger.info("Código de verificación para restablecimiento correcto", { usuario: user.username });

      await logSecurityEvent(
        user.username,
        "Verificación código exitosa",
        false,
        "Usuario validado para restablecimiento de contraseña"
      );

      return res.json({ message: "codigo verificado exitosamente" });
    } else {
      logger.warn("Intento de verificación con código incorrecto", { usuario: user.username });

      await logSecurityEvent(
        user.username,
        "Verificación código fallida",
        true,
        "Código proporcionado incorrecto"
      );

      return res
        .status(400)
        .json({ message: "Código de verificación incorrecto" });
    }
  } catch (error) {
    logger.error("Error interno al verificar código", { error: error.message });
    return res.status(500).json({ message: error.message });
  }
};
