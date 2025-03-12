import Politica from "../models/politicas.model.js";

// Obtener todas las políticas vigentes
export const getPoliticas = async (req, res) => {
  try {
    const politicas = await Politica.find({ isDeleted: false });
    res.json(politicas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las políticas" });
  }
};

// Crear nueva política
export const createPolitica = async (req, res) => {
  try {
    const { title, descripcion, fechaVigencia } = req.body;
    const newPolitica = new Politica({
      title,
      descripcion,
      fechaVigencia,
      version: 1, // Inicialmente versión 1
      isDeleted: false
    });
    const savedPolitica = await newPolitica.save();
    res.json(savedPolitica);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la política" });
  }
};

// Obtener una política específica
export const getPolitica = async (req, res) => {
  try {
    const politica = await Politica.findById(req.params.id);
    if (!politica) {return res.status(404).json({ message: "Política no encontrada" });}
    res.json(politica);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la política" });
  }
};

// Actualizar política y mantener historial de versiones
export const updatePolitica = async (req, res) => {
  try {
    const { title, descripcion, fechaVigencia } = req.body;
    const politica = await Politica.findById(req.params.id);
    if (!politica) {return res.status(404).json({ message: "Política no encontrada" });}

    // Guardar versión actual en historial
    await Politica.create({
      originalPolicyId: politica._id,
      title: politica.title,
      descripcion: politica.descripcion,
      fechaVigencia: politica.fechaVigencia,
      version: politica.version,
      isDeleted: true // Marcada como "no vigente" en historial
    });

    // Actualizar política con nueva versión
    politica.title = title;
    politica.descripcion = descripcion;
    politica.fechaVigencia = fechaVigencia;
    politica.version += 1; // Incrementar versión
    const updatedPolitica = await politica.save();

    res.json(updatedPolitica);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la política" });
  }
};

// Eliminación lógica
export const deletePolitica = async (req, res) => {
  try {
    const politica = await Politica.findById(req.params.id);
    if (!politica) {return res.status(404).json({ message: "Política no encontrada" });}
    politica.isDeleted = true;
    await politica.save();
    res.json({ message: "Política marcada como eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la política" });
  }
};

// Obtener historial de versiones
export const getPolicyHistory = async (req, res) => {
  try {
    const policyId = req.params.id;
    const history = await Politica.find({ originalPolicyId: policyId, isDeleted: true }).sort({ version: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el historial de la política" });
  }
};



  
