import { DataSource } from "typeorm";
// Importamos todas las entidades del proyecto
import UserEntity from "../module/user/User.entity.js"; // CORREGIDO: Ruta limpia
import MateriaEntity from "../module/materia/Materia.entity.js";
import TareaEntity from "../module/tarea/Tarea.entity.js";
import EntregaEntity from "../module/entrega/Entrega.entity.js";
import MatriculaEntity from "../module/matricula/Matricula.entity.js";

// Importación de variables de entorno
import { envs } from '../configuration/envs.js';


/**
 * @type {DataSource}
 * Objeto principal de conexión y configuración de TypeORM.
 */
export const AppDataSource = new DataSource({
    type: envs.DB_TYPE,
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    // password: envs.DB_PASSWORD,
    database: envs.DB_NAME, // Usamos DB_NAME del envs.js corregido

    // Lista de todas las entidades para que TypeORM sepa qué tablas manejar
    entities: [
        UserEntity,
        MateriaEntity,
        TareaEntity,
        EntregaEntity,
        MatriculaEntity
    ],
    synchronize: true, //! Esto debe ser false en producción.
    logging: false,
});

/**
 * Inicializa la conexión a la base de datos.
 */
export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log(" Conexión a la Base de Datos establecida con éxito.");
        }
    } catch (error) {
        console.error(" Error al inicializar la base de datos:", error);
        throw new Error("Fallo en la conexión de la base de datos.");
    }
};
