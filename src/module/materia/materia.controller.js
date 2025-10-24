import { createMateria, getMateriasByProfesor } from "./materia.service.js";

/**
 * @description Controlador para crear una nueva Materia.
 * Extrae los datos del body y el profesorId del token JWT.
 * @route POST /api/materias
 */

export async function createMateriaController(req, res, next) {
    try {
        const profesorId = req.user.id;
        const materiaData = req.body;
        //llama al servicio para crear la materia
        const nuevaMateria = await createMateria(materiaData, profesorId);
        res.status(201).json({
            message: "Materia creada exitosamente.",
            materia: nuevaMateria
        });
    }
    catch (error) {
        next(error);
    }
};

/**
 * @description Controlador para obtener todas las materias de un profesor.
 * Extrae el profesorId del token JWT.
 * @route GET /api/materias
 */

export async function getMateriasByProfesorController(req, res, next) {
    try {
        const profesorId = req.user.id;
        
        const materias = await getMateriasByProfesor(profesorId);

        if (materias.length === 0) {
            return res.status(200).json({ 
                message: 'No se encontraron materias para este profesor.', 
                materias: [] 
            });
        }

        res.status(200).json({
            message: 'Materias obtenidas exitosamente.',
            materias: materias
        });
    } catch (error) {
        next(error);
    }
};


