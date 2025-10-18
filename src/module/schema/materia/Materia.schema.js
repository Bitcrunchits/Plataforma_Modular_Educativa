import joi from 'joi';

// Esuqema de creación de nueva materia
export const createMateriaSchema = joi.object({
    nombre: joi.string().min(3).max(100).required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'any.required': 'El nombre de la materia es obligatorio'
        }),
    descripcion: joi.string().max(5000).optional().allow('') //opcional y que allow pueda ser cadena vacia.
});

//*Esquema para patch de materia
export const updateMateriaSchema = joi.object({
    nombre: joi.string().min(3).max(100).optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
        }),
    descripcion: joi.string().max(5000).allow('').optional(),
})