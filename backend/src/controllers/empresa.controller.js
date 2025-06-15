import prisma from "../db.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// Obtener el perfil de la empresa
export const getEmpresaProfile = async (req, res) => {
  try {
    const empresa = await prisma.datos_empresa.findUnique({
    where: { ID_empresa: 1 }, // 🔹 Solo hay una empresa
    include: {
        redes_sociales: true, // 🔹 Incluye las redes sociales automáticamente
      },
    });

    if (!empresa) {
      logger.warn("Perfil de empresa no encontrado", {
        usuario: req.user?.username || "Anónimo",
      });
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json(empresa);

    
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
    const { Nombre, Eslogan, Mision, Vision, Direccion,Horario } = req.body; 

    // Buscar si la empresa existe
    const empresa = await prisma.datos_empresa.findUnique({
      where: { ID_empresa: parseInt(id) },
    });
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
     const empresaActualizada = await prisma.datos_empresa.update({
      where: { ID_empresa: parseInt(id) },
      data: {
      Nombre,
      Eslogan,
      Mision,
      Vision,
      Direccion,
      Horario,
      Logo: req.file?.path || empresa.Logo, // Si hay un nuevo logo, actualizarlo
      },
    });
    logger.info("Perfil de empresa actualizado", { usuario, empresaId: id });

    await logSecurityEvent(
      usuario,
      "Actualización de perfil de empresa",
      false,
      "Información institucional modificada"
    ); 
    res.json({ message: "Perfil de empresa actualizado correctamente", empresa:empresaActualizada });
  } catch (error) {
    logger.error("Error al actualizar el perfil de la empresa", {
      error: error.message,
      usuario,
    });
    res.status(500).json({ message: "Error al actualizar el perfil de la empresa", error: error.message });
  }
};





