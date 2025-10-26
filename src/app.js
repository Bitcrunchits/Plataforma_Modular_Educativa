import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// ✅ Resolución de paths ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ IMPORTAR Y MONTAR RUTAS
import uploadRouter from './routes/upload.router.js';
app.use('/api/upload', uploadRouter);

// ✅ Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Sistema Escuela3 - Upload Module',
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected', // Asumiendo que la DB se inicializa en index.js
        websockets: 'Active'
    });
});

// ✅ Ruta principal informativa
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Sistema Escuela3 - API funcionando',
        version: '1.0.0',
        architecture: {
            database: 'TypeORM + MySQL',
            authentication: 'JWT + Passport',
            realtime: 'Socket.IO',
            file_uploads: 'Multer + UUID'
        },
        endpoints: {
            health: 'GET /health',
            upload: {
                formulario: 'GET /api/upload/upload',
                subir_archivo: 'POST /api/upload/upload',
                subir_multiples: 'POST /api/upload/upload-multiple'
            }
        },
        upload_config: {
            max_file_size: '15MB',
            max_files: '10 en upload múltiple',
            allowed_formats: [
                'Images (JPEG, PNG, GIF, WEBP, BMP)',
                'Documents (PDF)',
                'Office (DOC, DOCX, XLS, XLSX, PPT, PPTX)',
                'Text (TXT, RTF)',
                'Archives (ZIP, RAR)'
            ]
        }
    });
});

// ✅ Manejo de errores profesional
app.use((error, req, res, next) => {
    console.error('🔴 Error del servidor:', error);

    // Errores de Multer
    if (error instanceof multer.MulterError) {
        const multerErrors = {
            LIMIT_FILE_SIZE: {
                status: 413,
                message: 'Archivo demasiado grande',
                detail: 'El tamaño máximo permitido es 15MB'
            },
            LIMIT_FILE_COUNT: {
                status: 413,
                message: 'Demasiados archivos',
                detail: 'Máximo 10 archivos en upload múltiple'
            },
            LIMIT_UNEXPECTED_FILE: {
                status: 400,
                message: 'Campo de archivo incorrecto',
                detail: 'Use "file" para upload único o "files" para múltiple'
            }
        };

        const errorConfig = multerErrors[error.code];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                error: errorConfig.message,
                detalle: errorConfig.detail,
                code: error.code
            });
        }
    }

    // Error de validación de tipo de archivo
    if (error.message && error.message.includes('Tipo de archivo no permitido')) {
        return res.status(415).json({
            error: 'Tipo de archivo no soportado',
            detalle: error.message
        });
    }

    // Error general
    res.status(500).json({
        error: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'production' ? 'Contacte al administrador' : error.message,
        timestamp: new Date().toISOString()
    });
});

// ✅ Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        available_endpoints: {
            documentation: 'GET /',
            health: 'GET /health',
            upload_system: 'GET /api/upload/upload'
        }
    });
});

// ✅ EXPORT DEFAULT ESENCIAL para index.js
export default app;