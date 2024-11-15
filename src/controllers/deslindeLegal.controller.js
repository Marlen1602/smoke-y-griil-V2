import DeslindeLegal from '../models/deslindeLegal.model.js';

export const createDeslinde = async (req, res) => {
  try {
    const { titulo, contenido, fechaVigencia } = req.body;
    const nuevoDeslinde = new DeslindeLegal({ titulo, contenido, fechaVigencia });
    await nuevoDeslinde.save();
    res.status(201).json(nuevoDeslinde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeslinde = async (req, res) => {
  try {
    const deslindes = await DeslindeLegal.find({ eliminado: false, vigente: true });
    res.json(deslindes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeslindeLegal = async (req, res) => {
    try {
        const deslinde = await DeslindeLegal.findById(req.params.id);
        if (!deslinde) return res.status(404).json({ message: "Deslinde legal no encontrado" });
        res.json(deslinde);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el Deslinde legal" });
    }
};

export const updateDeslinde = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, fechaVigencia } = req.body;

    await DeslindeLegal.findByIdAndUpdate(id, { vigente: false });

    const deslindeAnterior = await DeslindeLegal.findById(id);
    const nuevaVersion = parseFloat(deslindeAnterior.version) + 1.0;

    const nuevoDeslinde = new DeslindeLegal({
      titulo: deslindeAnterior.titulo,
      contenido,
      fechaVigencia,
      version: nuevaVersion.toFixed(1),
      vigente: true,
    });

    await nuevoDeslinde.save();
    res.json(nuevoDeslinde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeslinde = async (req, res) => {
  try {
    const { id } = req.params;
    await DeslindeLegal.findByIdAndUpdate(id, { eliminado: true, vigente: false });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
