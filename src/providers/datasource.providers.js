import { DataSource } from "typeorm";
import UserEntity from "../module/entity/user/User.entity.js";
import MateriaEntity from "../module/entity/materia/Materia.entity.js";
import TareaEntity from "../module/entity/tarea/Tarea.entity.js";
import EntregaEntity from "../module/entity/entrega/Entrega.entity.js";
import MatriculaEntity from "../module/entity/matricula/Matricula.entity.js";

import { validateEnvs as envs } from '../configuration.envs.js';

export const AppDatasource = new DataSource ({
    type: envs.DB_TYPE,
    host: envs.
})