const mysql = require('mysql2');

// Configuración de conexión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ajusta según tu configuración
    password: '', // Ajusta según tu configuración
    database: 'escuela3'
});

// Función para ejecutar el seed
const runSeed = () => {
    const checkAdminQuery = `SELECT COUNT(*) AS count FROM users WHERE rol = 'admin'`;

    connection.query(checkAdminQuery, (err, results) => {
        if (err) {
            console.error('Error al verificar administrador:', err);
            connection.end();
            return;
        }

        if (results[0].count === 0) {
            const seedData = `
                INSERT INTO users (username, password, rol) 
                VALUES ('admin', 'admin123', 'admin')
            `;
            connection.query(seedData, (err, result) => {
                if (err) {
                    console.error('Error al insertar el administrador:', err);
                } else {
                    console.log('Administrador insertado correctamente.');
                }
                connection.end();
            });
        } else {
            console.log('El usuario administrador ya existe.');
            connection.end();
        }
    });
};

// Exportar la función para llamarla desde otros archivos
module.exports = { runSeed };
