import joi from 'joi';

//*Esquema para la creacipon de entregas 

export const createEntregaSchema = joi.object({
    archivoUrl: joi.string().uri().required()
        .messages({
            'string.uri': 'La URL del archivo debe tener un formato de enlace válido',
            'any.required': 'La URL del archivo de la entrega es obligatorio'
        }),
    usuarioId: joi.number().integer().required(),

    tareaId: joi.number().integer().required(),
});

//esquema para la calificación de entrega.

export const calificarEntregaSchema = joi.object({
    // dos decimales, escala del 0 al 100 minimo cero
    calificacion: joi.number().precision(2).min(0).max(100).required(),
})