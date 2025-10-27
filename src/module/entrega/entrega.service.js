import { AppDataSource } from "../../providers/database.provider.js";
import EntregaEntity from "./Entrega.entity.js";
import TareaEntity from "../tarea/Tarea.entity.js";
import MatriculaEntity from "../matricula/Matricula.entity.js";
import UserEntity from "../user/User.entity.js"; // Necesario para la función de calificación

// Repositorios
const getEntregaRepository = () => AppDataSource.getRepository(EntregaEntity);
const getTareaRepository = () => AppDataSource.getRepository(TareaEntity);
const getMatriculaRepository = () => AppDataSource.getRepository(MatriculaEntity);
const getUserRepository = () => AppDataSource.getRepository(UserEntity);


/**
 * @description Crea una nueva entrega de tarea (sumisión) por parte de un alumno.
 * Implementa validaciones de negocio: existencia de tarea, matrícula y duplicidad.
 * @param {object} entregaData - Datos de la entrega (id_tarea, archivoAdjuntoUrl, comentario_alumno).
 * @param {number} alumnoId - ID del usuario (alumno) obtenido del token JWT.
 * @returns {Promise<object>} La entrega recién creada.
 */
export const createEntrega = async (entregaData, alumnoId) => {
    const entregaRepository = getEntregaRepository();
    const tareaRepository = getTareaRepository();
    const matriculaRepository = getMatriculaRepository();
    
    // Desestructurar datos para claridad
    const { id_tarea, archivoAdjuntoUrl, comentario_alumno } = entregaData;

    // 1. Verificar la existencia de la Tarea.
    // Usamos 'id_tarea' como propiedad del objeto TypeORM
    const tarea = await tareaRepository.findOne({ 
        where: { id: id_tarea },
        relations: ['materia'], // Necesitamos la relación para obtener id_materia
    });

    if (!tarea) {
        const error = new Error(`Tarea con ID ${id_tarea} no encontrada.`);
        error.status = 404;
        throw error;
    }

    // 2. Verificar si el Alumno está matriculado en la Materia de esta Tarea.
    // La clave foránea en Tarea.entity.js es 'id_materia'
    const idMateriaDeTarea = tarea.materia.id_materia; 

    const matricula = await matriculaRepository.findOneBy({
        id_usuario: alumnoId,
        id_materia: idMateriaDeTarea,
    });

    if (!matricula) {
        const error = new Error(`El usuario (ID: ${alumnoId}) no está matriculado en la materia de esta tarea.`);
        error.status = 403; // Prohibido
        throw error;
    }

    // 3. Verificar si ya existe una entrega para esta Tarea por este Alumno.
    const existingEntrega = await entregaRepository.findOneBy({
        id_usuario: alumnoId,
        id_tarea: id_tarea,
    });

    if (existingEntrega) {
        const error = new Error(`Ya existe una entrega para la Tarea ID ${id_tarea} por el Alumno ID ${alumnoId}.`);
        error.status = 409; // Conflicto
        throw error;
    }
    
    // 4. Crear el objeto de la nueva entrega
    const nuevaEntrega = entregaRepository.create({
        id_tarea: id_tarea,
        id_usuario: alumnoId, // Se inyecta el ID del alumno desde el token
        archivoAdjuntoUrl: archivoAdjuntoUrl,
        comentario: comentario_alumno,
    });

    // 5. Guardar en la base de datos
    await entregaRepository.save(nuevaEntrega);

    return nuevaEntrega;
};

/**
 * @description Obtiene los detalles de una entrega por su ID.
 * Incluye la Tarea y el Alumno relacionados para contexto.
 * @param {number} idEntrega - ID de la entrega a buscar.
 * @returns {Promise<object>} La entrega encontrada.
 */
export const getEntregaById = async (idEntrega) => {
    const entregaRepository = getEntregaRepository();
    
    const entrega = await entregaRepository.findOne({
        where: { id: idEntrega },
        // Traer la Tarea y la información del Alumno que hizo la entrega
        relations: ['tarea', 'alumno'],
    });

    if (!entrega) {
        const error = new Error(`Entrega con ID ${idEntrega} no encontrada.`);
        error.status = 404;
        throw error;
    }

    return entrega;
};


/**
 * @description Califica una entrega, solo si el profesor está autorizado a calificar.
 * NOTA: La validación de que el profesor enseña la materia de la tarea se haría
 * en el Controller (middleware de autorización de rol).
 * @param {number} idEntrega - ID de la entrega a calificar.
 * @param {object} calificacionData - Datos de la calificación (calificacion, comentario_profesor).
 * @param {number} profesorId - ID del usuario (profesor) que realiza la calificación.
 * @returns {Promise<object>} La entrega actualizada.
 */
export const calificarEntrega = async (idEntrega, calificacionData, profesorId) => {
    const entregaRepository = getEntregaRepository();
    const userRepository = getUserRepository();
    const tareaRepository = getTareaRepository();

    //  Verificar si el usuario es realmente un profesor
    const profesor = await userRepository.findOneBy({ id_usuario: profesorId, rol: 'profesor' });
    if (!profesor) {
        const error = new Error("Solo los profesores pueden calificar entregas.");
        error.status = 403;
        throw error;
    }

    //  Obtener la entrega y asegurar que exista
    let entrega = await entregaRepository.findOne({
        where: { id: idEntrega },
        relations: ['tarea'], // Necesitamos la Tarea para obtener la Materia
    });

    if (!entrega) {
        const error = new Error(`Entrega con ID ${idEntrega} no encontrada.`);
        error.status = 404;
        throw error;
    }
    

    //  Aplicar la calificación y comentario
    entrega.calificacion = calificacionData.calificacion;
    entrega.comentario = calificacionData.comentario_profesor; // Usamos el campo 'comentario' para el feedback del profesor

    // Guardar la entrega actualizada
    await entregaRepository.save(entrega);

    return entrega;
};
