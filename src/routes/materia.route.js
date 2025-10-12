import { materiaController } from '../controllers/materia.controller.js'
import { Router } from "express";
import { validatorMiddleware } from '../middlewares/validator.middlewares.js';
import { createMateriaSchema, updateMateriaSchema } from '../module/schema/materia/Materia.schema.js';

const materiaRouter = Router();

//!RUTAS CRUD
//GET /materia
materiaRouter.get('/', materiaController.getAllMaterias);

// GET /materia/:id (obtener mateiras por ID)
materiaRouter.get('/:id', materiaController.getMateriasById);

// POST /materias (crear materias)
materiaRouter.post(
    '/',
    validatorMiddleware(createMateriaSchema, 'body'),
    materiaController.createMateria
);

//UPDATE /materias/:id (actualizar materias)
materiaRouter.patch(
    '/:id',
    validatorMiddleware(updateMateriaSchema), 
    materiaController.updateMateria);



export default materiaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js

