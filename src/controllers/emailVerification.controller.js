
import User from '../models/user.model.js';

export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;


    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

      if (user.verificationCode === code) {
        user.isVerified = true;
        user.verificationCode = undefined; // Eliminar código después de verificado
        await user.save();
        return res.json({ message: 'Correo verificado exitosamente' });
      } else {
        
        return res.status(400).json({ message: 'Código de verificación incorrecto' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  