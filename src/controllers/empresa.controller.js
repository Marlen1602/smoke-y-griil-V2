import Empresa from "../models/empresa.model.js";
import RedesSociales from "../models/redes.Model.js";

// Obtener el perfil de la empresa
export const getEmpresaProfile = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({
      where: { ID_empresa: 1 }, // 🔹 Solo hay una empresa
      include: [
        {
          model: RedesSociales,
          as: "RedesSociales", // Relación definida en Sequelize
        },
      ],
    });
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json(empresa);
  } catch (error) {
    console.error("Error al obtener el perfil de la empresa:", error);
    res.status(500).json({ message: "Error al obtener el perfil de la empresa", error: error.message });
  }
};


// Actualizar el perfil de la empresa
export const updateEmpresaProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Eslogan, Mision, Vision, Direccion, Logo } = req.body; // Los campos deben coincidir con el modelo en Sequelize

    // Buscar si la empresa existe
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Actualizar los datos de la empresa
    await empresa.update({
      Nombre,
      Eslogan,
      Mision,
      Vision,
      Direccion,
      Logo: req.file?.path || empresa.Logo, // Si hay un nuevo logo, actualizarlo
    });

    res.json({ message: "Perfil de empresa actualizado correctamente", empresa });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el perfil de la empresa", error: error.message });
  }
};





