import joi from 'joi';



/**
 * @description Esquema de validación para el registro de nuevos usuarios (POST /users/register).
 * Incluye nombre, email, username y password.
 */
export const RegisterSchema = joi.object({
    
    nombre: joi.string().min(3).max(100).required().messages({
        'string.base': 'El nombre debe ser texto.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede exceder los 100 caracteres.',
        'any.required': 'El nombre es obligatorio.'
    }),

    email: joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.base': 'El email debe ser texto.',
        'string.empty': 'El email no puede estar vacío.',
        'string.email': 'El email debe ser una dirección de correo válida.',
        'any.required': 'El email es obligatorio.'
    }),

    username: joi.string().min(3).max(50).required().messages({
        'string.base': 'El username debe ser texto.',
        'string.empty': 'El username no puede estar vacío.',
        'string.min': 'El username debe tener al menos 3 caracteres.',
        'any.required': 'El username es obligatorio.'
    }),

    password: joi.string().min(8).required().messages({
        'string.base': 'La contraseña debe ser texto.',
        'string.empty': 'La contraseña no puede estar vacía.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'any.required': 'La contraseña es obligatoria.'
    }),
});

/**
 * @description Esquema de validación para el inicio de sesión (POST /users/login).
 * Requiere email y password.
 */
export const LoginSchema = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'El email debe ser una dirección de correo válida.',
        'any.required': 'El email es obligatorio.'
    }),
    password: joi.string().required().messages({
        'any.required': 'La contraseña es obligatoria.'
    })
});
