import { materiaController } from '../controllers/materia.controller.js'
import { Router } from "express";

const materiaRouter = Router();

//!RUTAS CRUD
//GET /materia
materiaRouter.get('/', materiaController.getAllMaterias);

// GET /materia/:id (obtener mateiras por ID)
materiaRouter.get('/:id', materiaController.getMateriasById);

// POST /materias (crear materias)
materiaRouter.post('/', materiaController.createMateria);

// PATCH /materias (delete materias, desactivar)
materiaRouter.patch('/:id', materiaController.deleteMateria);

// PATCH /materias (reactivar materias)
materiaRouter.put('/:id', materiaController.reactivarMateria);

//UPDATE /materias/:id (actualizar materias)
// materiaRouter.put('/:id', materiaController.updateMateria);



export default materiaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js

