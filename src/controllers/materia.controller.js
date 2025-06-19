import { pool } from '../db/db.js'


//!funcion asincrona findall
async function getAllMaterias(req, res) {
    try {
        const[rows] = await pool.query('SELECT * FROM materia');
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener el listado de materias:",err);
        res.status(500).json({ message: 'Error interno del Servidor'});
    };
    
};

//! FUNCION asincrona findone 
async function getMateriasById ( req, res) {
    const { id } = req.params //creamos una constante para guardar el dato que buscamos 
    try {
        const [rows] = await pool.query('SELECT * FROM materia WHERE id_materia = ?', [id] ); // luego creamos otras constante para guardar los datos del array que vendra del servidor luego de la peticion 
        if (rows.length === 0) {    //leemos el array con un length y lo comparamos con cero por si no hay nada en la respons y que retorne un res status con un json mensage.
            return res.status(404).json({message: 'materia no encontrada'})
        }
        res.json (rows [0]); // en su defecto nos response nos traera un JSON con el contenido de la DB y el cero marca el primer elemento del array
    } catch (err) {
        console.error('Error al obtener materia por ID: ', err); //esto es el manejo de errores si no conecta a la base o pasa algo en el camino nos devolvera este error capturado por el cath.
        res.status(500).json({ message: 'Error de servidor'});
    };
};

//! FUNCION ASINC CREATE con "validacion de profesor autorizado"
async function createMateria(req, res) {
    const { nom_materia, descripcion, id_profesor } = req.body;

    if (!nom_materia || !descripcion || !id_profesor) {
        return res.status(400).json({ message: 'El nombre materia, descripción y nombre profesor son obligatorios' });
    }
    try {
        // Validar que el id_profesor existe y corresponde a un profesor
        const [profesor] = await pool.query('SELECT * FROM Users WHERE id_usuario = ? AND rol = "profesor"', [id_profesor]);
        if (profesor.length === 0) {
            return res.status(400).json({ message: 'El id_profesor no es válido o no corresponde a un profesor.' });
        }

        const [result] = await pool.query('INSERT INTO materia (nom_materia, descripcion, id_profesor) VALUES (?,?,?)', [nom_materia, descripcion, id_profesor]);
        res.status(201).json({ id: result.insertId, message: 'Ha generado una materia nueva exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Código correcto para duplicados
            return res.status(409).json({ message: 'Nombre de materia y profesor ya existen. No se pueden duplicar.' });
        }
        console.error('Error al crear materia: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//! FUNCION ASINC update
async function updateMateria(req, res) {
    const { id } =req.params; //capturamos id del params
    const { nom_materia, descripcion, id_profesor } = req.body; //capturamos los datos del body desestructurandolos

    if(!nom_materia && !descripcion && !id_profesor) { //validamos que los datos no vengan vacios con "o" para que alguno tenga cambios
        return res.status(400).json({ message: 'Debe ingresar al menos un dato de los solicitados' });
    }

    let query = 'UPDATE materia SET ';
    const params = []; //en esta constante de array vacio ingresaremos paso a psao los datos necesarios para isertarlos en la DB
    if (nom_materia) {
        query += 'nom_materia = ?, '; //+= a lo que ya existe le agregamos nom_materia
        params.push(nom_materia); // colocamos el nom_materia en el array params
    }//'UPDATE materia SET 'nom_materia = ?, 'quedando asi la consulta
    
    if (descripcion) {
        query += 'descripcion = ?, '; //+= a lo que ya existe le agregamos descripcion
        params.push(descripcion); // colocamos la descripcion en el array params
    }//'UPDATE materia SET 'nom_materia = ?, descripcion = ?, 'quedando asi la consulta
    
    if (id_profesor) {
        query += 'id_profesor = ? '; //+= a lo que ya existe le agregamos id_profesor
        params.push(id_profesor); // colocamos el id_profesor en el array params
    }//'UPDATE materia SET 'nom_materia = ?, descripcion = ?, id_profesor = ? 'quedando asi la consulta

     // Eliminar la coma extra y el espacio al final
    query = query.slice(0, -2);

    query += 'WHERE id_materia = ?'; //agregamos el where para que sepa que materia actualizar
    params.push(id); //agregamos el id al array params para que sepa que materia actualizar

    try {
        const[result] = await pool.query(query, params); //ejecutamos la consulta con el query y los params
        if (result.affectedRows === 0) { //si no se actualizo nada es decir que no se actualizo niguna linea ---mysql_affected_rows() puede llamarse inmediatamente después de ejecutar una sentencia con mysql_real_query() o mysql_query(). Devuelve el número de filas modificadas, eliminadas o insertadas por la última sentencia, ya sea UPDATE, DELETE o INSERT . Para sentencias SELECT, mysql_affected_rows() funciona como mysql_num_rows().
            return res.status(400).json({ message: 'Materia no encontrada o no se realizaron cambios' });
        } //caso contrario sin errores del affectedRow 
        res.json({ message: 'Materia actualizada exitosamente' }); //responde con un json de exito
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') { //si el error es de duplicado el ER_DUP_ENTRY: ES UN ERROR QUE emite la DB por restricciones, este es capturado en error.code y traducido en el backend y enviado a front para el usuario.
            return res.status(409).json({ message: 'Nombre de materia y profesor ya existen. No se pueden duplicar.' }); //responde con un json de error
        }
        console.error('Error al actualizar materia:', error); //si no es un error de duplicado lo captura y lo muestra por consola
        res.status(500).json({ message: 'Error interno del servidor' }); //responde con un json de error
    }
}



export const materiaController = { 
    getAllMaterias, 
    getMateriasById, 
    createMateria,
    updateMateria
};