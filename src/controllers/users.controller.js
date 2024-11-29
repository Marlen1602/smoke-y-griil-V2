import Incidencia from "../models/incidencia.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';


export const getUserByEmail =  async ( req, res) => {
   //sacar el email del parametro
   const { email } = req.params;
   const userFound = await User.findOne({ email });
   
   if(!userFound) return res.status(404).json({ message: 'El usuario no existe' });
   return res.status(200).json({"exists":true});
}

export const updatePassword = async (req, res) => {
   const { email, password } = req.body;

   const userFound = await User.findOne({ email });
   if(!userFound) return res.status(404).json({ message: 'El usuario no existe' });
   userFound.password = await bcrypt.hash(password, 10);
   await userFound.save();
   // Crear y guardar la incidencia cuando el usuario inicie sesión
   const incidencia = new Incidencia({
      usuario: `${userFound.username}` ,
      tipo: 'Cambio de contraseña',
    });

    // Guardar la incidencia en la base de datos
    await incidencia.save();
   return res.status(200).json({"updated":true});


}