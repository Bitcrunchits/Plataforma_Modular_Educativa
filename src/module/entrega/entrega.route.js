import { Router } from 'express';
import { createEntregaHandler, calificarEntregaHandler } from './entrega.controller.js';
import { authMiddleware, checkRole } from '../../middlewares/auth.middleware.js';

const router = Router();


// =========================================================
// RUTAS DEL MÓDULO ENTREGA
// =========================================================

router.post(
    '/',
    authMiddleware,
    checkRole(['alumno']),
    createEntregaHandler 
);


// GET /api/entregas/tarea/:id_tarea: Listar todas las entregas para una tarea (solo PROFESORES/ADMINS)
router.get(
    '/tarea/:id_tarea',
    authMiddleware,
    checkRole(['profesor', 'admin']),
    (req, res, next) => { console.log("Middleware para obtener entregas por tarea..."); next(); }

);

// POST /api/entregas/:id_entrega/calificar: Calificar una entrega (solo PROFESORES/ADMINS)
router.post(
    '/:id_entrega/calificar',
    authMiddleware,
    checkRole(['profesor', 'admin']),
    calificarEntregaHandler 
);

// GET /api/entregas/:id_entrega: Obtener detalles de una entrega específica (usar si el controller lo necesita)
router.get(
    '/:id_entrega',
    authMiddleware,
    checkRole(['alumno', 'profesor', 'admin']),
    createEntregaHandler
);


export default router;
