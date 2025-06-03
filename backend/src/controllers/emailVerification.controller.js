import User from "../models/user.model.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;


    try {
      const user = await User.findOne({ where: {email} });
      if (!user) {
        logger.warn("Intento de verificación de correo con email no registrado", { email });
      await logSecurityEvent(email, "Verificación de correo fallida", true, "Correo no registrado");
       return res.status(400).json({ message: "Usuario no encontrado" });}

      if (user.verificationCode === code) {
        user.isVerified = true;
        user.verificationCode = undefined; // Eliminar código después de verificado
        await user.save();
        logger.info("Correo verificado exitosamente", { usuario: user.username });

      await logSecurityEvent(
        user.username,
        "Verificación de correo",
        false,
        "Correo electrónico verificado correctamente"
      );

        return res.json({ message: "Correo verificado exitosamente" });
      } else {
        logger.warn("Código de verificación incorrecto", { usuario: user.username });

      await logSecurityEvent(
        user.username,
        "Verificación de correo fallida",
        true,
        "Código incorrecto proporcionado"
      );
        return res.status(400).json({ message: "Código de verificación incorrecto" });
      }
    } catch (error) {
      logger.error("Error interno al verificar correo", { error: error.message });
      return res.status(500).json({ message: error.message });
    }
  };
  