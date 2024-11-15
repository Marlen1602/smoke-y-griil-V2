import TerminosCondiciones from '../models/terminosCondiciones.model.js';

export const getTermino = async (req, res) => {
    try {
        const termino = await TerminosCondiciones.findById(req.params.id);
        if (!termino) return res.status(404).json({ message: "Termino no encontrado" });
        res.json(termino);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el termino" });
    }
};


export const createTerminos = async (req, res) => {
  try {
    const { titulo, contenido, fechaVigencia } = req.body;
    const nuevoTermino = new TerminosCondiciones({ titulo, contenido, fechaVigencia });
    await nuevoTermino.save();
    res.status(201).json(nuevoTermino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTerminos = async (req, res) => {
  try {
    const terminos = await TerminosCondiciones.find({ eliminado: false, vigente: true });
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTerminos = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, fechaVigencia } = req.body;

    await TerminosCondiciones.findByIdAndUpdate(id, { vigente: false });

    const terminoAnterior = await TerminosCondiciones.findById(id);
    const nuevaVersion = parseFloat(terminoAnterior.version) + 1.0;

    const nuevoTermino = new TerminosCondiciones({
      titulo: terminoAnterior.titulo,
      contenido,
      fechaVigencia,
      version: nuevaVersion.toFixed(1),
      vigente: true,
    });

    await nuevoTermino.save();
    res.json(nuevoTermino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTerminos = async (req, res) => {
  try {
    const { id } = req.params;
    await TerminosCondiciones.findByIdAndUpdate(id, { eliminado: true, vigente: false });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
