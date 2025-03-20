import { Router } from "express";
import { 
    obtenerDocumentos, 
    obtenerDocumentoPorId, 
    crearDocumento, 
    actualizarDocumento, 
    eliminarDocumento 
} from "../controllers/documentoslegales.js";

const router = Router();

router.get("/documentos_legales", obtenerDocumentos);
router.get("/documentos_legales/:id", obtenerDocumentoPorId);
router.post("/documentos_legales", crearDocumento);
router.put("/documentos_legales/:id", actualizarDocumento);
router.delete("/documentos_legales/:id", eliminarDocumento);

export default router;
