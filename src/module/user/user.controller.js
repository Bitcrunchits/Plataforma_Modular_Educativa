// //------------------testeo E---
import { registerUser, loginUser } from './user.service.js';
import { getSocketInstance } from '../../providers/socket.provider.js';

/**
 * Registra un nuevo usuario.
 * Controla que solo los 'admin' puedan crear roles 'profesor' o 'admin'.
 * @route POST /users/register
 */
export const register = async (req, res, next) => {
  try {
    const { rol } = req.body;
    const callerRole = req.user?.rol;

    if (rol === 'admin' && callerRole !== 'admin') {
      const forbiddenError = new Error(`Acceso denegado. Solo un administrador puede crear usuarios con el rol '${rol}'.`);
      forbiddenError.status = 403;
      return next(forbiddenError);
    }

    const { user, token } = await registerUser(req.body);

    // Emisión de evento Socket.IO
    const io = getSocketInstance();
    if (io) {
      console.log('📡 Emitiendo evento loginUser a todos los clientes:', {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      });

      io.emit('loginUser', {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      });
    } else {
      console.warn('⚠️ No se pudo emitir evento loginUser: instancia de Socket.IO no disponible.');
    }

    res.status(201).json({
      success: true,
      message: 'Registro exitoso.',
      data: user,
      token,
    });

  } catch (error) {
    console.error('❌ Error en registro de usuario:', error);
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
    next(error);
  }
};
