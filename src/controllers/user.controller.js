import { pool } from '../db/db.js'

//!funcion asincrona findall
async function getAllUser(req, res) {
    try {
        const[rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener el listado de users:",err);
        res.status(500).json({ message: 'Error interno del Servidor'});
    };
    
};

//! FUNCION asincrona findone 
async function getUserById ( req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id] ); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({message: 'usuario no encontrado'})
        }
        res.json (rows [0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener usuario por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor'});
    };
};

//! FUNCION ASINC CREATE con "validacion de profesor autorizado"
async function createUser(req, res) {
    const { nombre, email, rol } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ message: 'El nombre y el email son obligatorios.' });
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Formato de email no válido.' });
    }

    try {
        // Establecer el rol por defecto como "alumno" si no se proporciona un rol
        const userRol = rol === 'profesor' ? 'profesor' : 'alumno';

        const [result] = await pool.query(
            'INSERT INTO Users (nombre, email, rol) VALUES (?, ?, ?)',
            [nombre, email, userRol]
        );

        res.status(201).json({ message: 'Usuario creado exitosamente.', id: result.insertId });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El email ya está en uso.' });
        }
        console.error('Error al crear el usuario: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//! FUNCION ASINC update se agregaron secuencias prohibidos y numeros en este campo.
async function updateUser(req, res) {
    const { id } = req.params; // Capturamos el id del params
    const { nombre } = req.body; // Capturamos el nombre del body

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es obligatorio para actualizar el usuario.' });
    }

    // Validación de letras repetidas, secuencias prohibidas y números
    function validarNombre(nombre) {
        // Diccionario de secuencias prohibidas
        const secuenciasProhibidas = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz', 'zyx', 'yxw', 'xwv', 'wvu', 'vut', 'uts', 'tsr', 'srq', 'rqp', 'qpo', 'pon', 'onm', 'nml', 'mlk', 'lkj', 'kji', 'jih', 'ihg', 'hgf', 'gfe', 'fed', 'edc', 'dcb', 'cba'];

        // Verificar si el nombre contiene números
        if (/[0-9]/.test(nombre)) {
            return 'El nombre no puede contener números.';
        }

        // Verificar si el nombre contiene secuencias prohibidas
        const nombreLower = nombre.toLowerCase(); // Convertir a minúsculas para que la comparación sea insensible a mayúsculas/minúsculas
        for (const secuencia of secuenciasProhibidas) {
            if (nombreLower.includes(secuencia)) {
                return `El nombre contiene la secuencia prohibida "${secuencia}".`;
            }
        }

        return null; // El nombre es válido
    }

    const validacionNombre = validarNombre(nombre);
    if (validacionNombre) {
        return res.status(400).json({ message: validacionNombre });
    }


    try {
        const [result] = await pool.query(
            'UPDATE Users SET nombre = ? WHERE id_usuario = ?',
            [nombre, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o no se realizaron cambios.' });
        }

        res.json({ message: 'Usuario actualizado exitosamente.' });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

export const userController = { 
    getAllUser,
    getUserById,
    createUser,
    updateUser
};