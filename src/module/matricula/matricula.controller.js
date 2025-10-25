import { createMatricula, getMatriculasByUserId, getMatriculasByMateriaId } from "./matricula.service.js";


/**
 * @fileoverview Controlador para la gestión de matrículas.
 */

/**
 * Crea una nueva matrícula de alumno a materia.
 * Esta acción típicamente solo debería ser ejecutada por un Profesor o Administrador.
 * !implementamos algunos JSdocs, para autocompletado y documentación JS 
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 */
export const createMatriculaController = async (req, res, next) => {
    try {
        const { id_usuario, id_materia } = req.body;

        // 1. Validación básica de datos de entrada
        if (!id_usuario || !id_materia) {
            const error = new Error("Faltan datos requeridos: se necesitan id_usuario (alumno) e id_materia.");
            error.status = 400; // Bad Request
            throw error;
        }

        // 2. Llamada al servicio
        const matricula = await createMatricula({
            id_usuario: parseInt(id_usuario, 10),
            id_materia: parseInt(id_materia, 10),
        });

        // 3. Respuesta exitosa
        res.status(201).json({
            message: "Matrícula creada exitosamente.",
            data: {
                id_matricula: matricula.id,
                id_usuario: matricula.id_usuario,
                id_materia: matricula.id_materia,
                fecha_matricula: matricula.createdAt,
            }
        });

    } catch (error) {
        // Pasa el error al middleware de errores
        next(error);
    }
};

/**
 * Obtiene las matrículas de un alumno por su ID.
 * @route GET /api/matriculas/user/:userId
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 */
export const getMatriculasByUserIdController = async (req, res, next) => {
    try {
        // El ID del usuario se obtiene del token JWT inyectado por authMiddleware
        const idUsuario = req.user.id; 
        
        const matriculas = await getMatriculasByUserId(idUsuario);

        res.status(200).json({
            message: `Materias matriculadas para el usuario ID ${idUsuario}.`,
            matriculas: matriculas
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene la lista de alumnos matriculados en una materia específica.
 * @route GET /api/matriculas/by-materia/:id_materia
 */
export const getMatriculasByMateriaController = async (req, res, next) => {
    try {
        // Obtiene el id de la materia de los parámetros de la ruta
        const idMateria = parseInt(req.params.id_materia, 10);
        
        if (isNaN(idMateria)) {
            const error = new Error("ID de materia no válido.");
            error.status = 400; // Bad Request
            throw error;
        }
        
        // Llama al servicio para obtener las matrículas
        const matriculas = await getMatriculasByMateriaId(idMateria);

        // Transformamos la respuesta para mostrar solo la info del alumno
        const alumnos = matriculas.map(m => ({
            id_matricula: m.id_matricula,
            fecha_matricula: m.fecha_matricula,
            alumno: m.estudiante
        }));

        res.status(200).json({
            message: `Alumnos matriculados en la materia ID ${idMateria}.`,
            alumnos: alumnos
        });

    } catch (error) {
        next(error);
    }
};