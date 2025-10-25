import { AppDataSource } from "../../providers/database.provider.js";
import MatriculaEntity from "./Matricula.entity.js";
import UserEntity from "../user/User.entity.js";
import MateriaEntity from "../materia/Materia.entity.js";

/**
 * @fileoverview Servicios para la gestión de matrículas.
 */

/**
 * Obtiene el repositorio de la entidad Matricula.
 */
const getMatriculaRepository = () => AppDataSource.getRepository(MatriculaEntity);

/**
 * Registra un alumno a una materia (crea una nueva matrícula).
 * @param {object} matriculaData - Datos de la matrícula ({ id_usuario, id_materia }).
 * @returns {Promise<MatriculaEntity>} La matrícula creada.
 * @throws {Error} Si el usuario o la materia no existen, o si ya está matriculado.
 */
export const createMatricula = async (matriculaData) => {
    const { id_usuario, id_materia } = matriculaData;

    const matriculaRepository = getMatriculaRepository();
    const userRepository = AppDataSource.getRepository(UserEntity);
    const materiaRepository = AppDataSource.getRepository(MateriaEntity);

    // 1. Verificar existencia del Alumno y su rol
    const alumno = await userRepository.findOneBy({ id_usuario, rol: 'alumno' });
    if (!alumno) {
        const error = new Error("El usuario especificado no existe o no tiene el rol de 'alumno'.");
        error.status = 404; // Not Found
        throw error;
    }

    // 2. Verificar existencia de la Materia
    const materia = await materiaRepository.findOneBy({ id_materia });
    if (!materia) {
        const error = new Error("La materia especificada no existe.");
        error.status = 404; // Not Found
        throw error;
    }


    // 3. Verificar unicidad de la matrícula
    // BUSCAMOS DIRECTAMENTE POR LAS CLAVES FORÁNEAS (id_usuario, id_materia)
    const matriculaExistente = await matriculaRepository.findOneBy({
        id_usuario: id_usuario, // Asumiendo que esta columna FK existe
        id_materia: id_materia, // Asumiendo que esta columna FK existe
    });

    if (matriculaExistente) {
        const error = new Error("El alumno ya se encuentra matriculado en esta materia.");
        error.status = 409; // Conflict
        throw error;
    }

    // 4. Crear y guardar la matrícula
    const nuevaMatricula = matriculaRepository.create({
        // Si tu entidad Matricula usa 'estudiante' y 'materia' como nombres de relación,
        // pasamos los objetos completos.
        estudiante: alumno,
        materia: materia,

        // También incluimos los IDs de forma redundante (opcional, pero ayuda a TypeORM)
        id_usuario: id_usuario,
        id_materia: id_materia,
    });

    // El resultado de save() ya contendrá los objetos 'estudiante' y 'materia' cargados.
    return await matriculaRepository.save(nuevaMatricula);
};

/**
 * Obtiene todas las matrículas (alumnos) para una materia específica.
 * @param {number} idMateria - ID de la materia.
 * @returns {Promise<MatriculaEntity[]>} Lista de matrículas con el alumno cargado.
 */
export const getMatriculasByMateriaId = async (idMateria) => {
    const matriculaRepository = getMatriculaRepository();

    // Verificamos primero si la materia existe (opcional, pero buena práctica)
    const materiaRepository = AppDataSource.getRepository(MateriaEntity);
    const materia = await materiaRepository.findOneBy({ id_materia: idMateria });

    if (!materia) {
        const error = new Error(`Materia con ID ${idMateria} no encontrada.`);
        error.status = 404;
        throw error;
    }

    // Usamos find para obtener todas las matrículas y cargamos la relación 'estudiante'
    const matriculas = await matriculaRepository.find({
        where: { id_materia: idMateria },
        relations: ['estudiante', 'materia'], // Cargamos el objeto alumno y materia
        select: {
            id_matricula: true,
            fecha_matricula: true,

            estudiante: {
                id_usuario: true,
                nombre: true,
                username: true,
                email: true,
                rol: true
            }
        }
    });

    return matriculas;
};

/**
 * Obtiene todas las matrículas (materias) para un usuario específico (alumno).
 * @param {number} idUsuario - ID del usuario/alumno.
 * @returns {Promise<MatriculaEntity[]>} Lista de matrículas con la materia cargada.
 */
export const getMatriculasByUserId = async (idUsuario) => {
    const matriculaRepository = getMatriculaRepository();

    const matriculas = await matriculaRepository.find({
        where: { id_usuario: idUsuario },
        relations: ['materia'], // Cargamos el objeto materia
        select: {
            id_matricula: true,
            fecha_matricula: true,

            materia: {
                id_materia: true,
                nom_materia: true,
                descripcion: true
            }
        }
    });

    return matriculas;
};