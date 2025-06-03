import DocumentoLegal from "../models/documentoslegales.js";
import logger, { logSecurityEvent } from "../libs/logger.js";

// 📌 Obtener todos los documentos legales
export const obtenerDocumentos = async (req, res) => {
    try {
        const documentos = await DocumentoLegal.findAll();
        res.json(documentos);
    } catch (error) {
        logger.error("Error al obtener los documentos legales", {
            error: error.message,
            modulo: "documentoslegales.controller.js",
          });
        res.status(500).json({ error: "Error al obtener los documentos legales" });
    }
};

// 📌 Obtener un documento por ID
export const obtenerDocumentoPorId = async (req, res) => {
    try {
        const documento = await DocumentoLegal.findByPk(req.params.id);
        if (!documento) {
        logger.warn("Documento no encontrado por ID", {
            id: req.params.id,
            usuario: req.user?.username || "Anónimo",
          });
          return res.status(404).json({ error: "Documento no encontrado" });
        }
    
        res.json(documento);
    } catch (error) {
        logger.error("Error al obtener el documento legal", {
            error: error.message,
            modulo: "documentoslegales.controller.js",
          });
        res.status(500).json({ error: "Error al obtener el documento" });
    }
};

// 📌 Crear un nuevo documento legal
export const crearDocumento = async (req, res) => {
    try {
        const { nombre, contenido } = req.body;
        const usuario = req.user?.username || "Anónimo";
        if (!nombre || !contenido) {
            logger.warn("Intento de creación de documento sin campos obligatorios", { usuario });
            return res.status(400).json({ error: "El nombre y contenido son obligatorios" });
        }

        const nuevoDocumento = await DocumentoLegal.create({ 
            nombre, 
            contenido, 
            fecha_actualizacion: new Date()
        });
        logger.info("Documento legal creado correctamente", { usuario, documentoId: nuevoDocumento.id });

    await logSecurityEvent(
      usuario,
      "Creación de documento legal",
      false,
      `Documento "${nombre}" creado con ID ${nuevoDocumento.id}`
    );

        res.status(201).json(nuevoDocumento);
    } catch (error) {
        logger.error("Error al crear el documento legal", {
            error: error.message,
            modulo: "documentoslegales.controller.js",
          });
        res.status(500).json({ error: "Error al crear el documento" });
    }
};

// 📌 Actualizar un documento legal
export const actualizarDocumento = async (req, res) => {
    try {
        const { nombre, contenido } = req.body;
        const usuario = req.user?.username || "Anónimo";
        const documento = await DocumentoLegal.findByPk(req.params.id);

        if (!documento){ 
            logger.warn("Intento de actualizar documento inexistente", { id: req.params.id, usuario });
            return res.status(404).json({ error: "Documento no encontrado" });
        }
        await documento.update({ 
            nombre, 
            contenido,
            fecha_actualizacion: new Date()
        });

        logger.info("Documento legal actualizado correctamente", { id: documento.id, usuario });

    await logSecurityEvent(
      usuario,
      "Actualización de documento legal",
      false,
      `Documento ID ${documento.id} actualizado`
    );
        res.json(documento);
    } catch (error) {
        logger.error("Error al actualizar el documento legal", {
            error: error.message,
            modulo: "documentoslegales.controller.js",
          });
        res.status(500).json({ error: "Error al actualizar el documento" });
    }
};

// 📌 Eliminar un documento legal
export const eliminarDocumento = async (req, res) => {
    try {
        const documento = await DocumentoLegal.findByPk(req.params.id);
        const usuario = req.user?.username || "Anónimo";
        if (!documento) {
            logger.warn("Intento de eliminar documento inexistente", { id: req.params.id, usuario });
            return res.status(404).json({ error: "Documento no encontrado" });
        }
        await documento.destroy();
        logger.info("Documento legal eliminado correctamente", { id: req.params.id, usuario });

    await logSecurityEvent(
      usuario,
      "Eliminación de documento legal",
      true,
      `Documento "${documento.nombre}" (ID ${documento.id}) eliminado`
    );
        res.json({ message: "Documento eliminado correctamente" });
    } catch (error) {
        logger.error("Error al eliminar el documento legal", {
            error: error.message,
            modulo: "documentoslegales.controller.js",
          });
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
};
