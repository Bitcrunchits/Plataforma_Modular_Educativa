import express from 'express';
import uploadRouter from './routes/upload.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'; // ✅ AGREGAR ESTE IMPORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static('src/uploads'));

// Usar las rutas de upload
app.use('/api', uploadRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor funcionando',
        endpoints: {
            formulario: '/api/upload (GET)',
            subirArchivo: '/api/upload (POST)',
            subirMultiples: '/api/upload-multiple (POST)'
        }
    });
});

// Manejo de errores ✅ CORREGIDO (multer ahora está importado)
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Archivo demasiado grande',
                detalle: 'El tamaño máximo permitido es 5MB'
            });
        }
    }
    res.status(500).json({
        error: 'Error interno del servidor',
        detalle: error.message
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`- Formulario de upload: http://localhost:${PORT}/api/upload`);
});

// ✅ AGREGAR ESTO AL FINAL:
export default app;