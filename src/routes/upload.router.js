import { Router } from 'express';
import upload from '../middlewares/multer.js';
import path from 'path';
import fs from 'fs';

const uploadRouter = Router();

// Crear carpeta uploads si no existe
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ruta para formulario HTML de prueba (OPCIONAL - solo desarrollo)
uploadRouter.get('/form', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Subir Archivos - Escuela3</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input[type="file"] { padding: 10px; border: 2px dashed #ccc; border-radius: 5px; width: 100%; }
                button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #0056b3; }
                .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>📁 Sistema de Subida de Archivos - Escuela3</h1>
            
            <div class="info">
                <strong>Formatos permitidos:</strong><br>
                📄 PDF, Word (.doc, .docx), Excel (.xls, .xlsx)<br>
                🖼️ PowerPoint (.ppt, .pptx), Imágenes (JPEG, PNG, GIF)<br>
                📝 Texto (.txt), RTF<br>
                <strong>Tamaño máximo:</strong> 15MB por archivo
            </div>

            <h2>Subir un archivo</h2>
            <form action="/api/upload/single" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="singleFile">Seleccionar archivo:</label>
                    <input type="file" name="file" id="singleFile" required>
                </div>
                <button type="submit">📤 Subir Archivo</button>
            </form>

            <h2>Subir múltiples archivos (máx. 5)</h2>
            <form action="/api/upload/multiple" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="multipleFiles">Seleccionar archivos:</label>
                    <input type="file" name="files" id="multipleFiles" multiple required>
                </div>
                <button type="submit">📤 Subir Múltiples Archivos</button>
            </form>
        </body>
        </html>
    `);
});

// Ruta para subir UN solo archivo
uploadRouter.post('/single', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se seleccionó ningún archivo'
            });
        }

        res.json({
            success: true,
            message: '✅ Archivo subido con éxito',
            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: `/uploads/${req.file.filename}`,
                downloadUrl: `/api/upload/download/${req.file.filename}`
            }
        });

    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al subir archivo'
        });
    }
});

// Ruta para subir MÚLTIPLES archivos
uploadRouter.post('/multiple', upload.array('files', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se seleccionaron archivos'
            });
        }

        const filesInfo = req.files.map(file => ({
            originalName: file.originalname,
            fileName: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            path: `/uploads/${file.filename}`,
            downloadUrl: `/api/upload/download/${file.filename}`
        }));

        res.json({
            success: true,
            message: `✅ ${req.files.length} archivo(s) subido(s) con éxito`,
            files: filesInfo
        });

    } catch (error) {
        console.error('Error al subir archivos múltiples:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al subir archivos'
        });
    }
});

// Ruta para DESCARGAR archivos
uploadRouter.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads', filename);

        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }

        // Enviar archivo para descarga
        res.download(filePath, filename);

    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al descargar archivo'
        });
    }
});

// Ruta para LISTAR archivos subidos
uploadRouter.get('/list', (req, res) => {
    try {
        const files = fs.readdirSync('uploads')
            .map(filename => {
                const filePath = path.join('uploads', filename);
                const stats = fs.statSync(filePath);
                
                return {
                    filename: filename,
                    size: stats.size,
                    uploadDate: stats.mtime,
                    downloadUrl: `/api/upload/download/${filename}`
                };
            });

        res.json({
            success: true,
            files: files,
            total: files.length
        });

    } catch (error) {
        console.error('Error al listar archivos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar archivos'
        });
    }
});

// Middleware de error para Multer
uploadRouter.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 15MB permitido.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Demasiados archivos. Máximo 5 archivos permitidos.'
            });
        }
    }
    
    if (error.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

export default uploadRouter;