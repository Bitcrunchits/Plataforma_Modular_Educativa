

import { registerUser, loginUser } from './user.service.js';
import { getSocketInstance } from '../../providers/socket.provider.js';

/**
 * Registra un nuevo usuario.
 * Controla que solo los 'admin' puedan crear roles 'profesor' o 'admin'.
 *@route POST /users/register
 */
export const register = async (req, res, next) => {
    try {
        // 1. Obtener el rol que se intenta crear (del body)
        const { rol } = req.body; 
        
        // 2. Obtener el rol del usuario que realiza la llamada (logueado)
        // Usamos optional chaining para evitar errores si req.user no existe (aunque debería si se usa authMiddleware)
        const callerRole = req.user?.rol; 

        // --- Lógica de Autorización de Creación de Roles ---
        
        // Si el rol a crear es un rol elevado, requiere que el caller sea 'admin'
        if (rol === 'admin') {
            
            if (!callerRole || callerRole !== 'admin') {
                const forbiddenError = new Error(`Acceso denegado. Solo un administrador puede crear usuarios con el rol '${rol}'.`);
                forbiddenError.status = 403; // Forbidden
                return next(forbiddenError);
            }
        } 
        
        // Mantenemos la línea de desestructuración original tal como la deseas:
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

