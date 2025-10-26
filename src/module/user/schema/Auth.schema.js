import joi from 'joi';

/**
 * @description Esquema de validación para el registro de nuevos usuarios (POST /users/register).
 * Incluye nombre, email, username, password y rol (opcional).
 */
// 
   

    export const RegisterSchema = joi.object({
    nombre: joi.string().min(3).max(255).required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
    username: joi.string().min(3).max(50).required(),
    password: joi.string().min(8).required(),
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