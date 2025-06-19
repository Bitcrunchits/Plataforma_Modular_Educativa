import { matriculaController } from '../controllers/matricula.controller.js'
import { Router } from "express";

const matriculaRouter = Router();

//!RUTAS CRUD
//GET /materia
matriculaRouter.get('/', matriculaController.getAllMatricula);

// GET /materia/:id (obtener mateiras por ID)
matriculaRouter.get('/:id', matriculaController.getMatriculaById);

// POST /materias (crear materias)
matriculaRouter.post('/', matriculaController.createMatricula);



export default matriculaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js

