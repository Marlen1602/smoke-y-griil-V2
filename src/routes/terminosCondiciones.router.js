import { Router } from 'express';
import {
    getTerminosCondiciones,
    createTerminosCondiciones,
    getTerminosCondicionesById,
    updateTerminosCondiciones,
    deleteTerminosCondiciones,
    getTerminosCondicionesHistory
} from '../controllers/terminosCondiciones.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/terminosCondiciones', authRequired, getTerminosCondiciones);
router.post('/terminosCondiciones', authRequired, createTerminosCondiciones);
router.get('/terminosCondiciones/:id', authRequired, getTerminosCondicionesById);
router.put('/terminosCondiciones/:id', authRequired, updateTerminosCondiciones);
router.delete('/terminosCondiciones/:id', authRequired, deleteTerminosCondiciones);
router.get('/terminosCondiciones/history/:id', authRequired, getTerminosCondicionesHistory);

export default router;


