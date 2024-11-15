import TerminosCondiciones from '../models/terminosCondiciones.model.js';

// Obtener términos y condiciones vigentes
export const getTerminosCondiciones = async (req, res) => {
    try {
        const terminos = await TerminosCondiciones.find({ isDeleted: false });
        res.json(terminos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los términos y condiciones" });
    }
};

// Crear nuevos términos y condiciones
export const createTerminosCondiciones = async (req, res) => {
    try {
        const { title, descripcion, fechaVigencia } = req.body;
        const newTerminos = new TerminosCondiciones({
            title,
            descripcion,
            fechaVigencia,
            version: 1,
            isDeleted: false
        });
        const savedTerminos = await newTerminos.save();
        res.json(savedTerminos);
    } catch (error) {
        res.status(500).json({ message: "Error al crear los términos y condiciones" });
    }
};

// Obtener términos y condiciones específicos
export const getTerminosCondicionesById = async (req, res) => {
    try {
        const terminos = await TerminosCondiciones.findById(req.params.id);
        if (!terminos) return res.status(404).json({ message: "Términos y condiciones no encontrados" });
        res.json(terminos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los términos y condiciones" });
    }
};

// Actualizar términos y condiciones
export const updateTerminosCondiciones = async (req, res) => {
    try {
        const { title, descripcion, fechaVigencia } = req.body;
        const terminos = await TerminosCondiciones.findById(req.params.id);
        if (!terminos) return res.status(404).json({ message: "Términos y condiciones no encontrados" });

        // Crear versión histórica
        await TerminosCondiciones.create({
            originalPolicyId: terminos._id,
            title: terminos.title,
            descripcion: terminos.descripcion,
            fechaVigencia: terminos.fechaVigencia,
            version: terminos.version,
            isDeleted: true
        });

        // Actualizar a la nueva versión
        terminos.title = title;
        terminos.descripcion = descripcion;
        terminos.fechaVigencia = fechaVigencia;
        terminos.version += 1;
        const updatedTerminos = await terminos.save();

        res.json(updatedTerminos);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar los términos y condiciones" });
    }
};

// Eliminar términos y condiciones (lógicamente)
export const deleteTerminosCondiciones = async (req, res) => {
    try {
        const terminos = await TerminosCondiciones.findById(req.params.id);
        if (!terminos) return res.status(404).json({ message: "Términos y condiciones no encontrados" });

        terminos.isDeleted = true;
        await terminos.save();

        res.json({ message: "Términos y condiciones marcados como eliminados" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar los términos y condiciones" });
    }
};

// Obtener historial de términos y condiciones
export const getTerminosCondicionesHistory = async (req, res) => {
    try {
        const history = await TerminosCondiciones.find({ originalPolicyId: req.params.id, isDeleted: true }).sort({ version: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el historial de términos y condiciones" });
    }
};
