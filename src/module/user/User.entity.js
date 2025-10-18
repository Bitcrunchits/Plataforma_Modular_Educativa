import { EntitySchema } from 'typeorm';

// Definición de roles (Para usar en el campo 'role' de la entidad)
const USER_ROLES = ['student', 'teacher', 'admin'];

/**
 * Entidad de Usuario (UserEntity).
 * Representa la tabla 'users' en la base de datos.
 */
const UserEntity = new EntitySchema({
  name: 'User', 
  tableName: 'users',
  columns: {
    // ID: Automático e Incremental
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    name: { // COLUMNA DE NOMBRE (Alineado con el DTO)
      type: 'varchar',
      nullable: false,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false, 
    },
    password: { 
      type: 'varchar',
      nullable: false,
    },
    // Rol: Usando ENUM para restringir a los valores definidos
    role: {
      type: 'enum',
      enum: USER_ROLES,
      default: 'student',
    },
  },
  relations: {
    // La relación debe ser definida en el archivo de entidad correspondiente
    matriculas: {
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'user',
      nullable: true,
    },
  },
});

export default UserEntity;
