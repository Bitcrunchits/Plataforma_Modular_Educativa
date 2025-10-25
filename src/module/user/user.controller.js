

import { registerUser, loginUser } from './user.service.js';
import { getSocketInstance } from '../../providers/socket.provider.js';

/**
 * Registra un nuevo usuario.
 *@route POST /users/register
 */

export const register = async (req, res, next) => {
    try {

        const { user, token } = await registerUser(req.body);


        res.status(201).json({
            success: true,
            message: 'Registro exitoso.',
            data: user,
            token,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Inicia sesión para un usuario.
 * @route POST /api/user/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser({ email, password });

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