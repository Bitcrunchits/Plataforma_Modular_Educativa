import express from 'express';
import cors from 'cors';
import passport from 'passport';


import './configuration/passport.js'; 

// 2. Importación de Rutas
import userRouter from './module/user/user.route.js';
// import materiaRouter from './module/materia/materia.route.js';
// import tareaRouter from './module/tarea/tarea.route.js';
// import entregaRouter from './module/entrega/entrega.route.js';
// import matriculaRouter from './module/matricula/matricula.route.js';


// Inicialización de la aplicación Express
const app = express();



// Permite solicitudes CORS desde el frontend
app.use(cors());

// Permite a Express leer JSON en el cuerpo de las peticiones (DTOs)
app.use(express.json());

// Inicializa Passport para manejar la autenticación JWT
app.use(passport.initialize());


// --- MONTAJE DE RUTAS ---
app.use('/users', userRouter);
// app.use('/materias', materiaRouter);
// app.use('/tareas', tareaRouter);
// app.use('/entregas', entregaRouter);
// app.use('/matriculas', matriculaRouter);

// Middleware de manejo de errores (El último middleware en ejecutarse)
// Captura cualquier error que haya sido pasado a 'next(error)' en los controladores o servicios.
app.use((err, req, res, next) => {
   
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    console.error(err); // Loguear el error en la consola del servidor (para debugging)

    // Respuesta genérica al cliente
    res.status(status).json({
        success: false,
        message: 'error ' + message,
        // En producción, no deberíamos exponer el stack trace, pero lo mantenemos
        // para fines de desarrollo/evaluación.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
});

// Exporta la aplicación para que index.js pueda levantar el servidor
export default app;

