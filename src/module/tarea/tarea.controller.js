import { createTarea, getTareasByUserId } from './tarea.service.js';



/**
 * @description Crea una nueva tarea en la base de datos.
 * @route POST /api/tareas
 */
export const create = async (req, res, next) => {
    try {

        const tareaData = req.body;

        const nuevaTarea = await createTarea(tareaData);


        res.status(201).json({
            success: true,
            message: 'Tarea creada con éxito.',
            data: nuevaTarea,
        });

    } catch (error) {
        // Pasa el error al middleware de errores.
        next(error);
    }
};


/**
 * @description Obtiene tareas. Si se pasa id_usuario, filtra por matrículas.
 * @route GET /api/tareas?id_usuario=X
 */
export const getTareas = async (req, res, next) => {
    try {
        const { id_usuario } = req.query;
        let tareas;


        if (id_usuario) {
            // Aseguramos que el ID sea numérico (aunque viene de la URL como string)
            const userId = parseInt(id_usuario);// en esta parte
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de usuario proporcionado no es un número válido.'
                });
            }


            tareas = await getTareasByUserId(userId);

            return res.status(200).json({
                success: true,
                message: `Tareas obtenidas con éxito para el usuario ${userId}.`,
                data: tareas,
            });

        } else {
            // Lógica para obtener TODAS las tareas
            // Por ahora, devolvemos un error si no se proporciona id_usuario, 
            // ya que la lógica principal se centra en el filtrado por alumno.
            return res.status(400).json({
                success: false,
                message: 'Parámetro id_usuario es requerido para listar tareas por alumno.'
            });
        }

    } catch (error) {
        
        next(error);
    }
};