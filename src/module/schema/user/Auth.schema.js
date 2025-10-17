import joi from 'joi';


//* Esquema para la validación de registro

export const RegisterSchema = joi.object({
    nombre: joi.string()
        .trim() //elimina espacios al inicio y al final
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'EL nombre debe ser texto.',
            'string.empty': 'El nombre es Obligatorio.',
            'strign.min': 'El nombre debe tener al menos {#limit} caracteres.',
            'strign.mix': 'El nombre no debe exceder {#limit} caracteres.',
            'any.required': 'El nombre es obligatorio.'
        }),
    email: joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.base': 'El email debe ser texto.',
            'string.empty': 'El email es obligatorio.',
            'string.email': 'El email debe ser una dirección válida.',
            'any.required': 'El email es obligatorio.'
        }),

    password: joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'La contraseña debe ser texto.',
            'string.empty': 'La contraseña es obligatoria.',
            'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
            'any.required': 'La contraseña es obligatoria.'
        }),
});

//* Esquema de validación para el inicio de sesión

export const LogisSchema = joi.object({
    email: joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.base': 'El email debe ser texto.',
            'string.empty': 'El email es obligatorio.',
            'string.email': 'El email debe ser una dirección válida.',
            'any.required': 'El email es obligatorio.'
        }),
    password: joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'La contraseña debe ser texto.',
            'string.empty': 'La contraseña es obligatoria.',
            'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
            'any.required': 'La contraseña es obligatoria.'
        }),

});