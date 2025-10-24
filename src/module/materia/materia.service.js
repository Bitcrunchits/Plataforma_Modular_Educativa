import { AppDataSource } from "../../providers/database.provider.js";
import  MateriaEntity  from "./Materia.entity.js";

//Obtener el repository de typeorm para la entidad Materia
const materiaRepository = AppDataSource.getRepository(MateriaEntity);

/**
 * @description Crea una nueva materia en la base de datos, asignándola al profesor (userId) que la crea.
 * @param {object} materiaData Datos de la materia (nombre, descripcion).
 * @param {number} profesorId ID del usuario autenticado que actúa como profesor.
 * @returns {Promise<MateriaEntity>} La materia recién creada.
 */

export async function createMateria(materiaData, profesorId) {
    // 1. Desestructuramos para ignorar el 'id_profesor' que viene del body.
    const { id_profesor, ...dataToSave } = materiaData; 

    
    const nuevaMateria = materiaRepository.create({
        ...dataToSave,
        // ASIGNACIÓN CLAVE: Usar el nombre de la columna FK (id_profesor) y el ID del token
        id_profesor: profesorId, 
        
    });
    
    try {
        // 3. Guardar la materia en DB
        await materiaRepository.save(nuevaMateria);

        // Retornar la nueva materia
        return nuevaMateria;
    } catch (error) {
        console.error("Error al crear la materia en el servicio:", error);
        
        throw new Error('Error de base de datos al intentar crea la materia.');
    }
};

/**
 * @description Obtiene todas las materias creadas por un profesor específico.
 * @param {number} profesorId ID del profesor/usuario autenticado.
 * @returns {Promise<MateriaEntity[]>} Lista de materias.
 */
export async function getMateriasByProfesor(profesorId) {
    try {
        const materias = await materiaRepository.find({
            where: {
                profesor: { id: profesorId }
            },
        });
        return materias;
    } catch (error) {
        console.error("Error al obtener materias:", error);
        throw new Error("Error de base de datos al obtener las materias.");
    }

};