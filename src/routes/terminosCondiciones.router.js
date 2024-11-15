
import { Router } from 'express';
import { createTerminos, getTerminos,getTermino, updateTerminos, deleteTerminos } from '../controllers/terminosCondiciones.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTerminosSchema, updateTerminosSchema } from '../schemas/terminosCondiciones.schema.js';

const router = Router();

router.post('/terminosCondiciones', authRequired, validateSchema(createTerminosSchema), createTerminos);
router.get('/terminosCondiciones', authRequired, getTerminos);
router.get('/termino', authRequired, getTermino);
router.put('/terminosCondiciones/:id', authRequired, validateSchema(updateTerminosSchema), updateTerminos);
router.delete('/terminosCondiciones/:id', authRequired, deleteTerminos);

export default router;

