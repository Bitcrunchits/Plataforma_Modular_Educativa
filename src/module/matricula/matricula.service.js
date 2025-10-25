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
    // Buscamos usando los NOMBRES DE LA RELACIÓN definidos en Matricula.entity.js: 'estudiante' y 'materia'.
    const matriculaExistente = await matriculaRepository.findOne({
        where: {
            estudiante: { id_usuario }, // Usamos el nombre de la relación 'estudiante'
            materia: { id_materia },     // Usamos el nombre de la relación 'materia'
        },
        // Mantenemos las relaciones aquí solo para asegurar que la búsqueda sea precisa.
        relations: {
            estudiante: true,
            materia: true
        }
    });

    if (matriculaExistente) {
        const error = new Error("El alumno ya se encuentra matriculado en esta materia.");
        error.status = 409; // Conflict
        throw error;
    }

    // 4. Crear y guardar la matrícula (¡Optimizado!)
    // Al asignar los objetos 'alumno' y 'materia', TypeORM usa las FK y CARGA las relaciones en el resultado.
    const nuevaMatricula = matriculaRepository.create({
        estudiante: alumno, // Relación 'estudiante' (objeto User)
        materia: materia, // Relación 'materia' (objeto Materia)
    });

    // El resultado de save() ya contendrá los objetos 'estudiante' y 'materia' cargados.
    return await matriculaRepository.save(nuevaMatricula);
};