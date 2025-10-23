import http from 'http';
import { Server } from 'socket.io'; 
import app from './app.js';
import { initializeDatabase } from './providers/database.provider.js'; 
import { envs } from './configuration/envs.js'; 
import { initializeSocket } from './socket.handler.js'; 

// Función principal asíncrona para inicializar la aplicación
async function main() {
    try {
        
        console.log('Conectando y Sincronizando Base de Datos...');
        // CORRECCIÓN CLAVE 2: Llamar a la función que sincroniza y crea las tablas
        await initializeDatabase(); 

        // 2. CREACIÓN DEL SERVIDOR HTTP Y SOCKET.IO
        const server = http.createServer(app);

        // Inicializar Socket.IO
        const io = new Server(server, {
            cors: {
                origin: envs.CLIENT_URL, 
                methods: ['GET', 'POST'],
            },
        });

        // 3. INICIALIZAR LÓGICA DE SOCKETS
        initializeSocket(io);


        // 4. INICIO DEL SERVIDOR
        server.listen(envs.PORT, () => {
            console.log(` Servidor en línea en el puerto: ${envs.PORT}`);
            console.log(` URL de prueba: http://localhost:${envs.PORT}`);
        });

    } catch (error) {
        // Manejo de errores de conexión o inicialización
        console.error('FATAL: Error al iniciar la aplicación:', error);
        // Termina el proceso si hay un error crítico
        process.exit(1); 
    }
}

main(); // Ejecutar la función de inicialización
