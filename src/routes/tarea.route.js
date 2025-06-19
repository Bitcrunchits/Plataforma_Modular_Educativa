import { tareaController } from "../controllers/tarea.controller.js";
import { Router } from "express";

const tareaRouter = Router();

//!RUTAS CRUD
//GET /tarea
tareaRouter.get('/', tareaController.getAllTarea);

// GET /tarea/:id (obtener mateiras por ID)
tareaRouter.get('/:id', tareaController.getTareaById);

// POST /tareas (crear tareas)
tareaRouter.post('/', tareaController.createTarea);

//UPDATE /tareas/:id (actualizar tareas)
tareaRouter.patch('/:id', tareaController.updateTarea);



export default tareaRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js

