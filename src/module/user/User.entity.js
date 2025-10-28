import { EntitySchema } from 'typeorm';

// Definición de roles (Para usar en el campo 'rol' de la entidad)
const USER_ROLES = ['alumno', 'profesor', 'admin'];


const UserEntity = new EntitySchema({
  name: 'User', 
  tableName: 'users',
  columns: {
    
    id_usuario: { 
      primary: true,
      type: 'int',
      generated: 'increment',
      name: 'id_usuario', 
    },
    nombre: { 
      type: 'varchar',
      nullable: false,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false, 
    },
    username: { 
      type: 'varchar',
      unique: true,
      nullable: true,
    },
    password: { 
      type: 'varchar',
      nullable: false,
    },
    
    rol: {
      type: 'enum',
      enum: USER_ROLES,
      default: 'alumno', // Usamos 'alumno' como default
    },
    activo: { 
        type: 'boolean',
        default: true, // Por defecto, el usuario está activo
    }
  },
  relations: {
    
    materias: { 
        target: 'Materia',
        type: 'one-to-many',
        inverseSide: 'profesor',
    },
    matriculas: { 
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'id_usuario',
      nullable: true,
    },
    entregas: { 
        target: 'Entrega',
        type: 'one-to-many',
        inverseSide: 'usuario',
        nullable: true,
    },
  },
});

export default UserEntity;