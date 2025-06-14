import express from 'express';
import { envs } from './config/envs.js';
import materiaRouter from './routes/materia.route.js';

// const port = envs.PORT || 3001; // Definimos el puerto del servidor, si no se define en las variables de entorno, usará el 3000

const app = express(); //creamos la constante app que creará el servidor

app.use(express.json()); // para que manipule los objetos json.

app.use(materiaRouter); // para que use el metodo de enrutamientos desde el archivo..

app.use('/api/materia', materiaRouter); // Definimos la ruta base para las materias

app.set('port', envs.PORT);


export default app; //exportar constante app
