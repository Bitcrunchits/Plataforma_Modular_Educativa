import { pool } from '../db/db.js'


//!funcion asincrona findall
async function getAllEntrega(req, res) {
    try {
        const[rows] = await pool.query('SELECT * FROM entrega');
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener el listado:",err);
        res.status(500).json({ message: 'Error interno del Servidor'});
    };
    
};

//! FUNCION asincrona findone 
async function getEntregaById ( req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM entrega WHERE id_entrega = ?', [id] ); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({message: 'No encontrada'})
        }
        res.json (rows [0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener entrega por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor'});
    };
};

//! FUNCION ASINC CREATe
async function entregarTarea(req, res) {
    const { id_tarea, id_usuario } = req.body;

    if (!id_tarea || !id_usuario) {
        return res.status(400).json({ message: 'El id_tarea y el id_usuario son obligatorios.' });
    }

    try {
        // 1. Validar que la tarea existe
        const [tarea] = await pool.query('SELECT id_materia FROM tareas WHERE id_tarea = ?', [id_tarea]);
        if (tarea.length === 0) {
            return res.status(400).json({ message: 'El id_tarea no es válido.' });
        }

        const id_materia = tarea[0].id_materia; // Obtener el ID de la materia a la que pertenece la tarea

        // 2. Validar que el usuario existe y es un alumno
        const [usuario] = await pool.query('SELECT * FROM users WHERE id_usuario = ? AND rol = "alumno"', [id_usuario]);
        if (usuario.length === 0) {
            return res.status(400).json({ message: 'El id_usuario no es válido o no corresponde a un alumno.' });
        }

        // 3. Validar que el alumno está matriculado en la materia de la tarea
        const [matricula] = await pool.query('SELECT * FROM matricula WHERE id_usuario = ? AND id_materia = ?', [id_usuario, id_materia]);
        if (matricula.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado: El alumno no está matriculado en esta materia.' });
        }

        // 4. Registrar la entrega de la tarea
        const fecha_entrega = new Date(); // Fecha y hora actual
        const [result] = await pool.query(
            'INSERT INTO entregas (id_tarea, id_usuario, fecha_entrega) VALUES (?, ?, ?)',
            [id_tarea, id_usuario, fecha_entrega]
        );

        res.status(201).json({ message: 'Entrega registrada exitosamente.', id_entrega: result.insertId });

    } catch (error) {
        console.error('Error al registrar la entrega: ', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

//! FUNCION ASINC update
async function actualizarEntrega(req, res) {
    const { id } = req.params; // Capturamos el id de la entrega del params
    const { calificacion, comentario, id_usuario } = req.body; // Capturamos la calificación, el comentario y el ID del usuario del body

    if (calificacion === undefined && !comentario) { // Usar === undefined para permitir calificacion = null
        return res.status(400).json({ message: 'Debe ingresar al menos la calificación o el comentario.' });
    }

    if (!id_usuario) {
        return res.status(400).json({ message: 'El id_usuario es obligatorio.' });
    }

    try {
        // 1. Validar que la entrega existe
        const [entrega] = await pool.query('SELECT id_tarea FROM Entrega WHERE id_entrega = ?', [id]);
        if (entrega.length === 0) {
            return res.status(404).json({ message: 'Entrega no encontrada.' });
        }

        const id_tarea = entrega[0].id_tarea;

        // 2. Obtener el rol del usuario desde la base de datos
        const [usuario] = await pool.query('SELECT rol FROM Users WHERE id_usuario = ?', [id_usuario]);
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const rol = usuario[0].rol;

        // 3. Validar que el usuario que hace la solicitud es un profesor
        if (rol !== 'profesor') {
            return res.status(403).json({ message: 'Acceso denegado: Solo los profesores pueden calificar entregas.' });
        }

        // 4. Validar que el profesor está asignado a la materia de la tarea
        const [materia] = await pool.query(
            `SELECT 1
             FROM Materia m
             INNER JOIN Tarea t ON m.id_materia = t.id_materia
             WHERE t.id_tarea = ? AND m.id_profesor = ?`,
            [id_tarea, id_usuario]
        );
        if (materia.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado: El profesor no está asignado a la materia de esta tarea.' });
        }

      
        let query = 'UPDATE Entrega SET ';
        const params = [];

        if (calificacion !== undefined) { 
            query += 'calificacion = ?, ';
            params.push(calificacion);
        }

        if (comentario) {
            query += 'comentario = ?, ';
            params.push(comentario);
        }

        // Eliminar la coma extra y el espacio al final
        query = query.slice(0, -2);

        query += ' WHERE id_entrega = ?';
        params.push(id);

        // Ejecutar la consulta
        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Entrega no encontrada o no se realizaron cambios.' });
        }

        res.json({ message: 'Entrega actualizada exitosamente.' });

    } catch (error) {
        console.error('Error al actualizar la entrega:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}


export const entregaController = { 
    getAllEntrega,
    getEntregaById,
    entregarTarea,
    actualizarEntrega
    
};

