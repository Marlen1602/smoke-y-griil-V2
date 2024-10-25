
import User from '../models/user.model.js';

export const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
  
      if (user.verificationCode === verificationCode) {
        user.isVerified = true;
        user.verificationCode = undefined; // Eliminar código después de verificado
        await user.save();
        res.json({ message: 'Correo verificado exitosamente' });
      } else {
        res.status(400).json({ message: 'Código de verificación incorrecto' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  