import joi from 'joi';

// esquema para la creación de matricula.
export const createMatriculaSchema = joi.object({
    
    userId: joi.number().integer().required()
    .messages({
        'number.base': 'El ID del usuario debe ser un numero entero',
        'any.required': 'El ID del usuario es obligatorio en la matrícula'
    }),
    materiaId: joi.number(). integer().required()
    .messages({
        'number.base': 'El ID de la materiadebe ser un nunmero entero',
        'any.required': 'El ID de la materia es obligatorio'
    })

})

// Esquema para actualización PATCH de matricula.

export const updateMatriculaSchema = joi.object({
  estado: joi.string().valid('activa', 'inactiva','finalizada').optional(),  
})