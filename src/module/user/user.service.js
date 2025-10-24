import { AppDataSource } from "../../providers/database.provider.js";
import UserEntity from "./User.entity.js"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envs } from "../../configuration/envs.js";


const getUsuarioRepository = () => {

    return AppDataSource.getRepository(UserEntity);
};


/**
 * @description Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Datos de registro (nombre, email, username, password).
 * @returns {Promise<object>} Objeto con el token JWT y los datos del usuario.
 */
export const registerUser = async (userData) => {
    const userRepository = getUsuarioRepository();

    // 1. Verificar si el correo o el username ya existen
    const existingUserByEmail = await userRepository.findOneBy({ email: userData.email });
    if (existingUserByEmail) {
        throw new Error('El correo electrónico ya está registrado.');
    }

    const existingUserByUsername = await userRepository.findOneBy({ username: userData.username });
    if (existingUserByUsername) {

        throw new Error('El nombre de usuario ya está en uso.');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Crear el nuevo usuario (TypeORM asigna el rol 'alumno' por defecto según la entidad)
   const newUser = userRepository.create({
    nombre: userData.nombre,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    rol: userData.rol || 'alumno', 
});

    // 4. Guardar el usuario en la base de datos
    await userRepository.save(newUser);

    // 5. Generar JWT (Usamos id_usuario y rol)
    const token = jwt.sign(
        {
            id: newUser.id_usuario, 
            email: newUser.email,
            rol: newUser.rol 
        },
        envs.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Retornar solo los datos seguros (sin el hash de la contraseña)
    return {
        token,
        user: {
            id_usuario: newUser.id_usuario,
            nombre: newUser.nombre,
            username: newUser.username,
            email: newUser.email,
            rol: newUser.rol,
            activo: newUser.activo,
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
        {
            id: user.id_usuario,
            email: user.email,
            rol: user.rol
        },
        envs.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Retornar datos seguros
    return {
        token,
        user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            username: user.username,
            email: user.email,
            rol: user.rol,
            activo: user.activo,
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


    const user = await userRepository.findOneBy({ id_usuario: userId });

    return user;
}
