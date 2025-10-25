import { createMatricula } from "./matricula.service.js";


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
            throw new ApplicationError("Faltan datos requeridos: se necesitan id_usuario (alumno) e id_materia.", 400);
        }

        // 2. Llamada al servicio
        const matricula = await createMatricula({
            id_usuario: parseInt(id_usuario, 10),
            id_materia: parseInt(id_materia, 10),
        });

        // 3. Respuesta exitosa
        res.status(201).json({
            message: "Matrícula creada exitosamente.",
            matricula: {
                id_matricula: matricula.id_matricula,
                // id_usuario: matricula.id_usuario.id_usuario, // Solo el ID del Alumno
                // id_materia: matricula.id_materia.id_materia, // Solo el ID de la Materia
                fecha_matricula: matricula.fecha_matricula
            }
        });

    } catch (error) {
        // Pasa el error al middleware de errores
        next(error);
    }
};