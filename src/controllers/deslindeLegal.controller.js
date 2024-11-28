import DeslindeLegal from "../models/deslindeLegal.model.js";

export const getDeslindeLegal = async (req, res) => {
  try {
    const docs = await DeslindeLegal.find({ isDeleted: false });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los documentos de deslinde legal" });
  }
};

export const createDeslindeLegal = async (req, res) => {
  try {
    const { title, descripcion, fechaVigencia } = req.body;
    const newDoc = new DeslindeLegal({
      title,
      descripcion,
      fechaVigencia,
      version: 1,
      isDeleted: false,
    });
    const savedDoc = await newDoc.save();
    res.json(savedDoc);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el documento de deslinde legal" });
  }
};

export const updateDeslindeLegal = async (req, res) => {
  try {
    const { title, descripcion, fechaVigencia } = req.body;
    const doc = await DeslindeLegal.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    await DeslindeLegal.create({
      originalDocumentId: doc._id,
      title: doc.title,
      descripcion: doc.descripcion,
      fechaVigencia: doc.fechaVigencia,
      version: doc.version,
      isDeleted: true,
    });

    doc.title = title;
    doc.descripcion = descripcion;
    doc.fechaVigencia = fechaVigencia;
    doc.version += 1;
    const updatedDoc = await doc.save();

    res.json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el documento de deslinde legal" });
  }
};

export const deleteDeslindeLegal = async (req, res) => {
  try {
    const doc = await DeslindeLegal.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    doc.isDeleted = true;
    await doc.save();

    res.json({ message: "Documento marcado como eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el documento de deslinde legal" });
  }
};

export const getDeslindeLegalHistory = async (req, res) => {
  try {
    const history = await DeslindeLegal.find({ originalDocumentId: req.params.id, isDeleted: true }).sort({ version: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el historial del documento de deslinde legal" });
  }
};
