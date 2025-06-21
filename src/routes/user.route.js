import { userController } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router();

//!RUTAS CRUD
//GET /tarea
userRouter.get('/', userController.getAllUser);

// GET /tarea/:id (obtener mateiras por ID)
userRouter.get('/:id', userController.getUserById);

// POST /tareas (crear tareas)
userRouter.post('/', userController.createUser);

//UPDATE /tareas/:id (actualizar tareas)
userRouter.patch('/:id', userController.updateUser);



export default userRouter;  //exportamos el modulo router segun docu. express tara llamarlos en app.js