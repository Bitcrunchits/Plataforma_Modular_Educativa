import joi from 'joi';

export const createTareaSchema = joi.object({

    titulo: joi.string().min(5).required()
    .messages({
        'string.min': 'El titulo debe tener al menos 5 caracteres',
        'any.required': 'El título es obligatorio'
    }),
    instrucciones: joi.string().allow('').optional(),
    fechaInicio: joi.date().optional(),
    fechaEntrega: joi.date().optional(),
    fechaLimite: joi.date().optional(),

});