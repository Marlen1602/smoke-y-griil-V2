import { Router } from 'express';
import { createDeslinde, getDeslinde,getDeslindeLegal, updateDeslinde, deleteDeslinde } from '../controllers/deslindeLegal.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createDeslindeSchema, updateDeslindeSchema } from '../schemas/deslindeLegal.schema.js';

const router = Router();

router.post('/deslindeLegal', authRequired, validateSchema(createDeslindeSchema), createDeslinde);
router.get('/deslindes', authRequired, getDeslinde);
router.get('/deslindeLegal', authRequired, getDeslindeLegal);
router.put('/deslindeLegal/:id', authRequired, validateSchema(updateDeslindeSchema), updateDeslinde);
router.delete('/deslindeLegal/:id', authRequired, deleteDeslinde);

export default router;
