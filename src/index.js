import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './providers/database.provider.js';
import { envs } from './configuration/envs.js';
import uploadRouter from './routes/upload.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = envs.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de uploads
app.use('/api/upload', uploadRouter);

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Escuela3 API',
        version: '1.0.0'
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API Escuela3 - Sistema de Gestión Escolar',
        endpoints: {
            upload: {
                single: 'POST /api/upload/single',
                multiple: 'POST /api/upload/multiple',
                download: 'GET /api/upload/download/:filename',
                list: 'GET /api/upload/list',
                form: 'GET /api/upload/form (solo desarrollo)'
            },
            health: 'GET /health'
        },
        documentation: 'Consulta la documentación para más detalles'
    });
});

// Inicialización del servidor
const startServer = async () => {
    try {
        console.log('🔄 Conectando y Sincronizando Base de Datos...');
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log('\n============================================================');
            console.log('🚀 SERVIDOR ESCUELA3 - INICIALIZACIÓN COMPLETADA');
            console.log('============================================================');
            console.log(`📡 Servidor en línea en el puerto: ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
            console.log('\n📁 SISTEMA DE UPLOADS ACTIVO:');
            console.log(`   📄 Formulario simple: http://localhost:${PORT}/api/upload/form`);
            console.log(`   ⬆️  Subida única: POST http://localhost:${PORT}/api/upload/single`);
            console.log(`   📦 Subida múltiple: POST http://localhost:${PORT}/api/upload/multiple`);
            console.log(`   📥 Listar archivos: GET http://localhost:${PORT}/api/upload/list`);
            console.log('\n⚙️  CONFIGURACIÓN:');
            console.log(`   🗄️  Base de datos: ${envs.DB_NAME}@${envs.DB_HOST}`);
            console.log(`   🔐 Autenticación: JWT ✅`);
            console.log(`   ⚡ WebSockets: ✅ Activos`);
            console.log(`   📁 Uploads: ✅ 15MB max, PDF, Word, Excel, PowerPoint, Imágenes`);
            console.log('============================================================\n');
        });

    } catch (error) {
        console.error('🔴 FATAL: Error al iniciar la aplicación:');
        console.error('   ', error.message);
        console.log('\n📋 Verifica:');
        console.log('   - Archivo .env con variables correctas');
        console.log('   - Base de datos MySQL ejecutándose');
        process.exit(1);
    }
};

startServer();