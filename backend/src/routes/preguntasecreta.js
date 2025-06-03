import { Router } from "express";
import {obtenerPreguntasSecretas,
    obtenerPreguntaSecretaPorCorreo,
    verificarRespuestaSecreta,
    verificarTokenReset,
    restablecerContrasena} from "../controllers/preguntasecreta.js";

const router = Router();

router.get("/preguntas-secretas", obtenerPreguntasSecretas);
router.post("/pregunta-secreta/buscar", obtenerPreguntaSecretaPorCorreo);
router.post("/pregunta-secreta/verificar", verificarRespuestaSecreta);
router.post("/pregunta-secreta/verificar-token", verificarTokenReset);
router.put("/pregunta-secreta/restablecer-password", restablecerContrasena);

export default router;