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
//Funcion para cambiar el numero de telefono
export const updateTelefono = async (req, res) => {
  try {
    // Debug: Verificar que req.user existe
    console.log("req.user:", req.user)
    console.log("req.body:", req.body)

    // Verificar que el middleware authRequired funcionó correctamente
    if (!req.user || !req.user.id) {
      logger.error("Token de usuario no válido en updateTelefono", {
        user: req.user,
        headers: req.headers.authorization,
      })
      return res.status(401).json({ message: "Token de usuario no válido" })
    }

    const userId = req.user.id
    const { telefono } = req.body

    // Validar que se proporcione el teléfono
    if (!telefono) {
      logger.warn("Intento de actualizar teléfono sin proporcionar número", { userId })
      return res.status(400).json({ message: "El número de teléfono es obligatorio" })
    }

    // Validar formato del teléfono (solo números, 8-15 dígitos)
    const telefonoLimpio = telefono.toString().replace(/\D/g, "") // Convertir a string y remover caracteres no numéricos

    if (telefonoLimpio.length < 8 || telefonoLimpio.length > 15) {
      logger.warn("Formato de teléfono inválido", { userId, telefono: telefonoLimpio })
      return res.status(400).json({
        message: "El teléfono debe contener entre 8 y 15 dígitos numéricos",
      })
    }

    // Buscar el usuario por ID
    const user = await prisma.users.findUnique({
      where: { id: Number.parseInt(userId) }, // Asegurar que sea un entero
      select: { id: true, username: true, telefono: true },
    })

    if (!user) {
      logger.warn("Usuario no encontrado al actualizar teléfono", { userId })
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verificar si el teléfono es diferente al actual
    if (user.telefono === telefonoLimpio) {
      logger.info("Intento de actualizar teléfono con el mismo número", {
        usuario: user.username,
      })
      return res.status(400).json({
        message: "El nuevo número de teléfono debe ser diferente al actual",
      })
    }

    // Actualizar el teléfono
    const updatedUser = await prisma.users.update({
      where: { id: Number.parseInt(userId) },
      data: {
        telefono: telefonoLimpio,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        telefono: true,
        updatedAt: true,
      },
    })

    // Log de seguridad
    logger.info("Teléfono actualizado correctamente", {
      usuario: user.username,
      telefonoAnterior: user.telefono ? "***" + user.telefono.slice(-4) : "sin teléfono",
      telefonoNuevo: "***" + telefonoLimpio.slice(-4),
    })

    // Log de seguridad (verificar si la función existe)
    if (typeof logSecurityEvent === "function") {
      await logSecurityEvent(
        user.username,
        "Actualización de teléfono",
        false,
        "El usuario actualizó su número de teléfono",
      )
    }

    // Crear incidencia de seguridad (con manejo de errores)
    try {
      await prisma.incidencias.create({
        data: {
          usuario: user.username,
          tipo: "Actualización de teléfono",
          estado: false,
          motivo: "El usuario actualizó su número de teléfono",
          fecha: new Date(),
        },
      })
    } catch (incidenciaError) {
      logger.error("Error al guardar incidencia de actualización de teléfono", {
        error: incidenciaError.message,
        stack: incidenciaError.stack,
      })
      // No interrumpir el flujo principal
    }

    res.status(200).json({
      message: "Teléfono actualizado correctamente",
      user: updatedUser,
    })
  } catch (error) {
    logger.error("Error completo al actualizar el teléfono", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body,
    })
    res.status(500).json({
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Función para cambiar contraseña desde el perfil (nueva función)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    // Validar que se proporcionen ambas contraseñas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "La contraseña actual y la nueva contraseña son obligatorias",
      })
    }

    // Validar longitud de la nueva contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      })
    }

    // Buscar el usuario
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, username: true, password: true, isBlocked: true },
    })

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verificar si la cuenta está bloqueada
    if (user.isBlocked) {
      logger.warn("Intento de cambio de contraseña estando bloqueado", {
        usuario: user.username,
      })
      await logSecurityEvent(user.username, "Cambio de contraseña fallido", true, "La cuenta está bloqueada")
      return res.status(403).json({
        message: "Tu cuenta está bloqueada. No puedes cambiar la contraseña.",
      })
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      logger.warn("Contraseña actual incorrecta en cambio de contraseña", {
        usuario: user.username,
      })
      await logSecurityEvent(
        user.username,
        "Intento de cambio de contraseña fallido",
        true,
        "Contraseña actual incorrecta",
      )
      return res.status(400).json({
        message: "La contraseña actual es incorrecta",
      })
    }

    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      logger.warn("Nueva contraseña igual a la actual", { usuario: user.username })
      return res.status(400).json({
        message: "La nueva contraseña debe ser diferente a la actual",
      })
    }

    // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    logger.info("Contraseña actualizada correctamente desde perfil", {
      usuario: user.username,
    })

    await logSecurityEvent(
      user.username,
      "Cambio de contraseña desde perfil",
      false,
      "El usuario cambió su contraseña desde su perfil",
    )

    // Crear incidencia
    try {
      await prisma.incidencia.create({
        data: {
          usuario: user.username,
          tipo: "Cambio de contraseña desde perfil",
          estado: false,
          motivo: "El usuario cambió su contraseña desde su perfil",
          fecha: new Date(),
        },
      })
    } catch (error) {
      logger.error("Error al guardar incidencia de cambio de contraseña", {
        error: error.message,
      })
    }

    res.status(200).json({
      message: "Contraseña actualizada correctamente",
    })
  } catch (error) {
    logger.error("Error al cambiar contraseña desde perfil", {
      error: error.message,
      userId: req.user?.id,
    })
    res.status(500).json({ message: "Error interno del servidor" })
  }
}




