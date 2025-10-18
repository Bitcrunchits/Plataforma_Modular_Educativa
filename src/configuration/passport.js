import passport from "passport";
import{ Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { envs } from "./envs.js";
import { findUserById } from "../module/user/user.service.js";

//strategia de JWT
const options = { 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    secretOrKey: envs.JWT_SECRET,
};

/**
 * Función que inicializa y configura la estrategia JWT para Passport.
 * @param {Object} jwtPayload - La carga útil (payload) decodificada del token JWT (contiene { id, email, role }).
 * @param {Function} done - Callback de Passport (similar a next()).
 */

const configureJwtStrategy = new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        // Buscar al usuario en la DB usando el ID que viene en el token (payload)
        const user = await findUserById(jwtPayload.id);

        if (user) {
            // Usuario encontrado: la autenticación es exitosa
            return done(null, user); // Retorna el usuario en req.user
        } else {
            // Token válido, pero el usuario ya no existe en la DB
            return done(null, false);
        }
    } catch (error) {
        // Manejo de errores de DB o cualquier otra excepción
        return done(error, false);
    }
});

//registrar estrategia con passport
passport.use(configureJwtStrategy);

//exportar la instancia
export default passport;