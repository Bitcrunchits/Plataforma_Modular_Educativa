import mysql from 'mysql2';

const runSeed = async () => {
  //const connection = await pool.getConnection();

  try {
    const [[{ count }]] = await connection.query(
      `SELECT COUNT(*) AS count FROM Users WHERE rol = 'admin'`
    );

    if (count === 0) {
      await connection.beginTransaction();

      const users = [
        ['Claudio Bidau', 'claudiobidau@universidad.com', 'claudio', 'claudio123', 'admin'],
        ['Lucas Lagos', 'lucas@universidad.com', 'lucas', 'lucas123', 'profesor'],
        ['Emiliano Spagnolo', 'emiliano@universidad.com', 'emiliano', 'emiliano123', 'profesor'],
        ['Adrian Burdiles', 'adrian@universidad.com', 'adrian', 'adrian123', 'profesor'],
        ['Agustin Soto', 'agustin@universidad.com', 'agustin', 'agustin123', 'profesor'],
      ];

      await connection.query(
        `INSERT INTO Users (nombre, email, username, password, rol) VALUES ?`,
        [users]
      );

      const materias = [
        ['Algoritmos 1', 'estructuras de control', 2, 1],
        ['Biologia 3', 'Sistemas del cuerpo humano', 3, 1],
        ['Matematica 1', 'algebra y geometria', 4, 1],
        ['Inteligencia Artificial', 'Redes neuronales', 5, 1],
        ['Matematica 1', 'algebra y geometria', 2, 1],
        ['Filosofia 1', 'Platon, Democrito y Aristoteles', 4, 1],
      ];

      await connection.query(
        `INSERT INTO materia (nom_materia, descripcion, id_profesor, activo) VALUES ?`,
        [materias]
      );

      await connection.commit();
      console.log('Datos insertados correctamente.');
    } else {
      console.log('El usuario administrador ya existe.');
    }
  } catch (err) {
    await connection.rollback();
    console.error('Error al ejecutar el seed:', err);
  } 
// finally {
//     connection.release();
//   }
};

export { runSeed };
