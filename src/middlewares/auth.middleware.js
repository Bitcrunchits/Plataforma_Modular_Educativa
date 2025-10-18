// src/middlewares/auth.middleware.js

import passport from 'passport';

/**
 * Middleware de autenticación JWT.
 * Llama a la estrategia 'jwt' configurada en passport.js.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 * @returns {function} Un middleware de Express que protege la ruta.
 */
export const authMiddleware = (req, res, next) => {
    // 1. Llama a la función de autenticación de Passport con la estrategia 'jwt'.
    // { session: false } asegura que no se usen sesiones basadas en cookies.
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        
        // 2. Si hay un error de servidor (ej. error de DB)
        if (err) {
            console.error('Error en authMiddleware:', err);
            return next(err); 
        }

        // 3. Si el usuario NO fue autenticado (token inválido, expirado, o usuario no encontrado)
        if (!user) {
            const authError = new Error('Acceso no autorizado. Token inválido o no proporcionado.');
            authError.status = 401; // Unauthorized
            return next(authError);
        }

        // 4. Autenticación exitosa: adjunta el usuario a la solicitud (req.user)
        req.user = user;
        
        // 5. Pasa al siguiente middleware o controlador
        next();
    })(req, res, next);
};