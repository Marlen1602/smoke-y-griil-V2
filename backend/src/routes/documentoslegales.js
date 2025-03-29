import { Router } from "express";
import { 
    obtenerDocumentos, 
    obtenerDocumentoPorId, 
    crearDocumento, 
    actualizarDocumento, 
    eliminarDocumento 
} from "../controllers/documentoslegales.js";
import { authRequired, adminRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/documentos_legales", obtenerDocumentos);
router.get("/documentos_legales/:id",authRequired, obtenerDocumentoPorId);
router.post("/documentos_legales", authRequired, adminRequired,crearDocumento);
router.put("/documentos_legales/:id",authRequired, adminRequired, actualizarDocumento);
router.delete("/documentos_legales/:id", authRequired, adminRequired,eliminarDocumento);

export default router;
