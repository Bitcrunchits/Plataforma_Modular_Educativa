/**
 * @fileoverview Lógica centralizada para el manejo de eventos de Socket.IO.
 * Aquí se definirá cómo la aplicación responde a las conexiones y eventos de WebSockets.
 */

// NOTA: 'io' es la instancia global de Socket.IO que se pasa desde index.js
export function initializeSocket(io) {
    // Alguien se conecta al servidor de WebSockets
    io.on('connection', (socket) => {
        console.log(`🔌 [SOCKET.IO] Nuevo cliente conectado: ${socket.id}`);

        // Evento de prueba
        socket.on('hello', (data) => {
            console.log(`[SOCKET.IO] Evento 'hello' recibido de ${socket.id}: ${data}`);
            // Responde al cliente que envió el mensaje
            socket.emit('response', '¡Hola de vuelta desde el servidor!');
        });
        
        // Alguien se desconecta
        socket.on('disconnect', () => {
            console.log(`🔌 [SOCKET.IO] Cliente desconectado: ${socket.id}`);
        });
    });
}
