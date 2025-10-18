// src/module/user/user.controller.js

import { registerUser, loginUser } from './user.service.js';

/**
 * Registra un nuevo usuario.
 * @route POST /users/register
 */
export const register = async (req, res, next) => {
    try {
        // La validación de req.body ya se hizo con validatorMiddleware
        const { user, token } = await registerUser(req.body);

        // 201 Created
        res.status(201).json({
            success: true,
            message: 'Registro exitoso.',
            data: user,
            token,
        });

    } catch (error) {
        // Pasa el error (ej. email ya registrado) al middleware de errores
        next(error);
    }
};

/**
 * Inicia sesión para un usuario.
 * @route POST /api/user/login
 */
export const login = async (req, res, next) => {
    try {
        // La validación de req.body ya se hizo con validatorMiddleware
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);

        // 200 OK
        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso.',
            data: user,
            token,
        });
        
    } catch (error) {
        // Pasa el error (ej. credenciales inválidas) al middleware de errores
        next(error);
    }
};

/**
 * Obtiene el perfil del usuario autenticado.
 * NOTA: req.user es inyectado por el authMiddleware.
 * @route GET /api/user/profile
 */
export const getProfile = (req, res, next) => {
    try {
        // req.user ya contiene la información limpia del usuario (sin contraseña)
        // gracias a la función findUserById usada en el middleware de Passport.
        res.status(200).json({
            success: true,
            message: 'Perfil de usuario obtenido con éxito.',
            data: req.user,
        });
    } catch (error) {
        // Este catch es principalmente para manejar cualquier error inesperado.
        next(error);
    }
};