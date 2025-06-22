import { entregaController } from '../controllers/entrega.controller.js'
import { Router } from "express";

const entregaRouter = Router();

//!RUTAS CRUD
//GET /materia
entregaRouter.get('/', entregaController.getAllEntrega);

// GET /materia/:id (obtener mateiras por ID)
entregaRouter.get('/:id', entregaController.getEntregaById);

// POST /materias (crear materias)
entregaRouter.post('/', entregaController.entregarTarea);

//UPDATE /materias/:id (actualizar materias)
entregaRouter.patch('/:id', entregaController.actualizarEntrega);



export default entregaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js
