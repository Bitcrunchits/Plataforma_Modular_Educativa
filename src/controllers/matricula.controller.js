import { pool } from '../db/db.js'


//!funcion asincrona findall
async function getAllMatricula(req, res) {
    try {
        const[rows] = await pool.query('SELECT * FROM matricula');
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener el listado de matriculas:",err);
        res.status(500).json({ message: 'Error interno del Servidor'});
    };
    
};

//! FUNCION asincrona findone 
async function getMatriculaById ( req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM matricula WHERE id_matricula = ?', [id] ); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({message: 'matricula no encontrada'})
        }
        res.json (rows [0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener matricula por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor'});
    };
};

//! FUNCION ASINC CREATE con "validacion de profesor autorizado"
async function createMatricula(req, res) {
    const { id_usuario, id_materia } = req.body; // id_usuario es el ID del profesor

    if (!id_usuario || !id_materia) {
        return res.status(400).json({ message: 'El id_usuario (profesor) y el id_materia son obligatorios.' });
    }

    try {
        // 1. Validar que el id_usuario corresponde a un profesor
        const [profesor] = await pool.query('SELECT * FROM Users WHERE id_usuario = ? AND rol = "profesor"', [id_usuario]);
        if (profesor.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado: Solo los profesores pueden crear matrículas o usuario no existente.' }); //COD ER 403 acceso denegado solicitud entendida pero no autorizada
        }

        // **2. Validar que el profesor imparte la materia**
        const [materia] = await pool.query('SELECT * FROM Materia WHERE id_materia = ? AND id_profesor = ?', [id_materia, id_usuario]);
        if (materia.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado: El profesor no está asignado a esta materia o materia inexistente.' });
        }

        // 3. Obtener la lista de alumnos de esa materia (esto es solo para pruebas!!)
        const [alumnos] = await pool.query('SELECT * FROM Users WHERE NOT rol = "profesor"');
        // 4. Obtener el id_alumno de la lista
        const id_alumno = alumnos[0].id_usuario;

        // 5. Validar que el id_alumno existe
        const [alumno] = await pool.query('SELECT * FROM Users WHERE id_usuario = ?', [id_alumno]);
        if (alumno.length === 0) {
            return res.status(400).json({ message: 'El id_alumno no es válido.' });
        }

        // 6. Verificar si ya existe una matrícula con el mismo id_alumno e id_materia
        const [existingMatricula] = await pool.query('SELECT * FROM Matricula WHERE id_usuario = ? AND id_materia = ?', [id_alumno, id_materia]);
        if (existingMatricula.length > 0) {
            return res.status(409).json({ message: 'El alumno ya está matriculado en esta materia.' });
        }

        // 7. Crear la matrícula
        const [result] = await pool.query(
            'INSERT INTO Matricula (id_usuario, id_materia) VALUES (?, ?)', //id_usuario hace referencia al alumno
            [id_alumno, id_materia]
        );

        res.status(201).json({ message: 'Matrícula creada exitosamente.', id_matricula: result.insertId });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El alumno ya está matriculado en esta materia.' });
        }
        console.error('Error al crear la matrícula: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//! FUNCION ASINC update
// accion no valida para esta entidad porque se crean pero no se pueden modificar ni borrar por niguno de los usuarios


export const matriculaController = { 
       getAllMatricula,
       getMatriculaById,
         createMatricula
};