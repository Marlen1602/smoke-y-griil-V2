import { Router } from 'express';
import {
  guardarVentas,
  obtenerVentas,
  obtenerCarnePorSemana,
  obtenerPredicciones
} from '../controllers/ventas.controller.js';

const router = Router();

router.post('/ventas', guardarVentas);
router.get('/ventas', obtenerVentas);
router.get('/carne-por-semana', obtenerCarnePorSemana);
router.get('/predicciones', obtenerPredicciones);

export default router;
