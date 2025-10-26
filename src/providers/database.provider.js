import { DataSource } from "typeorm";
import UserEntity from "../module/user/User.entity.js";
import MateriaEntity from "../module/materia/Materia.entity.js";
import TareaEntity from "../module/tarea/Tarea.entity.js";
import EntregaEntity from "../module/entrega/Entrega.entity.js";
import MatriculaEntity from "../module/matricula/Matricula.entity.js";

import { envs } from '../configuration/envs.js';

export const AppDataSource = new DataSource({
    type: envs.DB_TYPE,
    host: envs.DB_HOST, 
    port: envs.DB_PORT,
    username: envs.DB_USER,
    // password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    
    entities: [
        UserEntity,
        MateriaEntity,
        TareaEntity,
        EntregaEntity,
        MatriculaEntity
    ],
    synchronize: true,
    logging: true,
});

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("✅ Conexión a MySQL establecida con éxito.");
            console.log("📊 Base de datos: escuela3");
            console.log("🗃️ TypeORM creará las tablas automáticamente...");
        }
    } catch (error) {
        console.error("❌ Error al inicializar la base de datos:", error.message);
        throw new Error("Fallo en la conexión de la base de datos.");
    }
};