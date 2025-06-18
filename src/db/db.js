import mysql from 'mysql2/promise';
import { envs } from '../config/envs.js';
// aca haremos la conexion a la db.


const pool = mysql.createPool({
    host: envs.DB_HOST,
    user: envs.DB_USER,
    // password: envs.DB_PASSWORD,
    database: envs.DATABASE,
    port: envs.DB_PORT || 3306,
    // waitForConnections: true,
    // connectionLimit: 10,
});

// !funcion que testea la conexion a la DB y si falla algo nos tira un error.
async function testConnection() {
    try {
        const connection = await pool.getConnection();  // metodo getConnection del objeto pool optimiza las conexiones del pool estudiar su uso...
        console.log('Conexion a la base de datos exitosa')
        connection.release();

    } catch (err) {
        console.error('hubo un error en la conexion a la DB', err.message);
        process.exit(1) //corta la conexion a la DB para ahorrar recursos y seguridad
    }
    
}

// async function testConnection() {
//   try {
//     const pool = mysql.createPool(dbConfig);
//     const connection = await pool.getConnection();
//     return connection;
//   } catch (error) {
//     throw new Error('Error al conectar a la base de datos: ' + error.message);
//   }
// }

// exportamos el pool de conexiones y la funcion de testeo hacia index.js

export { pool };
export { testConnection };