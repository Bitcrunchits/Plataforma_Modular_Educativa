import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- CONFIGURACIÓN DE MULTER ---

// 1. Configuración de Almacenamiento
// Le decimos a Multer dónde guardar los archivos y cómo nombrarlos.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // La ruta 'uploads/' debe existir en la raíz del proyecto.
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Creamos un nombre único: 'campo-fecha.ext'
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// 2. Función de Filtro (Solo PDFs y TXTs)
const fileFilter = (req, file, cb) => {
    // Aceptamos solo archivos con mime-type de PDF o texto plano
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
        cb(null, true); // Acepta el archivo
    } else {
        // Rechaza el archivo, pasando un error
        const error = new Error('Tipo de archivo no soportado. Solo se permiten PDF y TXT.');
        error.status = 400; // Agregamos un estado de error
        cb(error, false);
    }
};

// 3. Inicialización de Multer con las configuraciones
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5MB por archivo
    }
});

// --- RUTA DE PRUEBA: Formulario y Subida ---

// 1. GET: Muestra el formulario de subida
router.get('/test-form', (req, res) => {
    // HTML simple para probar la subida sin un frontend completo.
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Upload</title>
            <style>
                body { font-family: sans-serif; padding: 20px; background-color: #f4f7f6; }
                .container { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                form { display: flex; flex-direction: column; gap: 15px; }
                input[type="file"], input[type="submit"] { padding: 10px; border-radius: 4px; border: 1px solid #ccc; }
                input[type="submit"] { background-color: #3498db; color: white; cursor: pointer; border: none; font-weight: bold; }
                input[type="submit"]:hover { background-color: #2980b9; }
                p.note { margin-top: 20px; color: #e74c3c; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Subida de Archivos de Prueba</h1>
                <p>Endpoint: <strong>POST /api/files/upload-single</strong></p>
                
                <form action="/api/files/upload-single" method="POST" enctype="multipart/form-data">
                    <label for="documento">Seleccionar Archivo (Max 5MB, solo PDF/TXT):</label>
                    <input type="file" name="documento" id="documento" required>
                    <input type="submit" value="Subir Archivo">
                </form>

               
            </div>
        </body>
        </html>
    `);
});


// 2. POST: Endpoint que maneja la subida real
// El middleware 'upload.single('documento')' intercepta la petición,
// procesa el archivo del campo 'documento' y lo guarda.
router.post('/upload-single', upload.single('documento'), (req, res) => {
    if (!req.file) {
        // Esto solo ocurre si Multer falló en la fase de filtro o límites.
        // Si no hay req.file, Multer ya pasó el error a nuestro manejador global.
        return res.status(400).json({ success: false, message: 'No se subió ningún archivo o el archivo no es válido.' });
    }

    // Si todo es exitoso
    res.json({
        success: true,
        message: 'Archivo subido exitosamente.',
        fileInfo: {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        }
    });
});

export default router;