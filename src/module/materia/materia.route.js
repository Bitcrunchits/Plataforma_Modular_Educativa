import { Router } from 'express';
import { createMateriaController, getMateriasByProfesorController } from './materia.controller.js';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { CreateMateriaSchema } from './dto/create-materia.dto.js';

// Inicializar el Router
const materiaRouter = Router();

// Middleware de autenticación para proteger todas las rutas del módulo Materia
materiaRouter.use(authMiddleware);

// POST /api/materias: Crear una nueva materia (Ruta privada)
materiaRouter.post('/',
    authMiddleware,
    validatorMiddleware(CreateMateriaSchema, 'body'),
    createMateriaController
);

// GET /api/materias: Obtener todas las materias del profesor autenticado (Ruta privada)
materiaRouter.get('/',
    authMiddleware,
    getMateriasByProfesorController
);


// Exportación por defecto, en línea con el resto de nuestros módulos
export default materiaRouter;