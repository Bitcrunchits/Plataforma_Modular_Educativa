import joi from 'joi';

/**
 * @description Esquema de validación para el registro de nuevos usuarios (POST /users/register).
 * Incluye nombre, email, username, password y rol (opcional).
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
        'string.max': 'El username no puede exceder los 50 caracteres.',
        'any.required': 'El username es obligatorio.'
    }),

    password: joi.string().min(8).required().messages({
        'string.base': 'La contraseña debe ser texto.',
        'string.empty': 'La contraseña no puede estar vacía.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'any.required': 'La contraseña es obligatoria.'
    }),
    
    rol: joi.string()
        .valid('alumno', 'profesor', 'admin') // ¡Permitimos 'profesor' aquí!
        .default('alumno')
        .optional()
        .messages({
            'any.only': 'El rol debe ser uno de: alumno, profesor, o admin.',
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