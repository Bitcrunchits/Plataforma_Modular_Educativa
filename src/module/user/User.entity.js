import { EntitySchema } from 'typeorm';

// Definición de roles (Para usar en el campo 'rol' de la entidad)
const USER_ROLES = ['alumno', 'profesor', 'admin'];

/**
 * Entidad de Usuario (UserEntity).
 * Representa la tabla 'users' en la base de datos.
 */
const UserEntity = new EntitySchema({
  name: 'User', 
  tableName: 'users',
  columns: {
    // ID: Cambiamos a id_usuario para coincidir con la documentación
    id_usuario: { 
      primary: true,
      type: 'int',
      generated: 'increment',
      name: 'id_usuario', // Nombre explícito de la columna en MySQL
    },
    nombre: { // Corregido a 'nombre' (alineado con DTO y doc.)
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
    // Rol: Usando ENUM y nombre 'rol'
    rol: {
      type: 'enum',
      enum: USER_ROLES,
      default: 'alumno', // Usamos 'alumno' como default
    },
    activo: { // COLUMNA AGREGADA
        type: 'boolean',
        default: true, // Por defecto, el usuario está activo
    }
  },
  relations: {
    // Relaciones One-to-Many
    materias: { // Las materias que este usuario enseña
        target: 'Materia',
        type: 'one-to-many',
        inverseSide: 'profesor',
    },
    matriculas: { // Las matrículas que tiene este usuario (si es alumno)
      target: 'Matricula',
      type: 'one-to-many',
      inverseSide: 'usuario',
      nullable: true,
    },
    entregas: { // Las entregas de tareas que tiene este usuario (si es alumno)
        target: 'Entrega',
        type: 'one-to-many',
        inverseSide: 'usuario',
        nullable: true,
    },
  },
});

export default UserEntity;