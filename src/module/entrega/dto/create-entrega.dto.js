import joi from 'joi';

/**
 * @description Esquema de validación para la creación de una nueva entrega (sumisión de tarea).
 * Se utiliza para la ruta POST /entregas.
 * El ID del usuario (alumno) se obtiene del token JWT.
 */
export const CreateEntregaSchema = joi.object({
    
    // El ID de la tarea a la que corresponde esta entrega
    id_tarea: joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID de la tarea debe ser un número entero.',
            'any.required': 'El ID de la tarea es obligatorio.'
        }),
    
    // URL donde se almacena el archivo de la entrega (e.g., S3, Google Drive, etc.)
    archivoAdjuntoUrl: joi.string()
        .uri() // Asegura que es un formato de URL válido
        .max(500)
        .required()
        .messages({
            'string.uri': 'La URL del archivo no es válida.',
            'any.required': 'La URL del archivo adjunto es obligatoria.'
        }),
        
    // Campo opcional para que el alumno añada una nota a su entrega
    comentario_alumno: joi.string()
        .max(2000)
        .optional()
        .allow(null, ''),
});
