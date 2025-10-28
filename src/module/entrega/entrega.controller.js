import {
    createEntrega,
    getEntregaById,
    calificarEntrega
} from "./entrega.service.js";

/**
 * @description Controlador para crear una nueva entrega. 
 * Asume que el usuario autenticado es el alumno que realiza la entrega.
 * (POST /api/v1/entregas)
 */
export const createEntregaHandler = async (req, res, next) => {
    try {

        const alumnoId = req.user.id_usuario;
        const entregaData = req.body;
        const nuevaEntrega = await createEntrega(entregaData, alumnoId);

        res.status(201).json({
            message: "Entrega creada exitosamente.",
            data: nuevaEntrega
        });

    } catch (error) {

        next(error);
    }
};

/**
 * @description Controlador para obtener una entrega por su ID.
 * (GET /api/v1/entregas/:id)
 */
export const getEntregaByIdHandler = async (req, res, next) => {
    try {
        const idEntrega = parseInt(req.params.id, 10);

        if (isNaN(idEntrega)) {
            const error = new Error("ID de entrega inválido.");
            error.status = 400;
            throw error;
        }

        const entrega = await getEntregaById(idEntrega);

        res.status(200).json({ data: entrega });

    } catch (error) {
        next(error);
    }
};

/**
 * @description Controlador para calificar una entrega específica. 
 * Asume que el usuario autenticado es el profesor.
 * (PATCH /api/v1/entregas/:id/calificar)
 */
export const calificarEntregaHandler = async (req, res, next) => {
    try {

        const profesorId = req.user.id_usuario;
        const idEntrega = parseInt(req.params.id, 10);
        const calificacionData = req.body;

        if (isNaN(idEntrega)) {
            const error = new Error("ID de entrega inválido.");
            error.status = 400;
            throw error;
        }


        const calif = calificacionData.calificacion;
        if (typeof calif !== 'number' || calif < 0 || calif > 10) {
            const error = new Error("Calificación debe ser un número válido entre 0 y 10.");
            error.status = 400;
            throw error;
        }
         if (calificacionData.comentario_profesor && typeof calificacionData.comentario_profesor !== 'string') {
             const error = new Error("El comentario debe ser texto.");
             error.status = 400;
             throw error;
        }

        const entregaActualizada = await calificarEntrega(idEntrega, calificacionData, profesorId);

        res.status(200).json({
            message: "Entrega calificada exitosamente.",
            data: entregaActualizada
        });

    } catch (error) {
        next(error);
    }
};