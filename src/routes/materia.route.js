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

//UPDATE /materias/:id (actualizar materias)
materiaRouter.patch('/:id', materiaController.updateMateria);



export default materiaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js

