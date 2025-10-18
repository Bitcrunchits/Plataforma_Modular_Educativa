import { Router } from 'express';
import { register, login, getProfile } from './user.controller.js';
import { validatorMiddleware } from '../../middlewares/validator.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { RegisterSchema, LoginSchema } from './schema/Auth.schema.js';

const userRouter = Router();

// Ruta pública para crear un nuevo usuario
userRouter.post('/register', 
    validatorMiddleware(RegisterSchema, 'body'), 
    register
);

// Ruta pública para iniciar sesión
userRouter.post('/login', 
    validatorMiddleware(LoginSchema, 'body'), 
    login
);

// Ruta privada: Requiere JWT (Authorization: Bearer token)
userRouter.get('/profile', 
    authMiddleware, 
    getProfile
);

export default userRouter;