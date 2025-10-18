//* Este archivo implementa la lógica de negocio para el registro y el login.


import { AppDataSource } from "../../providers/database.provider.js";
import UserEntity from "./User.entity.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envs } from '../../configuration/envs.js';

//repositorio de Typeorm para obtener los metodos fr type orm ver "patron de diseño repository"
//!----------------------------------- interactua con la tabla de usuarios
const userRepository = AppDataSource.getRepository(UserEntity)
//!-----------------------------------

const getUserRepository = () => {
    // Si AppDatasource no está inicializado, esto podría fallar, pero
    // index.js garantiza que se llama a initializeDatabase() antes de levantar Express.
    // Usamos el nombre 'User' que definiste en el EntitySchema.
    return AppDataSource.getRepository(UserEntity);
}
/**
 * *Genera un JSON Web Token (JWT) para un usuario.
 * @param {Object} user - Objeto de la entidad de usuario.
 * @returns {string} El token JWT generado.
 */

const generateToken = (user) => {
    //el payload del token contiene info esencial pero NO sensible
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    // Firmar el token con el secreto definido en las variables de entorno
    return jwt.sign(payload, envs.JWT_SECRET, {
        expiresIn: '1d',
    });
};


/**
 * *Registra un nuevo usuario en la base de datos.
 * @param {Object} userData - Datos del usuario (nombre, email, password).
 * @returns {Object} Usuario guardado y el token JWT.
 * @throws {Error} Si el usuario ya existe.
 */


export const registerUser = async (userData) => {
    //verifica el si el email existe y tiene email
    const userRepository = getUserRepository();
    const existingUser = await userRepository.findOneBy({ email: userData.email });

    if (existingUser) {
        const error = new Error('El email ya esta resgistrado.');
        error.statusCode = 409; //conflic
        throw error;
    }

    //Encriptaciòn de password inmgresada

    const salt = await bcrypt.genSalt(12);
    const hasedPassword = await bcrypt.hash(userData.password, salt);

    //Crear el nuevo usuario
    const newUser = userRepository.create({
        ...userData,
        password: hasedPassword,
        role: 'student',
    });

    // guardar en la base de datos
    await userRepository.save(newUser);

    // generar el token
    const token = generateToken(newUser);
    const { password, ...userResponse } = newUser;
    return { user: userResponse, token };
};

/**
 * *Autentica un usuario y genera un token JWT.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña sin encriptar.
 * @returns {Object} Usuario y el token JWT.
 * @throws {Error} Si las credenciales son inválidas.
 */

export const loginUser = async (email, password) => {

    const userRepository = getUserRepository();
    //buscar usuario por mail
    const user = await userRepository.findOneBy({ email });

    if (!user) {
        const error = new Error('Credenciales inválidas: Email no encontrado.');
        error.statusCode = 401; //Unauthorized
        throw error;
    }

    //copmparar password encriptada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Credenciales inválidas: Datos incorrectos.');
        error.statusCode = 401;
        throw error;
    }

    //generar TOKEN
    const token = generateToken(user);

    //Retornar el token y la info del user (sin contraseña)
    const { password: _, ...userResponse } = user; //* desestructuracion avanzada de JS  esta dividiendo el objeto en tres partes, el _ es un identificador de descarte de dice a JS "extrae el valor de la propiedad password, pero no lo guardes en ninguna variable que voyu a usar. es decir ignoralo un vez que lo extraigas VER DOCUMENTACION JS"
    //"Del objeto user, extrae la password (y deséchala _), y pon todo lo demás (...) en un objeto limpio llamado userResponse."
    return { user: userResponse, token };
};

/**
 * Busca un usuario por ID. Usado por el middleware de autenticación.
 * @param {number} id - ID del usuario.
 * @returns {Object} La entidad de usuario.
 */

export const findUserById = async (id) => {
    const userRepository = getUserRepository();
    const user = await userRepository.findOneBy({ id });

    if (!user) {
        const error = new Error('Usuario no encontrado.');
        error.statusCode = 404; // Not Found
        throw error;
    }

    // Excluir la contraseña antes de devolver el objeto
    const { password, ...userResponse } = user;
    return userResponse;
};
