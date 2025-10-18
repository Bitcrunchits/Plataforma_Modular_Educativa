import { DataSource} from 'typeorm';

import UserEntity from '../module/entity/user/User.entity.js';
import MateriaEntity from'../module/entity/materia/Materia.entity.js';
import TareaEntity from '../module/entity/tarea/Tarea.entity.js';
import EntregaEntity from '../module/entity/entrega/Entrega.entity.js';
import MatriculaEntity from '../module/entity/matricula/Matricula.entity.js';

import { envs } from '../configuration/envs.js';

//instancia de Typeorm DataSource
export const AppDataSource = new DataSource({
    //credenciales de envs
    type: envs.DB_TYPE,
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    database: envs.DATABASE,
    // password: envs.DB_PASSWORD,
    //entitysSchemas
    entities: [
        UserEntity,
        MateriaEntity,
        MatriculaEntity,
        TareaEntity,
        EntregaEntity,
    ],
    synchronize: envs.NODE_ENV === 'development',
    logging: envs.NODE_ENV === 'development'
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conexión a DB establecida y ORM listo")
    } catch (error) {
        console.error(" Error de Conexión a DB:", error);
        process.exit(1)
    }
}