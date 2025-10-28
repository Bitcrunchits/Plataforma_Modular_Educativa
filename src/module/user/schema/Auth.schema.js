import joi from 'joi';

// Define los roles válidos de la aplicación.
const VALID_ROLES = ['alumno', 'profesor', 'admin'];

/**
 * @description Esquema de validación para el registro de nuevos usuarios (POST /users/register).
 * Incluye nombre, email, username, password y rol (opcional y validado).
 */
export const RegisterSchema = joi.object({
    nombre: joi.string().min(3).max(255).required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
    username: joi.string().min(3).max(50).required(),
    password: joi.string().min(8).required(),

    // Es opcional, pero si se envía, debe ser uno de los roles válidos.
    rol: joi.string()
        .valid(...VALID_ROLES)
        .optional()
        .messages({
            'any.only': 'El rol proporcionado no es un valor permitido. Los roles válidos son: ' + VALID_ROLES.join(', '),
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