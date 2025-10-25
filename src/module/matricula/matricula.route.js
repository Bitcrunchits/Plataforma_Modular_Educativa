import { Router } from 'express';
import passport from 'passport'; // Para autenticación
import { createMatriculaController } from './matricula.controller.js';
import { checkRole } from '../../middlewares/auth.middleware.js'; //  middleware para checkear roles

/**
 * @fileoverview Rutas para la gestión de matrículas.
 * Utiliza el prefijo '/api/matriculas' definido en App.js.
 */

const router = Router();

// Middleware de autenticación global para estas rutas
const authenticate = passport.authenticate('jwt', { session: false });

/**
 * RUTA: POST /api/matriculas
 * Descripción: Crea una nueva matrícula de un alumno a una materia.
 * Acceso: Solo para 'profesor' o 'admin'.
 * Body: { id_usuario: number, id_materia: number }
 */
router.post(
    '/',
    authenticate, // 1. Autenticar al usuario (obtiene req.user)
    checkRole(['profesor', 'admin']), // 2. Verificar que el usuario tenga rol autorizado
    createMatriculaController // 3. Ejecutar la lógica de creación
);


export default router;