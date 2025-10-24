import joi from 'joi';

/**
 * Esquema de validación (DTO) para la creación de una nueva Tarea.
 
 */
export const CreateTareaSchema = joi.object({
    titulo: joi.string().trim().min(5).max(150).required()
        .messages({
            'string.empty': 'El título no puede estar vacío.',
            'string.min': 'El título debe tener al menos 5 caracteres.',
            'string.max': 'El título no puede exceder los 150 caracteres.',
            'any.required': 'El título es obligatorio.'
        }),

    descripcion: joi.string().trim().max(500).required()
        .messages({
            'string.empty': 'La descripción no puede estar vacía.',
            'string.max': 'La descripción no puede exceder los 500 caracteres.',
            'any.required': 'La descripción es obligatoria.'
        }),

    // Se valida que sea una fecha válida, aunque se guarda como string en la DB.
    fecha_entrega: joi.date().iso().required()
        .messages({
            'date.base': 'La fecha de entrega debe ser un formato válido (ISO 8601).',
            'any.required': 'La fecha de entrega es obligatoria.'
        }),

    // Debe ser un número entero que exista en la tabla 'materias'
    id_materia: joi.number().integer().required()
        .messages({
            'number.base': 'El ID de materia debe ser un número entero.',
            'any.required': 'El ID de materia es obligatorio.'
        })
});
