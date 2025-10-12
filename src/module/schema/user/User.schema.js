import joi, { valid } from 'joi';

const USER_ROLES = ['estudent', 'teacher'];

//* esquema para la creación de un nuevo ususario (registro)
//*DTO entrada
export const createUserSchema = joi.object({

    email: joi.string().email().required()
        .messages({
            'string.email': 'El email debe ser válido',
            'any.required': 'El email es obligatorio'
        }),

    password: joi.string().min(8).required()
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'any.requiered': 'La contraseña es obligatoria'
        }),

    role: joi.string().valid(...USER_ROLES).default('student').optional(),

});

//* Esquema para actualización parcial de usuario (PATCH)

export const updateUserSchema = joi.object({
    email: joi.string().email().optional(), //no es requerido para patch
    password: joi.string().min(8).optional(),
    role: joi.string().valid(...USER_ROLES).optional(),
})