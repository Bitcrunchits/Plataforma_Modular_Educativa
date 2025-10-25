import { Router } from 'express';
import { 
    createMatriculaController, 
    getMatriculasByUserIdController, 
    getMatriculasByMateriaController 
} from './matricula.controller.js'; 
import { authMiddleware, checkRole } from '../../middlewares/auth.middleware.js'; // <-- Importación corregida y unificada


const matriculaRouter = Router();

// =========================================================================
// !RUTAS PRIVADAS (Requieren Autenticación JWT)
// =========================================================================

// POST /api/matriculas
// Uso: Registrar un alumno a una materia. (Acceso: Solo Profesor/Admin)
// Body: { id_usuario: number, id_materia: number }
matriculaRouter.post(
    '/',
    authMiddleware, // 1. Autenticar (usa req.user)
    checkRole(['profesor', 'admin']), // 2. Verificar rol (usa req.user.rol)
    createMatriculaController
);

// GET /api/matriculas/mine
// USO: Obtener las matrículas (materias) del usuario autenticado (el alumno).
//*La ruta /mine es la más eficiente porque se autocarga con la identidad del usuario a través del token JWT.
matriculaRouter.get(
    '/mine',
    authMiddleware, // <-- ¡Middleware de AUTENTICACIÓN aplicado!
    getMatriculasByUserIdController
);

// GET /api/matriculas/by-materia/:id_materia
// USO: Obtener TODOS los alumnos matriculados en una materia específica.
// Acceso: Solo Profesor o Admin (con validación posterior de que sea SU materia).
matriculaRouter.get(
    '/by-materia/:id_materia',
    authMiddleware,
    checkRole(['profesor', 'admin']), // Solo profesores o admins pueden pedir listas de alumnos
    getMatriculasByMateriaController
);


export default matriculaRouter;
