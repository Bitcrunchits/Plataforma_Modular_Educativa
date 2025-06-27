import express from 'express';
import { envs } from './config/envs.js';
import materiaRouter from './routes/materia.route.js';
import tareaRouter from './routes/tarea.route.js'; // Importamos el router de tareas
import matriculaRouter from './routes/matricula.route.js';
import entregaRouter from './routes/entrega.route.js'; // Importamos el router de entregas
import userRouter from './routes/user.route.js'; // Importamos el router de usuarios


const port = envs.PORT || 3001; // Definimos el puerto del servidor, si no se define en las variables de entorno, usará el 3000

const app = express(); //creamos la constante app que creará el servidor

app.use(express.json()); // para que manipule los objetos json.

app.use(materiaRouter); // para que use el metodo de enrutamientos desde el archivo..
app.use(tareaRouter); // para que use el metodo de enrutamientos desde el archivo tareas
app.use(matriculaRouter); // para que use el metodo de enrutamientos desde el archivo matrículas
app.use(userRouter); // para que use el metodo de enrutamientos desde el archivo usuarios
app.use(entregaRouter); // para que use el metodo de enrutamientos desde el archivo tareas

app.use('/api/materia', materiaRouter); // Definimos la ruta base para las materias
app.use('/api/tarea', tareaRouter); // Definimos la ruta base para las tareas.
app.use('/api/matricula', matriculaRouter); // Definimos la ruta base para las matrículas
app.use('/api/users', userRouter); // Definimos la ruta base para los usuarios
app.use('/api/entrega', entregaRouter); // Definimos la ruta base para las tareas

app.set('port', envs.PORT);


export default app; //exportar constante app
