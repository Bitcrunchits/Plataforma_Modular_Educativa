import http from 'http';
import { Server } from 'socket.io'; // Importamos la clase Server de Socket.IO
import app from './app.js';
import { AppDataSource } from './providers/database.provider.js'; // Importamos la conexión de TypeORM
import { envs } from './configuration/envs.js'; // Para obtener el puerto
import { initializeSocket } from './socket.handler.js'; // Importamos el handler de sockets

// Función principal asíncrona para inicializar la aplicación
async function main() {
    try {
        // 1. CONEXIÓN A LA BASE DE DATOS (TypeORM)
        console.log('🔗 Conectando a la Base de Datos...');
        await AppDataSource.initialize();
        console.log('✅ Conexión a la Base de Datos establecida con éxito.');

        // 2. CREACIÓN DEL SERVIDOR HTTP Y SOCKET.IO
        const server = http.createServer(app);

        // Inicializar Socket.IO, usando el mismo servidor HTTP
        // Esto prepara el backend para el Nivel 5: WebSockets
        const io = new Server(server, {
            cors: {
                origin: envs.CLIENT_URL, // Permitir conexiones desde el frontend
                methods: ['GET', 'POST'],
            },
        });

        // 3. INICIALIZAR LÓGICA DE SOCKETS
        // Llama a la función que contiene toda la lógica de eventos de WebSockets
        initializeSocket(io);


        // 4. INICIO DEL SERVIDOR
        server.listen(envs.PORT, () => {
            console.log(` Servidor en línea en el puerto: ${envs.PORT}`);
            console.log(`URL de prueba: http://localhost:${envs.PORT}`);
        });

    } catch (error) {
        // Manejo de errores de conexión o inicialización
        console.error(' FATAL: Error al iniciar la aplicación:', error);
        // Termina el proceso si hay un error crítico
        process.exit(1);
    }
}

main(); // Ejecutar la función de inicialización