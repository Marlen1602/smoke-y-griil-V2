import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import User from '../models/user.model.js';

export const authRequired =  async (req,res) =>{

   
    const {token}=req.cookies;
   
    if(!token)
        return res.status(401).json({message:"No token, authentication denied"});
    
    const user = jwt.verify(token, TOKEN_SECRET);

    if(!user)
        return res.status(401).json({message:"Invalid token, authentication denied"});

    // Buscar al usuario en la base de datos
    const userDb = await User.findById(user.id);


    if(!userDb.isVerified) return res.status(401).json({message:"User not verified", isVerified:userDb.isVerified});

    if(!userDb)
        return res.status(401).json({message:"Invalid token, authentication denied"});

    // id con la informacion del usuario y token
    req.user = {
        id: userDb._id,
        username: userDb.username,
        nombre: userDb.nombre,
        apellidos: userDb.apellidos,
        email: userDb.email,
        createAt: userDb.createdAt,
        updatedAt: userDb.updatedAt,
        iat: user.iat,
        exp: user.exp,
    };
    
    return  res.json({
        id: userDb._id,
        username: userDb.username,
        nombre: userDb.nombre,
        apellidos: userDb.apellidos,
        email: userDb.email,
        createAt: userDb.createdAt,
        updatedAt: userDb.updatedAt,
        iat: user.iat,
        exp: user.exp 
      });
};