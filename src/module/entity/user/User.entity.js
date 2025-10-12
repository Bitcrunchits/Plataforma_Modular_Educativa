import { EntitySchema } from 'typeorm';

const USER_ROLES = ['student', 'teacher', 'admin'];

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
    email: {
      type: 'varchar',
      unique: true,
    },
    password: { // Almacena el HASH (Requisito de Hashing)
      type: 'varchar',
    },
    // Rol: Usando ENUM para restringir a los valores definidos
    role: {
      type: 'enum',
      enum: USER_ROLES,
      default: 'student',
    },
  },
  relations: {
    matriculas: {
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'user',
    },
  },
});

export default UserEntity;