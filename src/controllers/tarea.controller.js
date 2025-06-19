import { pool } from '../db/db.js';

//!funcion asincrona findall
async function getAllTarea(req, res) {
    try {
        const[rows] = await pool.query('SELECT * FROM tarea');
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener el listado de materias:",err);
        res.status(500).json({ message: 'Error interno del Servidor'});
    };
    
};

//! FUNCION asincrona findone 
async function getTareaById ( req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM tarea WHERE id_tarea = ?', [id] ); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({message: 'Tarea no encontrada'})
        }
        res.json (rows [0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener tarea por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor'});
    };
};

//! FUNCION ASINC CREATE con "validacion de profesor autorizado"
async function createTarea(req, res) {
    const { titulo, descripcion, fecha_entrega } = req.body;

    if (!titulo || !descripcion || !fecha_entrega) {
        return res.status(400).json({ message: 'El nombre de tarea, descripción y fecha de entrega son obligatorios' });
    }
    try {
        // Validar que el id_profesor existe y corresponde a un profesor
        const [profesor] = await pool.query('SELECT * FROM Users WHERE id_usuario = ? AND rol = "profesor"', [id_profesor]);
        if (profesor.length === 0) {
            return res.status(400).json({ message: 'El id_profesor no es válido o no corresponde a un profesor.' });
        }

        const [result] = await pool.query('INSERT INTO tarea (titulo, descripcion, fecha_entrega) VALUES (?,?,?)', [titulo, descripcion, fecha_entrega]);
        res.status(201).json({ id: result.insertId, message: 'Ha generado una tarea nueva exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Código correcto para duplicados
            return res.status(409).json({ message: 'Nombre de tarea ya existen. No se pueden duplicar.' });
        }
        console.error('Error al crear tarea: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
//------------------------------------------------------------------
//! FUNCION ASINC update
async function updateTarea(req, res) {
    const { id } = req.params; //capturamos id del params
    const { titulo, descripcion, fecha_entrega } = req.body; //capturamos los datos del body desestructurandolos

    if (!titulo && !descripcion && !fecha_entrega) { //validamos que AL MENOS uno venga con valor
        return res.status(400).json({ message: 'Debe ingresar al menos un dato de los solicitados' });
    }

    const updates = [];
    const params = [];

    if (titulo) {
        updates.push('titulo = ?');
        params.push(titulo);
    }

    if (descripcion) {
        updates.push('descripcion = ?');
        params.push(descripcion);
    }

    if (fecha_entrega) {
        updates.push('fecha_entrega = ?');
        params.push(fecha_entrega);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    let query = 'UPDATE tarea SET ' + updates.join(', ') + ' WHERE id_tarea = ?';
    params.push(id);

    try {
        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Tarea no encontrada o no se realizaron cambios' });
        }
        res.json({ message: 'Tarea actualizada exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Nombre de tarea ya existen. No se pueden duplicar.' });
        }
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const tareaController = { 
    getAllTarea,
    getTareaById,
    createTarea,
    updateTarea
};