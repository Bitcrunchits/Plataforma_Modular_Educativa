import { AppDataSource } from "../../providers/database.provider.js";
import TareaEntity from "./Tarea.entity.js";
import MateriaEntity from "../materia/Materia.entity.js";
import MatriculaEntity from "../matricula/Matricula.entity.js";

const getTareaRepository = () => {
    return AppDataSource.getRepository(TareaEntity);
};

/**
 * @description Crea una nueva tarea en la base de datos.
 * @param {object} tareaData - Datos de la tarea (titulo, descripcion, fecha_entrega, id_materia).
 * @returns {Promise<object>} La tarea recién creada.
 */
export const createTarea = async (tareaData) => {
    const tareaRepository = getTareaRepository();

    // 1. Verificar que la Materia exista.
    const materiaRepository = AppDataSource.getRepository(MateriaEntity);
    
    
    const idMateriaNumber = Number(tareaData.id_materia);

    const materiaExists = await materiaRepository.findOneBy({ id_materia: idMateriaNumber });

    if (!materiaExists) {
    
        const error = new Error(`Materia con ID ${tareaData.id_materia} no encontrada.`);
        error.status = 404;
        throw error;
    }

    // 2. Crear la nueva tarea
    const nuevaTarea = tareaRepository.create(tareaData);

    // 3. Guardar en la base de datos
    await tareaRepository.save(nuevaTarea);

    return nuevaTarea;
};

/**
 * @description Busca todas las tareas asociadas a las materias a las que un usuario está matriculado.
 * Utiliza QueryBuilder para realizar un INNER JOIN entre Tarea, Materia y Matricula.
 * @param {number} userId - El ID del usuario/alumno.
 * @returns {Promise<Array<object>>} Lista de tareas para ese usuario.
 */
export const getTareasByUserId = async (userId) => {
    const tareaRepository = getTareaRepository();

    
    const tareas = await tareaRepository.createQueryBuilder("tarea")
        // INNER JOIN Tarea -> Materia
        .innerJoin(MateriaEntity, "materia", "tarea.id_materia = materia.id_materia")
        // INNER JOIN Materia -> Matricula
        .innerJoin(MatriculaEntity, "matricula", "materia.id_materia = matricula.id_materia")
        // Condición: filtrar por el id_usuario en la tabla Matricula
        .where("matricula.id_usuario = :userId", { userId })
        // Seleccionamos las columnas de Tarea y de Materia (para saber a qué materia pertenecen)
        .select([
            "tarea.id_tarea",
            "tarea.titulo",
            "tarea.descripcion",
            "tarea.fecha_entrega",
            "materia.nom_materia" // Nombre de la materia para contexto
        ])
        .orderBy("tarea.fecha_entrega", "ASC")
        .getRawMany(); // Usamos getRawMany porque estamos haciendo JOINs manuales

    return tareas;
};
