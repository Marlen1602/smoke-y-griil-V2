import Politica from '../models/politicas.model.js';

export const getPoliticas = async (req, res) => {
    try {
        const politicas = await Politica.find();
        res.json(politicas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las políticas" });
    }
};

export const createPolitica = async (req, res) => {
    try {
        const { title, descripcion } = req.body;
        const newPolitica = new Politica({ title, descripcion });
        const savedPolitica = await newPolitica.save();
        res.json(savedPolitica);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la política" });
    }
};

export const getPolitica = async (req, res) => {
    try {
        const politica = await Politica.findById(req.params.id);
        if (!politica) return res.status(404).json({ message: "Política no encontrada" });
        res.json(politica);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la política" });
    }
};

export const deletePolitica = async (req, res) => {
    try {
        const politica = await Politica.findByIdAndDelete(req.params.id);
        if (!politica) return res.status(404).json({ message: "Política no encontrada" });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la política" });
    }
};

export const updatePolitica = async (req, res) => {
    try {
        const politica = await Politica.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!politica) return res.status(404).json({ message: "Política no encontrada" });
        res.json(politica);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la política" });
    }
};
