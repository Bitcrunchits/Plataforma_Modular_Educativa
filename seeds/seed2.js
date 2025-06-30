import mysql from 'mysql2';
import { pool } from '../src/db/db.js';


const runSeed2 = async () => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Crear la base de datos si no existe
        await connection.query('CREATE DATABASE IF NOT EXISTS escuela7;');

        // Usar la base de datos recién creada
        await connection.query('USE escuela7;');

        // Crear las tablas individualmente
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id_usuario INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                username VARCHAR(100) NULL,
                password VARCHAR(100) NULL,
                rol ENUM('profesor', 'alumno', 'admin') NOT NULL,
                activo BOOLEAN DEFAULT TRUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Materia (
                id_materia INT PRIMARY KEY AUTO_INCREMENT,
                nom_materia VARCHAR(100) NOT NULL,
                descripcion TEXT,
                id_profesor INT NOT NULL,
                activo BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (id_profesor) REFERENCES Users(id_usuario),
                UNIQUE (id_profesor, nom_materia)
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Matricula (
                id_matricula INT PRIMARY KEY AUTO_INCREMENT,
                id_usuario INT NOT NULL,
                id_materia INT NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES Users (id_usuario),
                FOREIGN KEY (id_materia) REFERENCES Materia(id_materia),
                UNIQUE (id_usuario, id_materia)
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Tarea (
                id_tarea INT PRIMARY KEY AUTO_INCREMENT,
                titulo VARCHAR(100) NOT NULL,
                descripcion TEXT,
                fecha_entrega DATETIME DEFAULT (DATE_ADD(CURDATE(), INTERVAL 15 DAY)) NULL,
                id_materia INT NOT NULL,
                FOREIGN KEY (id_materia) REFERENCES Materia(id_materia)
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Entrega (
                id_entrega INT PRIMARY KEY AUTO_INCREMENT,
                fecha_entrega DATETIME NOT NULL,
                id_tarea INT NOT NULL,
                id_usuario INT NOT NULL,
                calificacion DECIMAL(5,2),
                comentario TEXT,
                FOREIGN KEY (id_tarea) REFERENCES Tarea(id_tarea),
                FOREIGN KEY (id_usuario) REFERENCES Users(id_usuario),
                UNIQUE (id_tarea, id_usuario)
            );
        `);


        // Limpiar tablas existentes (opcional, pero recomendado para desarrollo)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0'); // Deshabilitar la verificación de claves foráneas
        await connection.query('TRUNCATE TABLE Entrega');
        await connection.query('TRUNCATE TABLE Tarea');
        await connection.query('TRUNCATE TABLE Matricula');
        await connection.query('TRUNCATE TABLE Materia');
        await connection.query('TRUNCATE TABLE Users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1'); // Habilitar la verificación de claves foráneas


        const users = [
            ['Juan Pérez', 'juan.perez@example.com', null, null, 'profesor'],
            ['Maria Gómez', 'maria.gomez@example.com', null, null, 'alumno'],
            ['Carlos López', 'carlos.lopez@example.com', null, null, 'alumno'],
            ['Ana Rodriguez', 'ana.rodriguez@example.com', null, null, 'admin'],
            ['Pedro Sánchez', 'pedro.sanchez@example.com', null, null, 'alumno'],
            ['Laura Martínez', 'laura.martinez@example.com', null, null, 'profesor'],
            ['Claudio Bidau', 'claudiobidau@universidad.com', 'claudio', 'claudio123', 'admin'],
            ['Lucas Lagos', 'lucas@universidad.com', 'lucas', 'lucas123', 'profesor'],
            ['Emiliano Spagnolo', 'emiliano@universidad.com', 'emiliano', 'emiliano123', 'profesor'],
            ['Adrian Burdiles', 'adrian@universidad.com', 'adrian', 'adrian123', 'profesor'],
            ['Agustin Soto', 'agustin@universidad.com', 'agustin', 'agustin123', 'profesor'],
      ];

            
        

        const userValues = users.map(() => '(?, ?, ?, ?, ?)').join(',');
        const flatUsers = users.flat();
        await connection.query(`INSERT INTO Users (nombre, email, username, password, rol) VALUES ${userValues}`, flatUsers);

        // Obtener los IDs de los usuarios insertados
        const [allUsers] = await connection.query(`SELECT id_usuario, rol FROM Users`);
        const profesores = allUsers.filter(user => user.rol === 'profesor');

        const materias = [
            ['Matemáticas', 'Curso introductorio a las matemáticas', profesores[0].id_usuario, 1],
            ['Historia Universal', 'Un recorrido por la historia del mundo', profesores[0].id_usuario, 1],
            ['Programación I', 'Introducción a la programación con Python', profesores[1].id_usuario, 1],
            ['Literatura Española', 'Análisis de obras literarias españolas', profesores[1].id_usuario, 1],
        ];
        const materiaValues = materias.map(() => '(?, ?, ?, ?)').join(',');
        const flatMaterias = materias.flat();
        await connection.query(`INSERT INTO Materia (nom_materia, descripcion, id_profesor, activo) VALUES ${materiaValues}`, flatMaterias);

        // Obtener los IDs de las materias insertadas
        const [allMaterias] = await connection.query(`SELECT id_materia FROM Materia`);
        const materiaIds = allMaterias.map(materia => materia.id_materia);
         // Obtener los IDs de los alumnos insertados
         const alumnos = allUsers.filter(user => user.rol === 'alumno');
         const alumnoIds = alumnos.map(alumno => alumno.id_usuario);

         const matriculas = [
            [alumnoIds[0], materiaIds[0]],
            [alumnoIds[0], materiaIds[1]],
            [alumnoIds[1], materiaIds[0]],
            [alumnoIds[1], materiaIds[2]],
            [alumnoIds[2], materiaIds[3]]
         ];
        const matriculaValues = matriculas.map(() => '(?, ?)').join(',');
        const flatMatriculas = matriculas.flat();
        await connection.query(`INSERT INTO Matricula (id_usuario, id_materia) VALUES ${matriculaValues}`, flatMatriculas);

            // Obtener IDs de tareas
        const [allTareas] = await connection.query(`SELECT id_tarea, id_materia FROM Tarea`);

            const tareas = [
                ['Entrega 1: Álgebra', 'Ejercicios de álgebra básica', materiaIds[0]],
                ['Resumen: Revolución Francesa', 'Resumen detallado de la Revolución Francesa', materiaIds[1]],
                ['Proyecto 1: Hola Mundo', 'Escribir un programa "Hola Mundo" en Python', materiaIds[2]],
                ['Análisis: El Quijote', 'Análisis de personajes y temas en El Quijote', materiaIds[3]],
            ];
    const tareaValues = tareas.map(() => '(?, ?, ?)').join(',');
    const flatTareas = tareas.flat();
    await connection.query(`INSERT INTO Tarea (titulo, descripcion, id_materia) VALUES ${tareaValues}`, flatTareas);

            // Obtener los IDs de las tareas insertadas
           const [tareasInsertadas] = await connection.query(`SELECT id_tarea FROM Tarea`);
            const tareaIds = tareasInsertadas.map(tarea => tarea.id_tarea);
                const now = new Date(); // Fecha actual para fecha_entrega
                const entregas = [
                    [now, tareaIds[0], alumnoIds[0], 8.50, 'Buen trabajo, Maria'],
                    [now, tareaIds[1], alumnoIds[0], 9.00, 'Excelente resumen'],
                    [now, tareaIds[2], alumnoIds[1], 7.00, 'Funciona correctamente'],
                    [now, tareaIds[3], alumnoIds[2], 9.50, 'Análisis profundo y bien argumentado'],
                ];

             const entregaValues = entregas.map(() => '(?, ?, ?, ?, ?)').join(',');
             const flatEntregas = entregas.flat();
           await connection.query(`INSERT INTO Entrega (fecha_entrega, id_tarea, id_usuario, calificacion, comentario) VALUES ${entregaValues}`, flatEntregas);


        await connection.commit();
        console.log('Base de datos poblada correctamente.');
    } catch (err) {
        if (connection) {
            await connection.rollback();
            console.error('Rollback realizado debido a un error:', err);
        }
        console.error('Error al ejecutar el seed:', err);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export { runSeed2 };