import prisma from "../db.js";
import bcrypt from "bcryptjs";
import logger, { logSecurityEvent } from "../libs/logger.js";

export const getUserByEmail =  async ( req, res) => {
   //sacar el email del parametro
   const { email } = req.params; // Sacar el email del parámetro

  try {
    // Buscar el usuario en Sequelize
    const userFound = await prisma.users.findUnique({ where: { email } });

    if (!userFound) {
      logger.warn("Usuario no encontrado por email", { email });
      return res.status(404).json({ message: "El usuario no existe" });
    }
    logger.info("Usuario encontrado por email", { email });
    return res.status(200).json({ exists: true });
  } catch (error) {
    logger.error("Error al buscar usuario por email", { error: error.message });
    return res.status(500).json({ message: "Error al buscar el usuario" });
  }
};

export const updatePassword = async (req, res) => {
   const { email, password } = req.body;
   try {
      // Verificar si el usuario existe
      const userFound = await prisma.users.findUnique({where: { email} });
  
      if (!userFound) {
        logger.warn("Intento de cambio de contraseña con email inexistente", { email });
        return res.status(404).json({ message: "El usuario no existe" });
      }
  
      // Verificar si la cuenta está bloqueada
      if (userFound.isBlocked) {
        logger.warn("Intento de cambio de contraseña estando bloqueado", { usuario: userFound.username });
      await logSecurityEvent(
        userFound.username,
        "Cambio de contraseña fallido",
        true,
        "La cuenta está bloqueada"
      );
        return res.status(403).json({ 
          message: "Tu cuenta está bloqueada. No puedes cambiar la contraseña." 
        });
      }
  
      // Comparar la nueva contraseña con la actual
      const isSamePassword = await bcrypt.compare(password, userFound.password);
      if (isSamePassword) {
        logger.warn("Nueva contraseña igual a la actual", { usuario: userFound.username });
      await logSecurityEvent(
        userFound.username,
        "Intento de cambio de contraseña fallido",
        true,
        "La nueva contraseña era igual a la actual"
      );
        return res.status(400).json({ 
          message: "La nueva contraseña no puede ser igual a la contraseña actual." 
        });
      }
  
      // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword }
    });

    logger.info("Contraseña actualizada correctamente", { usuario: userFound.username });

    await logSecurityEvent(
      userFound.username,
      "Cambio de contraseña",
      false,
      "El usuario cambió su contraseña con éxito"
    );
      // Crear la incidencia con los campos correctos
     try {
      await prisma.incidencia.create({
        data: {
          usuario: userFound.username,
          tipo: "Cambio de contraseña",
          estado: false,
          motivo: "El usuario ha cambiado su contraseña con éxito",
          fecha: new Date()
        }
      });
      } catch (error) {
        logger.error("Error al guardar incidencia local", { error: error.message });
        // No rompemos el flujo de la aplicación
      }
  
      return res.status(200).json({ updated: true });
  
    } catch (error) {
      logger.error("Error completo en updatePassword", { error: error.message });
      return res.status(500).json({ message: "Error interno del servi" });
    }
  };

// Obtener lista de usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        nombre: true,
        tipoUsuarioId: true,
        email: true,
        isBlocked: true,
      },
    });
    
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Error al obtener usuarios", { error: error.message });
    return res.status(500).json({ message: "Error al obtener usuarios." });
  }
};

export const agregarPreguntaSecreta = async (req, res) => {
  try {
    const  id  = req.user.id;
    const { preguntaSecretaId, respuestaSecreta } = req.body;

    if (!preguntaSecretaId || !respuestaSecreta) {
      logger.warn("Campos incompletos al guardar pregunta secreta", { userId: id });
      return res.status(400).json({ message: "La pregunta y respuesta son obligatorias" });
    }

    const usuario = await prisma.users.findUnique({
      where: { id },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

     await prisma.users.update({
      where: { id },
      data: {
        preguntaSecretaId: parseInt(preguntaSecretaId),
        respuestaSecreta,
      },
    });
    logger.info("Pregunta secreta asignada", { usuario: usuario.username });

    await logSecurityEvent(
      usuario.username,
      "Asignación de pregunta secreta",
      false,
      "El usuario configuró su pregunta secreta"
    );
    res.json({ message: "Pregunta secreta guardada correctamente" });
  } catch (error) {
    logger.error("Error al guardar pregunta secreta", { error: error.message });
    res.status(500).json({ message: "Error al guardar pregunta secreta" });
  }
};



