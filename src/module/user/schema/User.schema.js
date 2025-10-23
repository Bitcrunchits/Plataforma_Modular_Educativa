import joi from 'joi';

/**
 * @description Esquema de validación para la creación de un nuevo usuario.
 * Se utiliza para la ruta POST /users/register.
 */
export const registerSchema = joi.object({
    nombre: joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'El nombre es obligatorio.',
            'string.min': 'El nombre debe tener al menos 3 caracteres.',
        }),

    email: joi.string()
        .email({ tlds: { allow: false } }) // Permite cualquier dominio, pero exige formato de email
        .required()
        .messages({
            'string.empty': 'El email es obligatorio.',
            'string.email': 'El email no tiene un formato válido.',
        }),

    username: joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'El username es obligatorio.',
            'string.min': 'El username debe tener al menos 3 caracteres.',
        }),

    password: joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'La contraseña es obligatoria.',
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        }),
});
