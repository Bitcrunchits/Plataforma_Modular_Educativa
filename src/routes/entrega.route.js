import { entregaController } from '../controllers/entrega.controller.js'
import { Router } from "express";

const entregaRouter = Router();

//!RUTAS CRUD
//GET /entrega y entregas por materia
entregaRouter.get('/', entregaController.getAllEntrega);

// GET /entrega/:id (obtener entrega por ID)
entregaRouter.get('/:id', entregaController.getEntregaById);

// GET /entrega/:id (obtener entrega por alumno)
entregaRouter.get('/alumno/:id/entregas', entregaController.getEntregasByAlumno);;

// POST /entregas (crear entrega)
entregaRouter.post('/', entregaController.entregarTarea);

//UPDATE /entregas/:id (actualizar entrega)
entregaRouter.patch('/:id', entregaController.actualizarEntrega);



export default entregaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js
