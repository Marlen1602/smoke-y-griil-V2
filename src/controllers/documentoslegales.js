import DocumentoLegal from "../models/documentoslegales.js";

// 📌 Obtener todos los documentos legales
export const obtenerDocumentos = async (req, res) => {
    try {
        const documentos = await DocumentoLegal.findAll();
        res.json(documentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los documentos legales" });
    }
};

// 📌 Obtener un documento por ID
export const obtenerDocumentoPorId = async (req, res) => {
    try {
        const documento = await DocumentoLegal.findByPk(req.params.id);
        if (!documento) return res.status(404).json({ error: "Documento no encontrado" });

        res.json(documento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el documento" });
    }
};

// 📌 Crear un nuevo documento legal
export const crearDocumento = async (req, res) => {
    try {
        const { nombre, contenido } = req.body;

        if (!nombre || !contenido) {
            return res.status(400).json({ error: "El nombre y contenido son obligatorios" });
        }

        const nuevoDocumento = await DocumentoLegal.create({ 
            nombre, 
            contenido, 
            fecha_actualizacion: new Date()
        });

        res.status(201).json(nuevoDocumento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el documento" });
    }
};

// 📌 Actualizar un documento legal
export const actualizarDocumento = async (req, res) => {
    try {
        const { nombre, contenido } = req.body;
        const documento = await DocumentoLegal.findByPk(req.params.id);

        if (!documento) return res.status(404).json({ error: "Documento no encontrado" });

        await documento.update({ 
            nombre, 
            contenido,
            fecha_actualizacion: new Date()
        });

        res.json(documento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el documento" });
    }
};

// 📌 Eliminar un documento legal
export const eliminarDocumento = async (req, res) => {
    try {
        const documento = await DocumentoLegal.findByPk(req.params.id);
        if (!documento) return res.status(404).json({ error: "Documento no encontrado" });

        await documento.destroy();
        res.json({ message: "Documento eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
};
