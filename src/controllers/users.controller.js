import User from "../models/user.model.js";

export const getUserByEmail =  async ( req, res) => {
   //sacar el email del parametro
   const { email } = req.params;
   const userFound = await User.findOne({ email });
   
   if(!userFound) return res.status(404).json({ message: 'El usuario no existe' });
   return res.status(200).json({"exists":true});
}