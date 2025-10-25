import joi from 'joi';

/**
 * @description Esquema de validación para la creación de una nueva tarea (POST /tareas).
 */
export const CreateTareaSchema = joi.object({
    // El nombre de la tarea (obligatorio)
    titulo: joi.string()
        .min(5)
        .max(150)
        .required()
        .messages({
            'string.min': 'El título debe tener al menos 5 caracteres.',
            'any.required': 'El título de la tarea es obligatorio.'
        }),
    
    // Las instrucciones o descripción de la tarea (obligatorio)
    descripcion: joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres.',
            'any.required': 'La descripción de la tarea es obligatoria.'
        }),
        
    // La fecha de entrega (obligatorio)
    fecha_entrega: joi.date() // Usamos Joi.date() ya que el JSON vendrá como string ISO (TypeORM lo convertirá)
        .iso() // Aseguramos que es formato ISO 8601
        .required()
        .messages({
            'date.base': 'La fecha de entrega debe ser una fecha válida.',
            'any.required': 'La fecha de entrega es obligatoria.'
        }),
        
    // La clave foránea de Materia (obligatorio)
    id_materia: joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID de la materia debe ser un número entero.',
            'any.required': 'El ID de la materia es obligatorio.'
        }),
    
    // Campo opcional, que solo será necesario si el servicio lo va a usar
    archivoAdjuntoUrl: joi.string()
        .uri() // Asegura que es un formato de URL válido
        .optional()
        .allow(null, ''),
});
