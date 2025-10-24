import express from 'express';
import cors from 'cors';
import passport from 'passport'; // Importamos el objeto passport

import './configuration/passport.js'; // Solo importamos el archivo para que se ejecute la configuración.
import { envs } from './configuration/envs.js';

// --- Importación de Routers ---
// ¡Importamos sin llaves porque user.route.js y tarea.route.js usan 'export default'!
import userRouter from './module/user/user.route.js'; 
import tareaRouter from './module/tarea/tarea.route.js'; 
// import entregaRouter from './module/entrega/entrega.route.js'; 
// import matriculaRouter from './module/matricula/matricula.route.js';
// import materiaRouter from './module/materia/materia.route.js';

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---

app.use(express.json()); // Middleware para parsear el body de las peticiones JSON
app.use(cors({ origin: envs.CLIENT_URL || '*' })); // CORS básico

// Inicializa Passport para manejar la autenticación JWT
app.use(passport.initialize()); // <-- Usamos el objeto passport importado

// --- MONTAJE DE RUTAS ---
app.get('/', (req, res) => { res.send('API funcionando. Consulte la documentación en /docs.'); }); 

// Montaje de rutas con prefijo /api
app.use('/api/users', userRouter); 
app.use('/api/tareas', tareaRouter); 
// app.use('/api/entregas', entregaRouter);
// app.use('/api/matriculas', matriculaRouter);
// app.use('/api/materias', materiaRouter); 

// --- MANEJO DE ERRORES (debe ser el último middleware) ---
app.use((err, req, res, next) => {
    console.error(' Error no controlado:', err.stack);
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    res.status(status).json({ success: false, message });
});


export default app;