import { Router } from 'express';
import { create, getTareas } from './tarea.controller.js';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { CreateTareaSchema } from './dto/create-tarea.dto.js'; // Importamos el DTO de creación

const tareaRouter = Router();

// =========================================================================
// RUTAS PRIVADAS (Requieren Autenticación JWT)
// =========================================================================

// POST /api/tareas
// - REQUIERE: Autenticación (authMiddleware)
// - VALIDA: El cuerpo de la petición (CreateTareaSchema)
// - USO: Creación de una nueva tarea por un profesor o administrador.
tareaRouter.post('/', 
    authMiddleware, 
    validatorMiddleware(CreateTareaSchema, 'body'), 
    create
);

// GET /api/tareas
// - REQUIERE: Autenticación (authMiddleware)
// - USO: Listado de tareas. Permite filtrar por id_usuario (query param) para alumnos.
tareaRouter.get('/', 
    authMiddleware, 
    getTareas
);



export default tareaRouter;
