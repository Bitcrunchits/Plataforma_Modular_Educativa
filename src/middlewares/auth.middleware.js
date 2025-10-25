import passport from 'passport';

/**
 * @fileoverview Middlewares para la Autenticación (JWT) y Autorización (Roles).
 * Utiliza Passport.js para la autenticación JWT.
 */

// =========================================================================
// 1. MIDDLEWARE DE AUTENTICACIÓN (JWT)
// =========================================================================

/**
 * Middleware principal de autenticación que utiliza la estrategia 'jwt'
 * de Passport.js. Inyecta req.user si el token es válido.
 * @returns {import('express').RequestHandler} Middleware de Express.
 */
export const authMiddleware = (req, res, next) => {
    // Passport autentica usando la estrategia 'jwt' que definimos.
    // session: false asegura que no se use sesión de Express.
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        
        // Manejo de errores de autenticación
        if (err) {
            console.error('[Auth Error]', err.message);
            
            // Reemplazo de ApplicationError por Error estándar con status
            const authError = new Error('Error al procesar el token de autenticación.');
            authError.status = 500;
            return next(authError);
        }

        // Manejo de token inválido o faltante (user será false o null)
        if (!user) {
            // Reemplazo de ApplicationError por Error estándar con status
            const unauthorizedError = new Error('Acceso denegado. Se requiere un token JWT válido.');
            unauthorizedError.status = 401; // Unauthorized
            return next(unauthorizedError);
        }

        // Si la autenticación es exitosa, adjuntamos el usuario al objeto request
        req.user = user;
        next();
    })(req, res, next);
};


// =========================================================================
// 2. MIDDLEWARE DE AUTORIZACIÓN (Verificación de Rol)
// =========================================================================

/**
 * Middleware de autorización que verifica si el usuario autenticado
 * tiene alguno de los roles permitidos.
 * @param {Array<string>} allowedRoles - Array de roles permitidos (ej: ['profesor', 'admin']).
 * @returns {import('express').RequestHandler} Middleware de Express.
 */
export const checkRole = (allowedRoles) => (req, res, next) => {
    
    // NOTA: Asumimos que authMiddleware ya se ejecutó y adjuntó req.user
    
    // 1. Verificar si el usuario está presente (AuthMiddleware debió atrapar esto,
    // pero es un buen chequeo defensivo).
    if (!req.user) {
        // Reemplazo de ApplicationError por Error estándar con status
        const unauthorizedError = new Error("Acceso denegado. Se requiere autenticación previa.");
        unauthorizedError.status = 401; // Unauthorized
        return next(unauthorizedError);
    }

    const userRole = req.user.rol; // El rol viene del payload del token (inyectado en req.user)

    // 2. Verificar si el rol del usuario está en la lista de roles permitidos
    if (allowedRoles.includes(userRole)) {
        // Rol permitido. Continuar.
        next();
    } else {
        // 3. Acceso prohibido (403 Forbidden)
        const rolesStr = allowedRoles.join(', ');
        // Reemplazo de ApplicationError por Error estándar con status
        const forbiddenError = new Error(`Acceso prohibido. Se requiere uno de los roles: ${rolesStr}. Su rol es: ${userRole}.`);
        forbiddenError.status = 403; // Forbidden
        next(forbiddenError);
    }
};
