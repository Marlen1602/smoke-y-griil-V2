import Incidencia from "../models/incidencia.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import TipoUsuario from "../models/TipoUsuario.js";

export const getUserByEmail =  async ( req, res) => {
   //sacar el email del parametro
   const { email } = req.params; // Sacar el email del parámetro

  try {
    // Buscar el usuario en Sequelize
    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Error al buscar usuario por email:", error.message);
    return res.status(500).json({ message: "Error al buscar el usuario" });
  }
};

export const updatePassword = async (req, res) => {
   const { email, password } = req.body;
   try {
      // Verificar si el usuario existe
      const userFound = await User.findOne({where: { email} });
  
      if (!userFound) {
        return res.status(404).json({ message: "El usuario no existe" });
      }
  
      // Verificar si la cuenta está bloqueada
      if (userFound.isBlocked) {
        return res.status(403).json({ 
          message: "Tu cuenta está bloqueada. No puedes cambiar la contraseña." 
        });
      }
  
      // Comparar la nueva contraseña con la actual
      const isSamePassword = await bcrypt.compare(password, userFound.password);
      if (isSamePassword) {
        return res.status(400).json({ 
          message: "La nueva contraseña no puede ser igual a la contraseña actual." 
        });
      }
  
      // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await userFound.update({ password: hashedPassword });
  
      // Crear la incidencia con los campos correctos
     try {
      await Incidencia.create({
        usuario: userFound.username, // Asegúrate de que userFound.username exista
        tipo: "Cambio de contraseña",
        estado: false, // La cuenta no está bloqueada
        motivo: "El usuario ha cambiado su contraseña con éxito",
        fecha: new Date(), // La fecha actual
      });
      } catch (error) {
        console.error("Error al guardar la incidencia:", error.message, error.errors);
        // No rompemos el flujo de la aplicación
      }
  
      return res.status(200).json({ updated: true });
  
    } catch (error) {
      console.error("Error completo en updatePassword:", error.message, error.stack);
      return res.status(500).json({ message: "Error interno del servi" });
    }
  };

// Obtener lista de usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
            attributes: ["id", "nombre","tipoUsuarioId", "email", "isBlocked"] // Ajusta los atributos
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ message: "Error al obtener usuarios." });
  }
};




