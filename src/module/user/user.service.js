import { AppDataSource } from "../../providers/database.provider.js";
import UserEntity from "./User.entity.js"; // Importación de la EntitySchema
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envs } from "../../configuration/envs.js";


const getUsuarioRepository = () => {

    return AppDataSource.getRepository(UserEntity);
};


/**
 * @description Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Datos de registro (name, email, password).
 * @returns {Promise<object>} Objeto con el token JWT y los datos del usuario.
 */
export const registerUser = async (userData) => {
    const userRepository = getUsuarioRepository();

    // 1. Verificar si el usuario ya existe
    const existingUser = await userRepository.findOneBy({ email: userData.email });
    if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Crear el nuevo usuario
    const newUser = userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        // El rol por defecto es 'student' según la entidad
    });

    // 4. Guardar el usuario en la base de datos
    await userRepository.save(newUser);

    // 5. Generar JWT (Incluimos ID, email y rol)
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        envs.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Retornar solo los datos seguros (sin el hash de la contraseña)
    return {
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    };
};

/**
 * @description Autentica al usuario.
 * @param {object} credentials - Credenciales (email, password).
 * @returns {Promise<object>} Objeto con el token JWT y los datos del usuario.
 */
export const loginUser = async (credentials) => {
    const userRepository = getUsuarioRepository();

    // 1. Buscar usuario por email
    const user = await userRepository.findOneBy({ email: credentials.email });
    if (!user) {
        throw new Error('Credenciales inválidas.');
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas.');
    }

    // 3. Generar JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        envs.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Retornar datos seguros
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};

/**
 * @description Busca un usuario por su ID. Usado por passport.js para autenticación JWT.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<object | null>} Objeto de usuario o null.
 */
export const findUserById = async (userId) => {
    const userRepository = getUsuarioRepository();

    const user = await userRepository.findOneBy({ id: userId });

    // Retornar el objeto de usuario completo si se encuentra
    return user;
}