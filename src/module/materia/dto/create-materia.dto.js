import joi from 'joi';

/**
 * @description Esquema de validación para la creación de una nueva materia (POST /materias).
 * Sincronizado con el Body JSON y la Entidad de TypeORM.
 */
export const CreateMateriaSchema = joi.object({
    
    
    nom_materia: joi.string().min(3).max(100).required()
        .messages({
            'string.min': 'El nombre de la materia debe tener al menos 3 caracteres.',
            'any.required': 'El nombre de la materia es obligatorio.'
        }),
        
    
    id_profesor: joi.number().integer().required()
        .messages({
            'number.base': 'El ID del profesor debe ser un número.',
            'any.required': 'El ID del profesor es obligatorio.'
        }),

    activo: joi.boolean().optional().default(true)
        .messages({
            'boolean.base': 'El campo activo debe ser un booleano (true/false).'
        }),

    
    descripcion: joi.string().max(5000).optional().allow('')
        .messages({
            'string.max': 'La descripción no debe exceder los 5000 caracteres.'
        })
});

//*Esquema para patch de materia
export const UpdateMateriaSchema = joi.object({
    nom_materia: joi.string().min(3).max(100).optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
        }),
    descripcion: joi.string().max(5000).allow('').optional(),
    activo: joi.boolean().optional(), // Incluimos activo en la actualización
    id_profesor: joi.number().integer().optional() // Permitimos actualizar el profesor si es necesario
});
