import http from 'http';
import { Server } from 'socket.io'; 
import app from './app.js';
import { initializeDatabase } from './providers/database.provider.js'; 
import { envs } from './configuration/envs.js'; 
import { initializeSocket } from './socket.handler.js'; 
import { setSocketInstance } from './providers/socket.provider.js';

// Función principal asíncrona para inicializar la aplicación
async function main() {
    try {
        
        console.log('Conectando y Sincronizando Base de Datos...');
        
        await initializeDatabase(); 

        // 2. CREACIÓN DEL SERVIDOR HTTP Y SOCKET.IO
        const server = http.createServer(app);

        // // 3. INICIALIZAR LÓGICA DE SOCKETS
       
            const io = new Server(server, {
                cors: {
                    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // ← agregá este
                    methods: ['GET', 'POST'],
                },
            });

            setSocketInstance(io); // ← Guardamos la instancia
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

main(); 
