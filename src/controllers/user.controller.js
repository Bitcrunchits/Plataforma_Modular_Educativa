import { pool } from '../db/db.js'

//!funcion asincrona findall
async function getAllUser(req, res) {
    const { rol } = req.query; // Obtener el rol de la query string

    try {
        let query = 'SELECT * FROM users';
        let params = [];

        if (rol === 'profesor') {
            // Si se proporciona rol=profesor, buscar solo los usuarios con ese rol
            query = 'SELECT * FROM users WHERE rol = ?';
            params = [rol];
        }

        const [rows] = await pool.query(query, params);

        if (rol === 'profesor') {
            // Si se buscaron profesores, enviar la respuesta con los profesores
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron usuarios con el rol de profesor' });
            }
            res.json({ rol: rol, usuarios: rows }); // Enviar un objeto con el rol y los usuarios
        } else {
            // Si se buscaron todos los usuarios, enviar la respuesta con los usuarios
            res.json(rows);
        }

    } catch (err) {
        console.error("Error al obtener el listado de users:", err);
        res.status(500).json({ message: 'Error interno del Servidor' });
    };
};

//! FUNCION asincrona findone 
async function getUserById(req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id]); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({ message: 'usuario no encontrado' })
        }
        res.json(rows[0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener usuario por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor' });
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
    const { nombre, rol } = req.body; // Capturamos el nombre y el rol del body

    if (!nombre && !rol) {
        return res.status(400).json({ message: 'Debe proporcionar al menos un nombre o rol para actualizar el usuario.' });
    }

    // Validación del nombre (EXISTENTE)
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

    // Validación del rol
    function validarRol(rol) {
        const rolesPermitidos = ['admin', 'profesor', 'alumno']; // Lista de roles permitidos
        if (!rolesPermitidos.includes(rol)) {
            return 'El rol proporcionado no es válido. Los roles permitidos son: ' + rolesPermitidos.join(', ');
        }
        return null;
    }

    if (nombre) {
        const validacionNombre = validarNombre(nombre);
        if (validacionNombre) {
            return res.status(400).json({ message: validacionNombre });
        }
    }

    if (rol) {
        const validacionRol = validarRol(rol);
        if (validacionRol) {
            return res.status(400).json({ message: validacionRol });
        }
    }

    try {
        // Construir la consulta UPDATE dinámicamente
        const updates = [];
        const params = [];

        if (nombre) {
            updates.push('nombre = ?');
            params.push(nombre);
        }

        if (rol) {
            updates.push('rol = ?');
            params.push(rol);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        let query = 'UPDATE Users SET ' + updates.join(', ') + ' WHERE id_usuario = ?';
        params.push(id);

        const [result] = await pool.query(query, params);

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