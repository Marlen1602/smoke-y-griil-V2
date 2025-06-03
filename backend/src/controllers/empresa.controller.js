import Empresa from "../models/empresa.model.js";
import RedesSociales from "../models/redes.Model.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener el perfil de la empresa
export const getEmpresaProfile = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({
      where: { ID_empresa: 1 }, // 🔹 Solo hay una empresa
     });

    if (!empresa) {
      logger.warn("Perfil de empresa no encontrado", {
        usuario: req.user?.username || "Anónimo",
      });
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Hacemos una segunda consulta para obtener las redes sociales
    const redesSociales = await RedesSociales.findAll({
      where: { ID_empresa: empresa.ID_empresa },
    });
        res.json({
      ...empresa.toJSON(),
      RedesSociales: redesSociales, 
    });

  } catch (error) {
    logger.error("Error al obtener el perfil de la empresa", {
      error: error.message,
    });
    res.status(500).json({ message: "Error al obtener el perfil de la empresa", error: error.message });
  }
};


// Actualizar el perfil de la empresa
export const updateEmpresaProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.user?.username || "Anónimo";
    const { Nombre, Eslogan, Mision, Vision, Direccion,Horario, Logo } = req.body; // Los campos deben coincidir con el modelo en Sequelize

    // Buscar si la empresa existe
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      logger.warn("Intento de actualizar empresa inexistente", { id, usuario });

      await logSecurityEvent(
        usuario,
        "Intento fallido de actualización de perfil de empresa",
        true,
        `ID ${id} no encontrada`
      );
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Actualizar los datos de la empresa
    await empresa.update({
      Nombre,
      Eslogan,
      Mision,
      Vision,
      Direccion,
      Horario,
      Logo: req.file?.path || empresa.Logo, // Si hay un nuevo logo, actualizarlo
    });
    logger.info("Perfil de empresa actualizado", { usuario, empresaId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de perfil de empresa",
      false,
      "Información institucional modificada"
    ); 
    res.json({ message: "Perfil de empresa actualizado correctamente", empresa });
  } catch (error) {
    logger.error("Error al actualizar el perfil de la empresa", {
      error: error.message,
      usuario,
    });
    res.status(500).json({ message: "Error al actualizar el perfil de la empresa", error: error.message });
  }
};





