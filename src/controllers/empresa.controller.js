import Empresa from "../models/empresa.model.js";

// Obtener el perfil de la empresa
export const getEmpresaProfile = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ message: "Empresa no encontrada" });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil de la empresa", error });
  }
};

// Actualizar el perfil de la empresa
export const updateEmpresaProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slogan, socialLinks, address, contactEmail, phone } = req.body;

    const updatedEmpresa = await Empresa.findByIdAndUpdate(
      id,
      {
        title,
        slogan,
        socialLinks,
        address,
        contactEmail,
        phone,
        logo: req.file?.path, // Si se subió un archivo, usa el path proporcionado por Cloudinary
      },
      { new: true }
    );

    if (!updatedEmpresa) return res.status(404).json({ message: "Empresa no encontrada" });
    res.json(updatedEmpresa);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el perfil de la empresa", error });
  }
};




