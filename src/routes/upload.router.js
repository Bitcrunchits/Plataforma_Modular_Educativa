import { Router } from 'express';
import upload from '../middlewares/multer.js';

const uploadRouter = Router();

// Ruta para mostrar el formulario de upload
uploadRouter.get('/upload', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Subir Archivo</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
                form { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
                input, button { margin: 10px 0; padding: 8px; width: 100%; }
                button { background: #007bff; color: white; border: none; cursor: pointer; }
                button:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <h1>Subir un archivo</h1>
            <form action="/api/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="file" required />
                <button type="submit">Subir</button>
            </form>
        </body>
        </html>
    `);
});

// Ruta para subir un solo archivo
uploadRouter.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No se seleccionó ningún archivo'
            });
        }

        res.json({
            mensaje: 'Archivo subido con éxito',
            nombreArchivo: req.file.filename,
            archivoOriginal: req.file.originalname,
            tamaño: req.file.size,
            ruta: `/uploads/${req.file.filename}`,
            urlCompleta: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al subir el archivo',
            detalle: error.message
        });
    }
});

// Ruta para subir múltiples archivos (opcional)
uploadRouter.post('/upload-multiple', upload.array('files', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: 'No se seleccionaron archivos'
            });
        }

        const archivosSubidos = req.files.map(file => ({
            nombreArchivo: file.filename,
            archivoOriginal: file.originalname,
            tamaño: file.size,
            ruta: `/uploads/${file.filename}`
        }));

        res.json({
            mensaje: 'Archivos subidos con éxito',
            total: archivosSubidos.length,
            archivos: archivosSubidos
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al subir los archivos',
            detalle: error.message
        });
    }
});

export default uploadRouter;