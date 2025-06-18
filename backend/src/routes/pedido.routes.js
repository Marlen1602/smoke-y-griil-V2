import express from "express";
import { 
  registrarPedido, 
  obtenerPedidos, 
  actualizarEstadoPedido,
  obtenerTodosLosProductos,
  obtenerPedidosUsuario,
  obtenerPedidosPorUsername
} from '../controllers/pedido.controller.js';

const router = express.Router();

// Rutas existentes
router.post('/pedidos', registrarPedido);
router.get('/pedidos', obtenerPedidos);
router.put('/pedidos/:id/estado', actualizarEstadoPedido);

// Rutas nuevas para debugging
router.get('/productos-debug', obtenerTodosLosProductos);
router.get('/pedidos/usuario/:usuarioId',obtenerPedidosUsuario);
router.get("/pedido/:username", obtenerPedidosPorUsername);
export default router;
